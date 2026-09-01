import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, Play, Loader } from 'lucide-react';

const UploadSection = ({ onMediaReady }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [type, setType] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      setFile(file);
      setType(isVideo ? 'video' : 'image');
      setPreviewUrl(URL.createObjectURL(file));
      // In phase 2, we will call onMediaReady and trigger analysis
    } else {
      alert("Please upload a valid image or video file.");
    }
  };

  const startAnalysis = () => {
    if (onMediaReady) {
      onMediaReady({ url: previewUrl, type });
    }
  };

  return (
    <div className="upload-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {!previewUrl ? (
        <div 
          className={`clay-card upload-dropzone ${isDragging ? 'dragging' : ''}`}
          style={{
            border: isDragging ? '2px dashed var(--primary-blue)' : '2px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={64} color="var(--primary-blue)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Drag & Drop Image or Video</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Support for JPG, JPEG, PNG, MP4
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="clay-button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              <ImageIcon size={18} /> Upload Image
            </button>
            <button className="clay-button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              <Video size={18} /> Upload Video
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
        <div className="clay-card preview-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          
          <div style={{ position: 'relative', width: '100%', maxHeight: '600px', overflow: 'hidden', borderRadius: 'var(--radius-sm)', background: '#000' }}>
            {type === 'image' ? (
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '600px', objectFit: 'contain' }} />
            ) : (
              <video src={previewUrl} controls style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '600px' }} />
            )}
            
            {/* Overlay for analysis loader */}
            {isAnalyzing && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: 'white'
              }}>
                <Loader size={48} className="spin" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px', color: 'var(--primary-blue)' }} />
                <h2>Analyzing Queue...</h2>
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
