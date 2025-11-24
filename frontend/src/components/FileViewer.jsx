import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashNav from "./DashNav.jsx";
import Footer from "./Footer.jsx";
import apiService from "../services/api";

const FileViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const files = await apiService.getMyFiles();
        const found = files.find((f) => f._id === id);
        setFile(found);
        setError(null);
      } catch (err) {
        setError("Failed to fetch file info");
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [id]);

  const renderFile = () => {
    if (!file) return null;
    if (file.mimetype && file.mimetype.includes("pdf")) {
      return (
        <iframe
          src={file.drive_file_url}
          title={file.name}
          width="100%"
          height="600px"
          style={{ border: "1px solid #e5e7eb", borderRadius: 8 }}
        />
      );
    }
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      return (
        <img
          src={file.drive_file_url}
          alt={file.name}
          style={{
            maxWidth: "100%",
            maxHeight: 600,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        />
      );
    }
    // For other types, just provide a download link
    return (
      <a href={file.drive_file_url} target="_blank" rel="noopener noreferrer">
        Download {file.name}
      </a>
    );
  };

  return (
    <>
      <DashNav />
      <div
        style={{
          maxWidth: 900,
          margin: "2rem auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 12px #e5e7eb",
          padding: 32,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: 24,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
        {loading ? (
          <div>Loading File...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : file ? (
          <>
            <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>
              {file.name}
            </h2>
            {renderFile()}
          </>
        ) : (
          <div>File not found.</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FileViewer;
