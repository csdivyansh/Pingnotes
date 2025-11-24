import React, { useEffect, useState } from "react";
import DashNav from "./DashNav.jsx";
import apiService from "../services/api";
import PropTypes from "prop-types";

const FileSummary = ({ fileId }) => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakSummary = () => {
    if (!summary) return;
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(summary);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const files = await apiService.getMyFiles();
        const found = files.find((f) => f._id === fileId);
        setFile(found);
        const res = await apiService.request(`/api/files/${fileId}/summary`);
        setSummary(res.summary || "No summary available.");
        setError(null);
      } catch (err) {
        setError("Failed to fetch Summary");
      } finally {
        setLoading(false);
      }
    };
    if (fileId) fetchSummary();
  }, [fileId]);

  return (
    <>
      <DashNav />
      <div
        style={{
          maxWidth: 700,
          margin: "2rem auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px #e5e7eb",
          padding: 32,
        }}
      >
        {loading ? (
          <div>Loading Summary...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <>
            <h2
              style={{
                fontWeight: 700,
                fontSize: 28,
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              Summary of {file?.name || "File"}
              <button
                onClick={speakSummary}
                aria-label={
                  isSpeaking ? "Stop reading summary" : "Read summary aloud"
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  outline: "none",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 8,
                }}
              >
                {/* Speaker Icon SVG */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="#2563eb" />
                  <path
                    d="M16.5 12C16.5 10.067 15.433 8.433 14 7.732V16.268C15.433 15.567 16.5 13.933 16.5 12Z"
                    fill="#2563eb"
                  />
                </svg>
              </button>
            </h2>
            <div style={{ color: "#000", fontSize: 18, fontWeight: 400 }}>
              {/* If summary is trusted HTML, render as rich text. If not, sanitize before using dangerouslySetInnerHTML. */}
              <div dangerouslySetInnerHTML={{ __html: summary }} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

FileSummary.propTypes = {
  fileId: PropTypes.string.isRequired,
};

export default FileSummary;
