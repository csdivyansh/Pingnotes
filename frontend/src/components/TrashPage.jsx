import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload, FaTrashRestore, FaTrash } from "react-icons/fa";
import DashNav from "./DashNav.jsx";
import apiService from "../services/api";
// this is trash page
const TrashPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [emptying, setEmptying] = useState(false);
  const apiBase = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    fetchTrashedFiles();
  }, []);

  const fetchTrashedFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBase}/api/files/trash`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      setFiles(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch trashed files");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (fileId) => {
    setActionId(fileId);
    try {
      await axios.post(
        `${apiBase}/api/files/restore/${fileId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      alert("Failed to restore file");
    } finally {
      setActionId(null);
    }
  };

  const handlePermanentDelete = async (fileId) => {
    if (!window.confirm("Permanently delete this file? This cannot be undone."))
      return;
    setActionId(fileId);
    try {
      await axios.delete(`${apiBase}/api/files/permanent/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      alert("Failed to permanently delete file");
    } finally {
      setActionId(null);
    }
  };

  const handleEmptyTrash = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete all files in the trash? This cannot be undone."
      )
    )
      return;
    setEmptying(true);
    try {
      await apiService.emptyTrash();
      fetchTrashedFiles();
    } catch (err) {
      alert("Failed to empty trash");
    } finally {
      setEmptying(false);
    }
  };

  return (
    <>
      <DashNav />
      <div
        className="subject-card"
        style={{ maxWidth: 900, margin: "2rem auto" }}
      >
        <div className="subject-header" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Trash</h1>
          <button
            className="btn-danger"
            style={{ marginLeft: 16, minWidth: 120 }}
            onClick={handleEmptyTrash}
            disabled={emptying}
          >
            {emptying ? "Emptying..." : "Empty Trash"}
          </button>
        </div>
        {loading ? (
          <div>Loading trashed files...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : files.length === 0 ? (
          <div>No files in trash.</div>
        ) : (
          <div className="files-list" style={{ flexDirection: "column" }}>
            {files.map((file) => (
              <div key={file._id} className="file-item">
                <span className="file-name">{file.name}</span>
                <span
                  style={{ color: "#64748b", fontSize: 14, marginRight: 16 }}
                >
                  {file.mimetype}
                </span>
                <span
                  style={{ color: "#64748b", fontSize: 14, marginRight: 16 }}
                >
                  {(file.size / 1024).toFixed(1)} KB
                </span>
                <a
                  href={file.drive_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="view-file-btn"
                  style={{ marginRight: 8 }}
                >
                  <FaDownload />
                </a>
                <button
                  onClick={() => handleRestore(file._id)}
                  disabled={actionId === file._id}
                  className="btn-primary"
                  style={{ minWidth: 36, minHeight: 36, marginRight: 8 }}
                  title="Restore"
                >
                  <FaTrashRestore />
                </button>
                <button
                  onClick={() => handlePermanentDelete(file._id)}
                  disabled={actionId === file._id}
                  className="btn-danger"
                  style={{ minWidth: 36, minHeight: 36 }}
                  title="Permanently Delete"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TrashPage;
