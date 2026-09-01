import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Loader } from 'lucide-react';

const AnalysisPanel = ({ mediaData, counters, setCounters, setTotalPeople, detectionMode, cameraAngle }) => {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [peopleCount, setPeopleCount] = useState(0);

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

        if (detectionMode === 'crowd') {
          // Crowd Analytics Logic
          drawCrowdBoundingBoxes(people, mediaElement, imgWidth, imgHeight);
        } else {
          // Queue Analysis Logic
          let tempCounters = counters.map(c => ({ ...c, queueCount: 0, peopleList: [] }));
          
          people.forEach(person => {
            const [x, y, width, height] = person.bbox;
            const centerX = (x + width / 2) / imgWidth;
            const centerY = (y + height / 2) / imgHeight;
            
            // Find which region they belong to
            let assignedCounter = null;
            for (let i = 0; i < tempCounters.length; i++) {
              const r = tempCounters[i].region;
              if (centerX >= r.x && centerX <= r.x + r.w && centerY >= r.y && centerY <= r.y + r.h) {
                assignedCounter = i;
                break;
              }
            }
            
            if (assignedCounter !== null) {
              tempCounters[assignedCounter].peopleList.push({
                bbox: person.bbox,
                centerY: centerY,
                waitTime: 0 // Will calculate next
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
          
          setCounters(tempCounters);
          drawBoundingBoxes(tempCounters, mediaElement, imgWidth, imgHeight);
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

  }, [model, mediaData, detectionMode, cameraAngle]);

  const drawCrowdBoundingBoxes = (people, mediaElement, naturalWidth, naturalHeight) => {
    const canvas = canvasRef.current;
    if (!canvas || !mediaElement) return;

    canvas.width = mediaElement.clientWidth;
    canvas.height = mediaElement.clientHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / naturalWidth;
    const scaleY = canvas.height / naturalHeight;

    people.forEach(person => {
      const [x, y, width, height] = person.bbox;
      
      const scaledX = x * scaleX;
      const scaledY = y * scaleY;
      const scaledWidth = width * scaleX;
      const scaledHeight = height * scaleY;

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
    });
  };

  const drawBoundingBoxes = (countersData, mediaElement, naturalWidth, naturalHeight) => {
    const canvas = canvasRef.current;
    if (!canvas || !mediaElement) return;

    // Match canvas size to the exact rendered size of the media element
    canvas.width = mediaElement.clientWidth;
    canvas.height = mediaElement.clientHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Because the container now shrink-wraps the media, clientWidth/Height exactly matches the rendered image
    const scaleX = canvas.width / naturalWidth;
    const scaleY = canvas.height / naturalHeight;

    countersData.forEach(counter => {
      let color = '#3b82f6';
      if (counter.status === 'GREEN') color = '#22c55e';
      if (counter.status === 'YELLOW') color = '#eab308';
      if (counter.status === 'ORANGE') color = '#f97316';
      if (counter.status === 'RED') color = '#ef4444';

      counter.peopleList.forEach(person => {
        const [x, y, width, height] = person.bbox;
        
        const scaledX = x * scaleX;
        const scaledY = y * scaleY;
        const scaledWidth = width * scaleX;
        const scaledHeight = height * scaleY;

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

        ctx.fillStyle = color;
        ctx.fillRect(scaledX, scaledY - 24, 60, 24);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Outfit, sans-serif';
        ctx.fillText(`${person.waitTime} min`, scaledX + 6, scaledY - 8);
      });
    });
  };

  return (
    <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="flex-between">
        <h3>Queue Analysis</h3>
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
              controls 
              loop 
              muted
              style={{ maxWidth: '100%', maxHeight: '65vh', display: 'block' }} 
            />
          )}
          
          <canvas 
            ref={canvasRef} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} 
          />
          
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;
