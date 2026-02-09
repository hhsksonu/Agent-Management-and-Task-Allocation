import React, { useState } from 'react';
import { uploadFile } from '../services/api';

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      
      // Validate file type
      if (fileExtension !== 'csv' && fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        setError('Only CSV, XLSX, XLS files are allowed');
        setFile(null);
        e.target.value = ''; // Reset input
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setMessage('');
    setError('');
    setUploading(true);

    try {
      const response = await uploadFile(file);
      setMessage(`Success! ${response.totalRecords} records distributed among agents.`);
      setFile(null);
      document.getElementById('file-input').value = ''; // Reset file input
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h3>Upload CSV/Excel File</h3>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        File must contain columns: FirstName, Phone, Notes
      </p>
      
      <div className="file-input">
        <label>Select File (CSV, XLSX, XLS)</label>
        <input
          id="file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />
      </div>

      {file && (
        <p style={{ marginBottom: '20px', color: '#555' }}>
          Selected: <strong>{file.name}</strong>
        </p>
      )}

      <button 
        className="btn" 
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload & Distribute'}
      </button>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default UploadCSV;
