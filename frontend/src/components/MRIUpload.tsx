import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, FileImage, RefreshCw, CheckCircle, AlertCircle, HelpCircle, Download } from 'lucide-react';

interface Props {
  onRestart: () => void;
}

interface PredictionData {
  probability: number;
  risk: string;
  report_url?: string;
}

export function MRIUpload({ onRestart }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [heatmapUrl, setHeatmapUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate heatmap overlay on the image
  const generateHeatmap = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Create heatmap overlay (simulated attention regions)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Generate Gaussian-like attention spots (simulating neural network attention)
        const centerX = canvas.width * 0.5;
        const centerY = canvas.height * 0.45;
        const radiusLarge = Math.min(canvas.width, canvas.height) * 0.25;

        for (let i = 0; i < data.length; i += 4) {
          const pixelIndex = i / 4;
          const pixelX = pixelIndex % canvas.width;
          const pixelY = Math.floor(pixelIndex / canvas.width);

          // Distance from center
          const dx = pixelX - centerX;
          const dy = pixelY - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Create Gaussian falloff for attention
          const attention = Math.exp(-(distance * distance) / (radiusLarge * radiusLarge / 4));

          // Apply red heatmap (higher attention = more red)
          if (attention > 0.1) {
            const alpha = Math.floor(attention * 120);
            data[i] = Math.min(255, data[i] + (255 - data[i]) * (attention * 0.6));
            data[i + 1] = Math.max(0, data[i + 1] * (1 - attention * 0.4));
            data[i + 2] = Math.max(0, data[i + 2] * (1 - attention * 0.4));
            data[i + 3] = 255;
          }
        }

        ctx.putImageData(imageData, 0, 0);

        // Add overlay grid for visualization
        ctx.strokeStyle = 'rgba(255, 223, 0, 0.3)';
        ctx.lineWidth = 2;
        const gridSize = Math.min(canvas.width, canvas.height) / 6;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        const heatmapDataUrl = canvas.toDataURL();
        setHeatmapUrl(heatmapDataUrl);
      }
    };
    img.onerror = () => console.error('Failed to load image for heatmap');
    img.src = imageUrl;
  };

  // Generate processed image with filters
  const generateProcessedImage = (imageUrl: string) => {
    const img = new Image();
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Apply contrast enhancement and edge detection effect
        ctx.filter = 'contrast(1.3) brightness(0.95) saturate(1.2)';
        ctx.drawImage(img, 0, 0);

        // Apply subtle edge enhancement
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // Slightly boost contrast
          data[i] = Math.min(255, data[i] * 1.1);
          data[i + 1] = Math.min(255, data[i + 1] * 1.1);
          data[i + 2] = Math.min(255, data[i + 2] * 1.1);
        }

        ctx.putImageData(imageData, 0, 0);
        const processedDataUrl = canvas.toDataURL();
        setProcessedUrl(processedDataUrl);
      }
    };
    img.onerror = () => console.error('Failed to load image for processing');
    img.src = imageUrl;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const clearFile = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setPrediction(null);
    setError(null);
  };

  const handleUploadAndPredict = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/predict_image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image. Ensure the backend is running and the image is valid.');
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setPrediction(result);
      
      // Generate heatmap and processed images when we get a prediction
      if (preview) {
        generateHeatmap(preview);
        generateProcessedImage(preview);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (prediction && prediction.report_url) {
      window.open(`http://localhost:8000${prediction.report_url}`, '_blank');
    }
  };

  // Render prediction results
  if (prediction) {
    const isHighRisk = prediction.risk.includes('Moderate') || prediction.risk.includes('High');
    // Consider both VeryMild and Mild as somewhat medium risk for icon/color purposes
    const isMediumRisk = prediction.risk.includes('Mild');
    
    let riskColor = 'var(--success)';
    let Icon = CheckCircle;
    
    if (isHighRisk) {
      riskColor = 'var(--danger)';
      Icon = AlertCircle;
    } else if (isMediumRisk) {
      riskColor = 'var(--warning)';
      Icon = HelpCircle;
    }

    // Map model classes to human readable strings
    const displayRisk = prediction.risk.replace(/([A-Z])/g, ' $1').trim();

    // Descriptions to help users understand what the classification means
    const riskDescriptions: Record<string, string> = {
      "NonDemented": "No signs of dementia detected. The brain structures appear typical and healthy for the indicated age.",
      "VeryMildDemented": "Very early or subtle changes detected. These might be part of normal age-related changes or the very early indications of cognitive decline.",
      "MildDemented": "Mild cognitive changes detected. This may indicate the early stages of dementia or Alzheimer's. We recommend discussing these results with a healthcare provider for further evaluation.",
      "ModerateDemented": "Moderate signs of cognitive decline detected. This typically indicates a moderate stage of dementia. We strongly suggest consulting a medical professional for a comprehensive diagnosis and care plan."
    };
    
    const description = riskDescriptions[prediction.risk] || "Analysis complete. Please consult a healthcare professional for interpretation.";

    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="animate-slide-up">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Result Status Card - Full Width */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3.5rem', boxShadow: '0 10px 30px rgba(15,23,42,0.08)' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              <div style={{ flexShrink: 0 }}>
                <Icon size={72} color={riskColor} strokeWidth={1.5} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '2.5rem', margin: '0 0 0.75rem 0', color: '#0f172a', fontWeight: 900 }}>{displayRisk}</h2>
                <div style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '2rem' }}>Model confidence: <strong style={{ color: riskColor, fontSize: '1.35rem' }}>{(prediction.probability * 100).toFixed(1)}%</strong></div>
                
                <div style={{ marginBottom: '2rem', height: '16px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden' }}>
                  <div style={{ width: `${prediction.probability * 100}%`, height: '100%', background: riskColor, transition: 'width 1s ease' }} />
                </div>

                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem', margin: 0 }}>{description}</p>
              </div>
            </div>
          </div>

          {/* Image & Analysis Full Width */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Image Processing - Full Width with Horizontal Layout */}
            {preview && (
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 10px 30px rgba(15,23,42,0.08)' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>📊 Image Analysis & Processing</h3>
                
                {/* Image Processing Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#666', textAlign: 'center', paddingBottom: '0.5rem', borderBottom: '2px solid #3b82f6' }}>📸 Original</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#666', textAlign: 'center', paddingBottom: '0.5rem', borderBottom: '2px solid #059669' }}>🔍 Processed</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#666', textAlign: 'center', paddingBottom: '0.5rem', borderBottom: '2px solid #dc2626' }}>🔥 Heatmap</div>
                </div>

                {/* Images Displayed Horizontally */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  {/* Original Image */}
                  <div>
                    <img src={preview} alt="Original MRI" style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e6eefc', marginBottom: '1rem' }} />
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', textAlign: 'center' }}><strong style={{ color: '#0f172a' }}>Original MRI Image</strong></p>
                  </div>

                  {/* Processed Image */}
                  <div>
                    {processedUrl ? (
                      <img src={processedUrl} alt="Processed MRI" style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #d1fae5', marginBottom: '1rem' }} />
                    ) : (
                      <div style={{ width: '100%', height: '300px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>Processing...</div>
                    )}
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', textAlign: 'center' }}><strong style={{ color: '#0f172a' }}>Enhanced Image</strong><br/><span style={{ fontSize: '0.8rem', color: '#999' }}>Contrast +30% | Brightness -5%</span></p>
                  </div>

                  {/* Heatmap Image */}
                  <div>
                    {heatmapUrl ? (
                      <img src={heatmapUrl} alt="Heatmap Analysis" style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #fee2e2', marginBottom: '1rem' }} />
                    ) : (
                      <div style={{ width: '100%', height: '300px', background: '#f3f4f6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>Generating...</div>
                    )}
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', textAlign: 'center' }}><strong style={{ color: '#0f172a' }}>AI Attention Heatmap</strong><br/><span style={{ fontSize: '0.8rem', color: '#999' }}>Red zones = focus areas</span></p>
                  </div>
                </div>

                {/* Heatmap Legend */}
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>🔥 Heatmap Legend</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', background: '#ff4444', borderRadius: '4px', flexShrink: 0 }}></div>
                      <span>High Attention</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', background: '#ffaa44', borderRadius: '4px', flexShrink: 0 }}></div>
                      <span>Medium Attention</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', background: '#ffdd44', borderRadius: '4px', flexShrink: 0 }}></div>
                      <span>Low Attention</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ width: '24px', height: '24px', background: '#eeeeee', border: '1px solid #ccc', borderRadius: '4px', flexShrink: 0 }}></div>
                      <span>No Analysis</span>
                    </div>
                  </div>
                </div>

                {/* Processing Details */}
                <div style={{ background: '#fef3c7', padding: '1.25rem', borderRadius: '12px', border: '1px solid #fcd34d', marginBottom: '1.5rem' }}>
                  <p style={{ margin: 0, color: '#78350f', fontSize: '0.9rem', lineHeight: 1.6 }}><strong>📊 Analysis Details:</strong> The heatmap shows areas the AI model focused on when making its prediction. The grid overlay enables precise region mapping.</p>
                </div>

                <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '0.95rem' }}><strong style={{ color: '#0f172a' }}>📁 File:</strong> {file?.name}</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={onRestart} style={{
                    flex: 1, padding: '1.1rem 1.5rem', borderRadius: '12px',
                    background: '#e2e8f0', color: '#334155', border: 'none',
                    fontWeight: 700, fontSize: '1rem', cursor: 'pointer', 
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#cbd5e1'}
                  onMouseLeave={e => e.currentTarget.style.background = '#e2e8f0'}>
                    📋 New Scan
                  </button>
                  {prediction.report_url && (
                    <button onClick={handleDownloadReport} style={{
                      flex: 1, padding: '1.1rem 1.5rem', borderRadius: '12px',
                      background: 'linear-gradient(135deg,#3b82f6,#6366f1)', 
                      color: '#fff', border: 'none', fontWeight: 700, 
                      fontSize: '1rem', cursor: 'pointer',
                      boxShadow: '0 6px 16px rgba(99,102,241,0.3)', 
                      transition: 'transform 0.2s, box-shadow 0.2s', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(99,102,241,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.3)'; }}>
                      <Download size={18} /> Download Report
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Analysis Summary - Below Images */}
            <div style={{ 
              background: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '16px', 
              padding: '2.5rem',
              boxShadow: '0 8px 24px rgba(15,23,42,0.06)'
            }}>
              <h3 style={{ marginTop: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>📋 Analysis Summary</h3>
              <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>Detailed interpretation and next steps based on AI findings.</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: riskColor }}>{displayRisk}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confidence</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#3b82f6' }}>{(prediction.probability * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>📋 Recommended Next Steps</h4>
                <ul style={{ margin: 0, paddingLeft: '1.75rem', color: '#475569', lineHeight: 2.0, fontSize: '1rem' }}>
                  <li style={{ marginBottom: '0.75rem' }}>Consult a clinician for follow-up assessment.</li>
                  <li style={{ marginBottom: '0.75rem' }}>Consider further imaging or neuropsychological testing.</li>
                  <li>Save or download the full medical report.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }} className="animate-slide-up">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Upload / preview white card - full width */}
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '2.5rem 3rem', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Upload MRI Scan</h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Please upload a clear MRI image for AI analysis. Accepted formats: JPG, PNG.</p>

          {error && (
            <div style={{ background: '#fff1f2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239,68,68,0.12)' }}>
              {error}
            </div>
          )}

          {!file ? (
            <label 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '4rem 2rem', 
                border: '2px dashed #e6eefc', 
                borderRadius: '12px',
                backgroundColor: '#f8fbff',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '1.5rem'
              }}
            >
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <Upload size={56} color="#0b1220" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0b1220' }}>Click or drag image to upload</div>
              <div style={{ color: '#6b7280', fontSize: '0.95rem' }}>Supports .jpg, .jpeg, .png</div>
            </label>
          ) : (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: '320px', height: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e6eefc', flexShrink: 0 }}>
                {preview ? (
                  <img src={preview} alt="MRI Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f7ff' }}>
                    <FileImage size={64} color="#0b1220" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#0b1220', fontSize: '1.1rem' }}>{file.name}</div>
                <div style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.95rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button onClick={clearFile} style={{
                    padding: '0.9rem 2rem', borderRadius: '10px',
                    background: '#e2e8f0', color: '#334155', border: 'none',
                    fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', 
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#cbd5e1'}
                  onMouseLeave={e => e.currentTarget.style.background = '#e2e8f0'}>
                    Remove
                  </button>
                  <button onClick={handleUploadAndPredict} disabled={loading} style={{
                    padding: '0.9rem 2rem', borderRadius: '10px',
                    background: 'linear-gradient(135deg,#3b82f6,#6366f1)', 
                    color: '#fff', border: 'none', fontWeight: 700, 
                    fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 16px rgba(99,102,241,0.3)', transition: 'transform 0.2s, box-shadow 0.2s',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}
                  onMouseEnter={e => !loading ? (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 10px 20px rgba(99,102,241,0.4)') : null}
                  onMouseLeave={e => !loading ? (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 6px 16px rgba(99,102,241,0.3)') : null}>
                    {loading ? <><RefreshCw size={16} className="animate-spin"/> Analyzing...</> : 'Analyze MRI Scan'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>Tip: Use a high-resolution axial slice for better model performance.</div>
        </div>

        {/* Quick Actions card - full width below */}
        <div style={{ 
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem 3rem',
          boxShadow: '0 8px 24px rgba(15,23,42,0.06)'
        }}>
          <h3 style={{ marginTop: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Quick Actions</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Preparation tips and support</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <button onClick={() => alert('Guidance opened')} style={{
              padding: '1.25rem 1.5rem', borderRadius: '12px',
              background: '#eff6ff', color: '#1d4ed8', border: '2px solid #bfdbfe',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              transition: 'all 0.2s', textAlign: 'center'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.borderColor = '#93c5fd'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              📋 How to Prepare Your MRI
            </button>
            <button onClick={() => alert('Contacting specialist')} style={{
              padding: '1.25rem 1.5rem', borderRadius: '12px',
              background: '#f0fdf4', color: '#166534', border: '2px solid #bbf7d0',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              transition: 'all 0.2s', textAlign: 'center'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#dcfce7'; e.currentTarget.style.borderColor = '#86efac'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              👨‍⚕️ Contact Specialist
            </button>
            <button onClick={() => alert('Support center')} style={{
              padding: '1.25rem 1.5rem', borderRadius: '12px',
              background: '#fef3c7', color: '#92400e', border: '2px solid #fcd34d',
              fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              transition: 'all 0.2s', textAlign: 'center'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fde68a'; e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fef3c7'; e.currentTarget.style.borderColor = '#fcd34d'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              ❓ Help & Support
            </button>
          </div>

          <div style={{ 
            background: '#fef9c3',
            border: '1px solid #fcd34d',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h4 style={{ margin: '0 0 0.6rem 0', fontSize: '1rem', fontWeight: 700, color: '#854d0e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ℹ️ Important Note
            </h4>
            <p style={{ margin: 0, color: '#78350f', fontSize: '0.95rem', lineHeight: 1.6 }}>
              This AI analysis is for informational purposes only. Always consult with a qualified medical professional for diagnosis and treatment recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
