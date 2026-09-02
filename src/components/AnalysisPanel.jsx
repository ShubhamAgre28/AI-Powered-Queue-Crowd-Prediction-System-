import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Loader } from 'lucide-react';

const AnalysisPanel = ({ mediaData, counters, setCounters, setTotalPeople, setCrowdDensity, detectionMode, cameraAngle }) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [peopleCount, setPeopleCount] = useState(0);
  const [crowdBoxes, setCrowdBoxes] = useState([]);

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load the model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoading(false);
      } catch (error) {
        console.error("Error loading model", error);
      }
    };
    loadModel();
  }, []);

  // Run prediction when media or model is ready
  useEffect(() => {
    if (!model || !mediaData) return;

    const detectFrame = async () => {
      const mediaElement = mediaData.type === 'image' ? imageRef.current : videoRef.current;
      if (!mediaElement) return;

      if (mediaData.type === 'video' && mediaElement.readyState < 2) {
        requestAnimationFrame(detectFrame);
        return;
      }

      try {
        // Lower confidence threshold (minScore=0.2) and increase max boxes (200) to detect dense crowds
        const predictions = await model.detect(mediaElement, 200, 0.2);
        
        // Filter only 'person' class
        const people = predictions.filter(pred => pred.class === 'person');
        setPeopleCount(people.length);
        setTotalPeople(people.length);
        
        const imgWidth = mediaData.type === 'image' ? mediaElement.naturalWidth : mediaElement.videoWidth;
        const imgHeight = mediaData.type === 'image' ? mediaElement.naturalHeight : mediaElement.videoHeight;
        
        // Prevent infinity math if dimensions aren't ready
        if (imgWidth === 0 || imgHeight === 0) {
          requestAnimationFrame(detectFrame);
          return;
        }

        // Calculate crowd density (total bounding box area / image area)
        let totalBoxArea = 0;
        people.forEach(person => {
          const [, , width, height] = person.bbox;
          totalBoxArea += (width * height);
        });
        const currentDensity = (totalBoxArea / (imgWidth * imgHeight)) * 100;
        if (setCrowdDensity) {
          setCrowdDensity(currentDensity);
        }

        if (detectionMode === 'crowd') {
          // Crowd Analytics Logic
          const boxes = people.map((person, idx) => {
            const [x, y, width, height] = person.bbox;
            return {
              id: `crowd-${idx}`,
              css: {
                left: `${(x / imgWidth) * 100}%`,
                top: `${(y / imgHeight) * 100}%`,
                width: `${(width / imgWidth) * 100}%`,
                height: `${(height / imgHeight) * 100}%`
              }
            };
          });
          setCrowdBoxes(boxes);
        } else {
          // Queue Analysis Logic
          setCounters(prevCounters => {
            let tempCounters = prevCounters.map(c => ({ ...c, queueCount: 0, peopleList: [] }));
            
            people.forEach((person, idx) => {
              const [x, y, width, height] = person.bbox;
              
              // Find which counter region this person is in (normalized coordinates)
              const normX = (x + width / 2) / imgWidth;
              const normY = (y + height / 2) / imgHeight;
              
              const assignedCounter = tempCounters.find(c => 
                normX >= c.region.x && normX <= (c.region.x + c.region.w) &&
                normY >= c.region.y && normY <= (c.region.y + c.region.h)
              );
              
              if (assignedCounter) {
                // Determine vertical position for queue ordering
                const centerY = y + height; 
                
                assignedCounter.peopleList.push({
                  id: `person-${idx}`,
                  bbox: person.bbox,
                  centerY: centerY,
                  waitTime: 0, // Will calculate next
                  css: {
                    left: `${(x / imgWidth) * 100}%`,
                    top: `${(y / imgHeight) * 100}%`,
                    width: `${(width / imgWidth) * 100}%`,
                    height: `${(height / imgHeight) * 100}%`
                  }
                });
              }
            });
            
            // Calculate wait times
            tempCounters.forEach(counter => {
              // Sort based on camera angle
              if (cameraAngle === 'bottom') {
                // Counter is at the bottom of the screen (larger Y is front of line)
                counter.peopleList.sort((a, b) => b.centerY - a.centerY);
              } else {
                // Counter is at the top of the screen (smaller Y is front of line)
                counter.peopleList.sort((a, b) => a.centerY - b.centerY);
              }
              
              counter.queueCount = counter.peopleList.length;
              
              counter.peopleList.forEach((person, index) => {
                person.waitTime = Math.round((index + 1) * counter.serviceRate);
              });
              
              counter.waitTime = counter.queueCount > 0 ? counter.peopleList[counter.peopleList.length - 1].waitTime : 0;
              
              // Determine status
              if (counter.waitTime < 10) counter.status = 'GREEN';
              else if (counter.waitTime < 20) counter.status = 'YELLOW';
              else if (counter.waitTime < 30) counter.status = 'ORANGE';
              else counter.status = 'RED';
            });
            
            return tempCounters;
          });
        }

        if (mediaData.type === 'video' && !mediaElement.paused && !mediaElement.ended) {
          requestAnimationFrame(detectFrame);
        }
      } catch (error) {
        console.error("Detection error:", error);
      }
    };

    if (mediaData.type === 'image') {
      if (imageRef.current.complete) {
        detectFrame();
      } else {
        imageRef.current.onload = detectFrame;
      }
    } else if (mediaData.type === 'video') {
      const videoEl = videoRef.current;
      if (videoEl.readyState >= 2) {
        videoEl.play().catch(e => console.log("Autoplay blocked:", e));
        detectFrame();
      } else {
        videoEl.onloadeddata = () => {
          videoEl.play().catch(e => console.log("Autoplay blocked:", e));
          detectFrame();
        };
      }
      // Also hook into 'play' event just in case it was paused and user plays it
      videoEl.onplay = () => {
        detectFrame();
      };
    }

  }, [model, mediaData, detectionMode, cameraAngle, setTotalPeople]);



  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h3 style={{ margin: 0 }}>Queue Analysis</h3>
        </div>
        <div className="badge blue" style={{ fontSize: '1rem', padding: '8px 16px' }}>
          Total Detected: {peopleCount}
        </div>
      </div>

      <div style={{ width: '100%', background: '#000', borderRadius: 'var(--radius-sm)', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', zIndex: 20, color: 'white' }}>
              <Loader size={48} className="spin" style={{ color: 'var(--primary-blue)', marginBottom: '16px', animation: 'spin 2s linear infinite' }} />
              <h3 style={{ margin: 0 }}>Loading AI Model...</h3>
              <p style={{ color: '#cbd5e1' }}>This happens once and runs entirely in your browser.</p>
            </div>
          )}

          {mediaData.type === 'image' ? (
            <img 
              ref={imageRef} 
              src={mediaData.url} 
              alt="Analysis" 
              style={{ maxWidth: '100%', maxHeight: '65vh', display: 'block' }} 
            />
          ) : (
            <video 
              ref={videoRef} 
              src={mediaData.url} 
              autoPlay
              controls 
              loop 
              muted
              style={{ maxWidth: '100%', maxHeight: '65vh', display: 'block' }} 
            />
          )}
          
          {/* DOM Overlays for CSS Animations */}
          {detectionMode === 'crowd' && crowdBoxes.map((box, pIdx) => (
            <div key={box.id} className="animate-box" style={{
              position: 'absolute',
              left: box.css.left,
              top: box.css.top,
              width: box.css.width,
              height: box.css.height,
              border: `3px solid #3b82f6`,
              borderRadius: 'var(--radius-sm)',
              pointerEvents: 'none',
              zIndex: 20,
              animationDelay: `${(pIdx % 10) * 0.05}s`
            }}>
            </div>
          ))}

          {detectionMode === 'queue' && counters.map((counter, cIdx) => (
            (counter.peopleList || []).map((person, pIdx) => {
              const color = counter.status === 'RED' ? '#ef4444' : counter.status === 'ORANGE' ? '#f97316' : counter.status === 'YELLOW' ? '#eab308' : '#22c55e';
              return (
                <div key={`c${cIdx}-p${pIdx}`} className="animate-box" style={{
                  position: 'absolute',
                  left: person.css.left,
                  top: person.css.top,
                  width: person.css.width,
                  height: person.css.height,
                  border: `3px solid ${color}`,
                  borderRadius: 'var(--radius-sm)',
                  pointerEvents: 'none',
                  zIndex: 20
                }}>
                  <div className="animate-badge" style={{
                    position: 'absolute',
                    top: '-32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--bg-color)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--clay-outer)',
                    color: color,
                    fontWeight: 'bold',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    animationDelay: `${0.1 + (pIdx * 0.15)}s`
                  }}>
                    {person.waitTime} min
                  </div>
                </div>
              );
            })
          ))}
          
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
