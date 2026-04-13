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
      <div className="glass-panel animate-slide-up text-center" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Icon size={64} color={riskColor} style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2.5rem', color: riskColor, margin: 0 }}>{displayRisk}</h2>
          <div style={{ 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', 
            padding: '1.5rem', 
            marginTop: '1.5rem',
            textAlign: 'left'
          }}>
            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>What this means</h4>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{description}</p>
          </div>
        </div>

        {preview && (
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
            <img src={preview} alt="MRI Preview" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '12px', border: '2px solid rgba(255, 255, 255, 0.1)' }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={onRestart} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={20} /> Upload Another Scan
          </button>
          
          {prediction.report_url && (
            <button className="btn btn-primary" onClick={handleDownloadReport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={20} /> Download Medical Report
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-slide-up text-center" style={{ maxWidth: '600px', margin: '0 auto', padding: '4rem 2rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Upload MRI Scan</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
        Please upload a clear MRI image for AI analysis. Accepted formats: JPG, PNG.
      </p>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>
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
            border: '2px dashed var(--glass-border)', 
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            marginBottom: '2rem'
          }}
        >
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          <Upload size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Click or drag image to upload</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Supports .jpg, .jpeg, .png</div>
        </label>
      ) : (
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {preview ? (
              <img src={preview} alt="MRI Preview" style={{ width: '100%', maxWidth: '300px', borderRadius: '12px', border: '2px solid var(--primary)', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '300px', height: '200px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileImage size={64} color="var(--primary)" />
              </div>
            )}
            <button 
              onClick={clearFile}
              style={{ position: 'absolute', top: -10, right: -10, background: 'var(--danger)', border: 'none', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontWeight: 'bold', wordBreak: 'break-all' }}>{file.name}</p>
        </div>
      )}

      <button 
        className="btn btn-primary" 
        onClick={handleUploadAndPredict} 
        disabled={!file || loading}
        style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
      >
        {loading ? (
          <>
            <RefreshCw size={20} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
            Analyzing...
          </>
        ) : (
          'Analyze MRI Scan'
        )}
      </button>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
