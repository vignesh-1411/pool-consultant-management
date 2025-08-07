

// components/ResumeUpload.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface Props {
  onClose: () => void;
  onUploaded?: () => void;
}

const ResumeUpload: React.FC<Props> = ({ onClose, onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID not found. Please login again.");
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const processFormData = new FormData();
    processFormData.append("file", file);
    processFormData.append("user_id", userId);

    try {
      // Step 1: Upload file
      await axios.post(`http://localhost:8000/upload-file?user_id=${userId}`, uploadFormData);

      // Step 2: Process resume with Gemini AI
      await axios.post(`http://localhost:8000/process-resume-ai?user_id=${userId}`, processFormData);

      alert("Resume uploaded and skills updated successfully.");

      // Step 3: Trigger dashboard to fetch new skills
      onUploaded?.();
      onClose();
      
    } catch (error: any) {
      console.error("Error during resume upload or processing:", error);
      if (error.response?.data?.detail) {
        alert("Failed: " + error.response.data.detail);
      } else {
        alert("Unexpected error: " + error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload Resume</h2>
        <input
          type="file"
          accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;
