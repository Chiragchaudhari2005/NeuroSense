import React, { useState } from 'react';
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
      <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="animate-slide-up">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', alignItems: 'start' }}>
          {/* Left: result / preview card (white) */}
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '2rem', boxShadow: '0 10px 30px rgba(15,23,42,0.08)', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <Icon size={56} color={riskColor} />
              <div>
                <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#0b1220' }}>{displayRisk}</h2>
                <div style={{ color: '#6b7280', marginTop: '0.25rem' }}>Model confidence: <strong style={{ color: riskColor }}>{(prediction.probability * 100).toFixed(1)}%</strong></div>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', height: '12px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${prediction.probability * 100}%`, height: '100%', background: riskColor, transition: 'width 1s ease' }} />
            </div>

            <div style={{ marginTop: '1.5rem', color: '#334155', lineHeight: '1.6' }}>{description}</div>

            {preview && (
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img src={preview} alt="MRI Preview" style={{ width: '220px', height: '220px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e6eefc' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: '#0b1220' }}>Uploaded Scan</h4>
                  <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>{file?.name}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button className="btn btn-secondary" onClick={onRestart}>New Scan</button>
                    {prediction.report_url && (
                      <button className="btn btn-primary" onClick={handleDownloadReport}><Download size={16} /> Download Report</button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: control card (glass) */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Analysis Summary</h3>
            <div style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Detailed interpretation and next steps based on AI findings.</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Risk</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: riskColor }}>{displayRisk}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Confidence</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{(prediction.probability * 100).toFixed(1)}%</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Recommended Next Steps</h4>
              <ul style={{ margin: 0, paddingLeft: '1.15rem', color: 'var(--text-muted)' }}>
                <li>Consult a clinician for follow-up assessment.</li>
                <li>Consider further imaging or neuropsychological testing.</li>
                <li>Save or download the full medical report.</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', justifyContent: 'space-between' }}>
              <button className="btn btn-secondary" onClick={clearFile} disabled={!file}>Clear</button>
              <button className="btn btn-primary" onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Print</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="animate-slide-up">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '2rem', alignItems: 'start' }}>
        {/* Left: upload / preview white card */}
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '2rem', boxShadow: '0 10px 30px rgba(15,23,42,0.06)' }}>
          <h2 style={{ marginTop: 0 }}>Upload MRI Scan</h2>
          <p style={{ color: '#6b7280' }}>Please upload a clear MRI image for AI analysis. Accepted formats: JPG, PNG.</p>

          {error && (
            <div style={{ background: '#fff1f2', color: 'var(--danger)', padding: '0.9rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid rgba(239,68,68,0.12)' }}>
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
                padding: '3rem 2rem', 
                border: '2px dashed #e6eefc', 
                borderRadius: '12px',
                backgroundColor: '#f8fbff',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '1.25rem'
              }}
            >
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              <Upload size={48} color="#0b1220" style={{ marginBottom: '0.75rem' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0b1220' }}>Click or drag image to upload</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Supports .jpg, .jpeg, .png</div>
            </label>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ width: '320px', height: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e6eefc' }}>
                {preview ? (
                  <img src={preview} alt="MRI Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f7ff' }}>
                    <FileImage size={64} color="#0b1220" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#0b1220' }}>{file.name}</div>
                <div style={{ color: '#6b7280', marginTop: '0.5rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="btn btn-secondary" onClick={clearFile}>Remove</button>
                  <button className="btn btn-primary" onClick={handleUploadAndPredict} disabled={loading}>
                    {loading ? <><RefreshCw size={16} className="animate-spin"/> Analyzing...</> : 'Analyze MRI Scan'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Tip: Use a high-resolution axial slice for better model performance.</div>
        </div>

        {/* Right: helper / actions card */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn" style={{ background: '#eef6ff', color: '#0b1220', borderRadius: '10px', padding: '0.6rem 0.75rem' }} onClick={() => alert('Guidance opened')}>How to prepare your MRI</button>
            <button className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text-light)', padding: '0.6rem 0.75rem', borderRadius: '10px' }} onClick={() => alert('Contacting specialist')}>Contact Specialist</button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>Notes</h4>
            <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: 1.5 }}>We recommend reviewing the AI findings with a medical professional. This tool is for informational purposes only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
