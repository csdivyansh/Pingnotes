/// <reference types="vite/client" />
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaDownload,
  FaTrashRestore,
  FaTrash,
  FaFileAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DashNav from "./DashNav.jsx";
import apiService from "../services/api";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

interface FileItem {
  _id: string;
  name: string;
  mimetype: string;
  size: number;
  drive_file_url: string;
  deletedAt?: string;
  originalPath?: string;
}

const TrashPage: React.FC = () => {
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [emptying, setEmptying] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "empty";
    fileId?: string;
    fileName?: string;
  } | null>(null);

  const apiBase = (import.meta.env.VITE_API_URL as string) || "";

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

  const handleRestore = async (fileId: string) => {
    setActionId(fileId);
    try {
      await axios.post(
        `${apiBase}/api/files/restore/${fileId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      alert("Failed to restore file");
    } finally {
      setActionId(null);
    }
  };

  const handlePermanentDelete = async (fileId: string) => {
    setActionId(fileId);
    try {
      await axios.delete(`${apiBase}/api/files/permanent/${fileId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      setShowConfirmModal(false);
    } catch (err) {
      alert("Failed to permanently delete file");
    } finally {
      setActionId(null);
    }
  };

  const handleEmptyTrash = async () => {
    setEmptying(true);
    try {
      await apiService.emptyTrash();
      fetchTrashedFiles();
      setShowConfirmModal(false);
    } catch (err) {
      alert("Failed to empty trash");
    } finally {
      setEmptying(false);
    }
  };

  const openConfirmModal = (
    type: "delete" | "empty",
    fileId?: string,
    fileName?: string,
  ) => {
    setConfirmAction({ type, fileId, fileName });
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (!confirmAction) return;

    if (confirmAction.type === "empty") {
      handleEmptyTrash();
    } else if (confirmAction.fileId) {
      handlePermanentDelete(confirmAction.fileId);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.includes("pdf")) return "📄";
    if (mimetype.includes("image")) return "🖼️";
    if (mimetype.includes("video")) return "🎥";
    if (mimetype.includes("audio")) return "🎵";
    if (mimetype.includes("zip") || mimetype.includes("rar")) return "🗜️";
    return "📎";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } },
  };

  return (
    <>
      <DashNav />
      <div
        style={{
          minHeight: "100vh",
          background: theme.bg,
          padding: "2rem 1rem",
          paddingTop: "7rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <FaTrash style={{ fontSize: "2rem", color: theme.primary }} />
              <h1
                style={{
                  fontSize: "2rem",
                  margin: 0,
                  color: theme.text,
                  fontWeight: "700",
                }}
              >
                Trash
              </h1>
              {files.length > 0 && (
                <span
                  style={{
                    background: theme.primary,
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {files.length}
                </span>
              )}
            </div>
            {files.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openConfirmModal("empty")}
                disabled={emptying}
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "#fff",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: emptying ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                  opacity: emptying ? 0.6 : 1,
                  transition: "all 0.2s ease",
                }}
              >
                {emptying ? "Emptying..." : "Empty Trash"}
              </motion.button>
            )}
          </div>

          {/* Content Section */}
          <div
            style={{
              background: isDark
                ? "rgba(30, 30, 30, 0.5)"
                : "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              border: `1px solid ${theme.navBorder}`,
              overflow: "hidden",
              boxShadow: isDark
                ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                : "0 8px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "4rem 2rem",
                  textAlign: "center",
                  color: theme.textMuted,
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ display: "inline-block", fontSize: "2rem" }}
                >
                  ⏳
                </motion.div>
                <p style={{ marginTop: "1rem", fontSize: "1rem" }}>
                  Loading trashed files...
                </p>
              </div>
            ) : error ? (
              <div
                style={{
                  padding: "4rem 2rem",
                  textAlign: "center",
                  color: "#ef4444",
                }}
              >
                <FaExclamationTriangle
                  style={{ fontSize: "3rem", marginBottom: "1rem" }}
                />
                <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>{error}</p>
              </div>
            ) : files.length === 0 ? (
              <div
                style={{
                  padding: "4rem 2rem",
                  textAlign: "center",
                  color: theme.textMuted,
                }}
              >
                <FaTrash
                  style={{
                    fontSize: "4rem",
                    opacity: 0.3,
                    marginBottom: "1rem",
                  }}
                />
                <p style={{ fontSize: "1.2rem", fontWeight: "500" }}>
                  Trash is empty
                </p>
                <p style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}>
                  Deleted files will appear here
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {files.map((file, index) => (
                    <motion.div
                      key={file._id}
                      variants={itemVariants}
                      exit="exit"
                      style={{
                        padding: "1.25rem 1.5rem",
                        borderBottom:
                          index < files.length - 1
                            ? `1px solid ${theme.navBorder}`
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        transition: "background 0.2s ease",
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme.hover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {/* File Icon */}
                      <div
                        style={{
                          fontSize: "2rem",
                          flexShrink: 0,
                        }}
                      >
                        {getFileIcon(file.mimetype)}
                      </div>

                      {/* File Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "1rem",
                            fontWeight: "500",
                            color: theme.text,
                            marginBottom: "4px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {file.name}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "0.875rem",
                            color: theme.textMuted,
                            flexWrap: "wrap",
                          }}
                        >
                          <span>
                            {file.mimetype.split("/")[1]?.toUpperCase()}
                          </span>
                          <span>•</span>
                          <span>{formatFileSize(file.size)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexShrink: 0,
                        }}
                      >
                        {/* Download Button */}
                        <motion.a
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          href={file.drive_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: isDark
                              ? "rgba(100, 100, 100, 0.3)"
                              : "rgba(200, 200, 200, 0.3)",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: theme.text,
                            fontSize: "1rem",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          title="Download"
                        >
                          <FaDownload />
                        </motion.a>

                        {/* Restore Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRestore(file._id)}
                          disabled={actionId === file._id}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor:
                              actionId === file._id ? "not-allowed" : "pointer",
                            color: "#fff",
                            fontSize: "1rem",
                            opacity: actionId === file._id ? 0.5 : 1,
                            boxShadow: `0 4px 12px ${theme.primary}40`,
                            transition: "all 0.2s ease",
                          }}
                          title="Restore"
                        >
                          <FaTrashRestore />
                        </motion.button>

                        {/* Delete Permanently Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            openConfirmModal("delete", file._id, file.name)
                          }
                          disabled={actionId === file._id}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor:
                              actionId === file._id ? "not-allowed" : "pointer",
                            color: "#fff",
                            fontSize: "1rem",
                            opacity: actionId === file._id ? 0.5 : 1,
                            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                            transition: "all 0.2s ease",
                          }}
                          title="Delete Permanently"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: isDark ? "#1a1a1a" : "#fff",
                borderRadius: "16px",
                padding: "2rem",
                maxWidth: "450px",
                width: "100%",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                border: `1px solid ${theme.navBorder}`,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                  }}
                >
                  ⚠️
                </div>
                <h2
                  style={{
                    fontSize: "1.5rem",
                    color: theme.text,
                    marginBottom: "0.5rem",
                    fontWeight: "700",
                  }}
                >
                  {confirmAction.type === "empty"
                    ? "Empty Trash?"
                    : "Delete Permanently?"}
                </h2>
                <p
                  style={{
                    color: theme.textMuted,
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                  }}
                >
                  {confirmAction.type === "empty"
                    ? `This will permanently delete all ${files.length} files in the trash. This action cannot be undone.`
                    : `Are you sure you want to permanently delete "${confirmAction.fileName}"? This action cannot be undone.`}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: `1px solid ${theme.navBorder}`,
                    background: "transparent",
                    color: theme.text,
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "10px",
                    border: "none",
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {confirmAction.type === "empty"
                    ? "Empty Trash"
                    : "Delete Forever"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TrashPage;
