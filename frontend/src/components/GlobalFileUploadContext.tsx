import React, { createContext, useContext, useState } from "react";
import apiService from "../services/api";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

interface GlobalFileUploadContextValue {
  showModal: boolean;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  uploadFile: File | null;
  setUploadFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploadProgress: number;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: (e: React.FormEvent) => Promise<void>;
  suggestedSubject: string;
  suggestedTopic: string;
  subjectInput: string;
  setSubjectInput: React.Dispatch<React.SetStateAction<string>>;
  topicInput: string;
  setTopicInput: React.Dispatch<React.SetStateAction<string>>;
  handleConfirmSubjectAndTopic: () => Promise<void>;
  loading: boolean;
}

const GlobalFileUploadContext =
  createContext<GlobalFileUploadContextValue | null>(null);

export function useGlobalFileUpload() {
  const ctx = useContext(GlobalFileUploadContext);
  if (!ctx)
    throw new Error(
      "useGlobalFileUpload must be used within GlobalFileUploadProvider",
    );
  return ctx;
}

export function GlobalFileUploadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;

  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [suggestedSubject, setSuggestedSubject] = useState("");
  const [suggestedTopic, setSuggestedTopic] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadFile(file);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    setLoading(true);
    try {
      const response: any = await apiService.uploadFile(
        uploadFile,
        (progress: number) => setUploadProgress(progress),
      );
      setUploadedFileId(response.files && response.files[0]?._id);
      if (response.suggestedSubject) {
        setSuggestedSubject(response.suggestedSubject);
        setSubjectInput(response.suggestedSubject);
      }
      if (response.suggestedTopic) {
        setSuggestedTopic(response.suggestedTopic);
        setTopicInput(response.suggestedTopic);
      }
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "File upload failed";
      setModalMessage(message);
      setModalOpen(true);
      setLoading(false);
      setUploadProgress(0);
      // Keep modal open so user can retry without losing selection
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubjectAndTopic = async () => {
    if (!subjectInput || !uploadedFileId) return;
    setLoading(true);
    try {
      await apiService.createSubjectAndLinkFile({
        subjectName: subjectInput,
        topicName: topicInput,
        fileId: uploadedFileId,
      });
      closeUploadModal();
      window.location.reload();
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={closeUploadModal}
        >
          <div
            style={{
              borderRadius: 24,
              padding: 24,
              width: 460,
              maxWidth: "100%",
              background: isDark
                ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
              border: `2px solid ${isDark ? "rgba(0, 212, 255, 0.3)" : "rgba(0, 120, 255, 0.2)"}`,
              boxShadow: isDark
                ? "0 25px 80px rgba(0, 0, 0, 0.6)"
                : "0 25px 80px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: 22,
                fontWeight: 800,
                marginBottom: 12,
                color: theme.text,
              }}
            >
              Upload & Link File
            </h3>

            <p
              style={{
                marginTop: 0,
                marginBottom: 16,
                color: theme.textSecondary,
                fontSize: 14,
              }}
            >
              Select a file to upload to Google Drive, then confirm the subject
              and topic.
            </p>

            <form onSubmit={handleFileUpload}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <label
                  style={{ fontWeight: 600, fontSize: 13, color: theme.text }}
                >
                  Select File
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1.5px solid ${isDark ? "rgba(0, 212, 255, 0.2)" : "rgba(0, 212, 255, 0.2)"}`,
                    background: isDark
                      ? "rgba(40, 40, 40, 0.7)"
                      : "rgba(255, 255, 255, 0.9)",
                    color: theme.text,
                  }}
                />

                {uploadProgress > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 6,
                        background: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "#e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${uploadProgress}%`,
                          background: theme.primary,
                          transition: "width 0.2s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, color: theme.textMuted }}>
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                )}

                {uploadFile &&
                  !suggestedSubject &&
                  !suggestedTopic &&
                  loading && (
                    <div
                      style={{
                        margin: "0.5rem 0",
                        color: theme.primary,
                        fontWeight: 600,
                      }}
                    >
                      Using AI to get file subject and topic...
                    </div>
                  )}

                {uploadedFileId && (
                  <>
                    <label
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: theme.text,
                      }}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      required
                      placeholder={suggestedSubject || "e.g., Mathematics"}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: `1.5px solid ${isDark ? "rgba(0, 212, 255, 0.2)" : "rgba(0, 212, 255, 0.2)"}`,
                        background: isDark
                          ? "rgba(40, 40, 40, 0.7)"
                          : "rgba(255, 255, 255, 0.9)",
                        color: theme.text,
                      }}
                    />

                    <label
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: theme.text,
                      }}
                    >
                      Topic (optional)
                    </label>
                    <input
                      type="text"
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      placeholder={suggestedTopic || "e.g., Algebra"}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: `1.5px solid ${isDark ? "rgba(0, 212, 255, 0.2)" : "rgba(0, 212, 255, 0.2)"}`,
                        background: isDark
                          ? "rgba(40, 40, 40, 0.7)"
                          : "rgba(255, 255, 255, 0.9)",
                        color: theme.text,
                      }}
                    />
                  </>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  marginTop: 18,
                }}
              >
                {!uploadedFileId ? (
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      fontWeight: 700,
                      color: "white",
                      background:
                        "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
                    }}
                  >
                    {loading ? "Uploading..." : "Upload File"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmSubjectAndTopic}
                    disabled={loading}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      fontWeight: 700,
                      color: "white",
                      background:
                        "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
                    }}
                  >
                    {loading ? "Saving..." : "Confirm Subject & Topic"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={loading}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    fontWeight: 700,
                    color: theme.text,
                    background: isDark
                      ? "rgba(40, 40, 40, 0.8)"
                      : "rgba(0,0,0,0.08)",
                    border: `1.5px solid ${isDark ? "rgba(0, 212, 255, 0.3)" : "rgba(0, 212, 255, 0.3)"}`,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              borderRadius: 24,
              padding: 24,
              width: 420,
              maxWidth: "100%",
              background: isDark
                ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ marginBottom: 16, color: theme.text }}>
              {modalMessage}
            </p>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                fontWeight: 700,
                color: "white",
                background: "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </GlobalFileUploadContext.Provider>
  );
}
