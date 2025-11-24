/*GlobalFileUploadContext.jsx file*/
import React, { createContext, useContext, useState } from "react";
import apiService from "../services/api";

const GlobalFileUploadContext = createContext();

export function useGlobalFileUpload() {
  return useContext(GlobalFileUploadContext);
}

export function GlobalFileUploadProvider({ children }) {
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [suggestedSubject, setSuggestedSubject] = useState("");
  const [suggestedTopic, setSuggestedTopic] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const openUploadModal = () => setShowModal(true);
  const closeUploadModal = () => {
    setShowModal(false);
    setUploadFile(null);
    setUploadProgress(0);
    setSuggestedSubject("");
    setSuggestedTopic("");
    setSubjectInput("");
    setTopicInput("");
    setUploadedFileId(null);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setLoading(true);
    try {
      const response = await apiService.uploadFile(uploadFile, (progress) =>
        setUploadProgress(progress)
      );
      console.log("Upload response:", response); // Debug log
      if (response.suggestedSubject || response.suggestedTopic) {
        setSuggestedSubject(response.suggestedSubject || "");
        setSuggestedTopic(response.suggestedTopic || "");
        setSubjectInput(response.suggestedSubject || "");
        setTopicInput(response.suggestedTopic || "");
        setUploadedFileId(response.files && response.files[0]?._id);
      }
    } catch (err) {
      setModalMessage("File upload failed");
      setModalOpen(true);
      closeUploadModal();
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubjectAndTopic = async () => {
    if ((!subjectInput && !topicInput) || !uploadedFileId) return;
    setLoading(true);
    try {
      await apiService.createSubjectAndLinkFile({
        subjectName: subjectInput,
        topicName: topicInput,
        fileId: uploadedFileId,
      });
      closeUploadModal();
      window.location.reload(); // Refresh to show new subject/file
    } catch (err) {
      setModalMessage("Failed to create/associate subject/topic");
      setModalOpen(true);
      setLoading(false);
    }
  };

  return (
    <GlobalFileUploadContext.Provider
      value={{
        showModal,
        openUploadModal,
        closeUploadModal,
        uploadFile,
        setUploadFile,
        uploadProgress,
        handleFileChange,
        handleFileUpload,
        suggestedSubject,
        suggestedTopic,
        subjectInput,
        setSubjectInput,
        topicInput,
        setTopicInput,
        handleConfirmSubjectAndTopic,
        loading,
      }}
    >
      {children}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Upload File & Confirm Subject/Topic</h3>
            <form onSubmit={handleFileUpload}>
              <div className="form-group">
                <label>Select File:</label>
                <input type="file" onChange={handleFileChange} required />
              </div>
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
              )}
              {/* Show AI loading message if file is uploaded but suggestion not ready */}
              {uploadFile && !suggestedSubject && !suggestedTopic && loading && (
                <div
                  style={{
                    margin: "1rem 0",
                    color: "#3b82f6",
                    fontWeight: 500,
                  }}
                >
                  Using AI to get file subject and topic...
                </div>
              )}
              {/* Show AI suggestion if available */}
              {(suggestedSubject || suggestedTopic) && (
                <>
                  <div className="form-group">
                    <label>AI Thinks the subject is:</label>
                    <input
                      type="text"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>AI Thinks the topic is:</label>
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div className="modal-actions">
                {!(suggestedSubject || suggestedTopic) ? (
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload File"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleConfirmSubjectAndTopic}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Confirm Subject & Topic"}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeUploadModal}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
            <button onClick={() => setModalOpen(false)} className="btn-primary">Close</button>
          </div>
        </div>
      )}
    </GlobalFileUploadContext.Provider>
  );
}
