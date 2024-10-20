import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure this file is linked

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [ocrText, setOcrText] = useState('');

  const handleImageUpload = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleExtractText = async () => {
    if (!selectedImage) {
      alert('Please upload an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage);

    const subscriptionKey = 'd87c878795404cb88b82359dcbba90d9';
    const endpoint = 'https://computer-vision-resource-cpme-255.cognitiveservices.azure.com/';
    const url = `${endpoint}/vision/v3.2/read/analyze`;

    try {
      const response = await axios.post(url, selectedImage, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
      });

      const operationLocation = response.headers['operation-location'];

      // Wait a few seconds for the OCR process to complete
      setTimeout(async () => {
        const result = await axios.get(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
          },
        });
        const extractedText = result.data.analyzeResult.readResults
          .map((page) => page.lines.map((line) => line.text).join('\n'))
          .join('\n');
        setOcrText(extractedText);
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>OCR Analytics Page</h1>
      </header>
      <div className="content">
        {/* Step 1: Image Upload */}
        <div className="step" id="step1">
          <h2>Step 1</h2>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Uploaded preview" width="300" />}
          <button onClick={handleExtractText}>Select Image</button>
        </div>

        {/* Step 2: OCR Analyze */}
        <div className="step" id="step2">
          <h2>Step 2</h2>
          <button onClick={handleExtractText}>OCR Analyze</button>
        </div>

        {/* Step 3: OCR Categories Output */}
        <div className="step" id="step3">
          <h2>Step 3</h2>
          {ocrText && (
            <div className="output">
              <h3>OCR Categories Output</h3>
              <p>{ocrText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
