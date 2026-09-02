import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Play, Loader } from 'lucide-react';

const UploadSection = ({ onMediaReady }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [suggestedMode, setSuggestedMode] = useState(null);

  const scanSteps = [
    "Uploading Media...",
    "Detecting People...",
    "Identifying Queue Regions...",
    "Assigning People to Counters...",
    "Estimating Waiting Times...",
    "Analysis Complete ✓"
  ];

  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (file) => {
    if (!file) return;
    
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (isVideo || isImage) {
      setType(isVideo ? 'video' : 'image');
      setPreviewUrl(URL.createObjectURL(file));
      // In phase 2, we will call onMediaReady and trigger analysis
    } else {
      alert("Please upload a valid image or video file.");
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < scanSteps.length) {
        setScanStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (onMediaReady) {
            onMediaReady({ url: previewUrl, type, mode: suggestedMode });
          }
        }, 500); // Short pause on "Analysis Complete" before transitioning
      }
    }, 600); // 600ms per step
  };

  return (
    <div className="upload-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {!previewUrl ? (
        <div 
          className={`clay-card upload-dropzone animate-enter stagger-1 ${isDragging ? 'dragging' : ''}`}
          style={{
            border: isDragging ? '2px dashed var(--primary-blue)' : '2px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: isDragging ? 'rgba(59, 130, 246, 0.05)' : 'var(--card-bg)',
            transform: isDragging ? 'scale(1.02)' : 'scale(1)'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{
            background: 'var(--bg-color)',
            padding: '16px',
            borderRadius: '50%',
            boxShadow: 'var(--clay-outer-sm)',
            marginBottom: '16px',
            transition: 'transform 0.3s ease',
            transform: isDragging ? 'translateY(-10px)' : 'none'
          }}>
            <UploadCloud size={48} color="var(--primary-blue)" />
          </div>
          
          <h3 style={{ 
            fontSize: '1.4rem', 
            fontWeight: '800',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-blue) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Drag & Drop Media
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', maxWidth: '400px' }}>
            Upload your footage to instantly analyze queue wait times and crowd density. Support for JPG, PNG, MP4.
          </p>
          
          <div className="animate-enter stagger-2" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              className="clay-button" 
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              style={{ padding: '10px 20px', fontSize: '0.95rem' }}
            >
              <ImageIcon size={18} /> Upload Image
            </button>
            <button 
              className="clay-button" 
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              style={{ padding: '10px 20px', fontSize: '0.95rem' }}
            >
              <Video size={20} /> Upload Video
            </button>
          </div>

          <div className="animate-enter stagger-3" style={{ width: '100%', maxWidth: '500px', height: '1px', background: 'linear-gradient(90deg, transparent, #cbd5e1, transparent)', margin: '32px 0 24px 0', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <span style={{ 
              position: 'absolute', 
              top: '-12px', 
              background: 'var(--card-bg, #ffffff)', 
              padding: '0 16px', 
              color: 'var(--text-secondary)', 
              fontSize: '0.75rem',
              fontWeight: 'bold',
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>Or Try Live Samples</span>
          </div>

          <div className="animate-enter stagger-4" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              className="btn" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setType('video');
                setPreviewUrl('/queue-sample.mp4');
                setSuggestedMode('queue');
              }}
              style={{ 
                background: 'rgba(59, 130, 246, 0.1)',
                color: 'var(--primary-blue)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '100px',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
            >
              <Play size={18} fill="currentColor" /> Queue Analytics
            </button>
            <button 
              className="btn" 
              onClick={(e) => { 
                e.stopPropagation(); 
                setType('video');
                setPreviewUrl('/crowd-sample.mp4');
                setSuggestedMode('crowd');
              }}
              style={{ 
                background: 'rgba(168, 85, 247, 0.1)',
                color: 'var(--status-purple)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '100px',
                padding: '10px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'}
            >
              <Play size={18} fill="currentColor" /> Crowd Detection
            </button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,video/*" 
            style={{ display: 'none' }} 
          />
        </div>
      ) : (
        <div className="clay-card preview-section animate-enter stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Media Preview</h3>
            <button className="clay-button" onClick={() => {
              setPreviewUrl(null);
              setFile(null);
              setType(null);
            }}>
              Clear
            </button>
          </div>
          
          <div style={{ position: 'relative', width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: 'var(--radius-sm)', background: '#000' }}>
            {type === 'image' ? (
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }} />
            ) : (
              <video src={previewUrl} controls autoPlay muted loop style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px' }} />
            )}
            
            {/* Overlay for analysis loader with Scanning Animation */}
            {isAnalyzing && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                zIndex: 10
              }}>
                <div className="scanning-line" />
                <Loader size={48} className="spin" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px', color: 'var(--primary-blue)' }} />
                <h2 style={{ margin: 0 }}>{scanSteps[scanStep]}</h2>
              </div>
            )}
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>

          {!isAnalyzing && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <button className="clay-button primary" style={{ fontSize: '1.2rem', padding: '16px 32px' }} onClick={startAnalysis}>
                <Play size={24} /> Start AI Analysis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadSection;
