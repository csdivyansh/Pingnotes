import React, { useEffect, useState } from "react";
import apiService from "../services/api";
import { FaTrash, FaEye, FaShare, FaMagic } from "react-icons/fa";
import DashNav from "./DashNav.jsx";
import { useNavigate } from "react-router-dom";
import FileSummary from "./FileSummary";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";

const MyFiles = () => {
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [summaryVisible, setSummaryVisible] = useState({});
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryFileId, setSummaryFileId] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMyFiles();
      setFiles(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (fileId) => {
    if (!fileId) {
      setModalMessage("Invalid file ID");
      setModalOpen(true);
      return;
    }
    setConfirmMessage("Are you sure you want to delete this file?");
    setOnConfirm(() => handleDeleteConfirmed(fileId));
    setConfirmOpen(true);
  };

  const handleDeleteConfirmed = async (fileId) => {
    setDeletingId(fileId);
    try {
      await apiService.request(`/api/files/${fileId}`, { method: "DELETE" });
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    } catch (err) {
      setModalMessage("Failed to delete file");
      setModalOpen(true);
    } finally {
      setDeletingId(null);
    }
  };

  const openShareModal = (file) => {
    setFileToShare(file);
    setShowShareModal(true);
    setSelectedFriends([]);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setFileToShare(null);
    setSelectedFriends([]);
  };

  const handleFriendToggle = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  const handleAddFriendByEmail = () => {
    if (!friendEmail.trim()) return;
    if (!friends.some((f) => f.email === friendEmail.trim())) {
      const newFriend = {
        _id: friendEmail.trim(),
        name: friendEmail.trim(),
        email: friendEmail.trim(),
      };
      setFriends((prev) => [...prev, newFriend]);
    }
    setSelectedFriends((prev) => [...prev, friendEmail.trim()]);
    setFriendEmail("");
  };

  const handleShare = async () => {
    try {
      await apiService.shareFile(fileToShare._id, selectedFriends);
      alert("File shared successfully!");
    } catch (err) {
      alert("Failed to share file");
    }
    closeShareModal();
  };

  const handleMenuToggle = (fileId) => {
    setMenuOpenId((prev) => (prev === fileId ? null : fileId));
  };

  // Placeholder for AI summary fetching logic
  const getAISummary = (file) => {
    // TODO: Replace with real AI summary fetching logic
    return "This is an AI-generated summary of the file. (Placeholder)";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)"
          : "linear-gradient(135deg, #f9fbfd 0%, #f6f9ff 50%, #ffffff 100%)",
        transition: "background 0.3s ease",
        paddingTop: "80px",
        overflowX: "hidden",
      }}
    >
      <DashNav />
      <div
        style={{
          padding: "40px 20px 64px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            marginBottom: "48px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              color: theme.text,
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            My Files
          </h1>
        </div>

        {/* Files Section */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              fontSize: "18px",
              fontWeight: 600,
              color: theme.text,
            }}
          >
            Loading files...
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              fontSize: "18px",
              fontWeight: 600,
              color: "#ff6b6b",
            }}
          >
            {error}
          </div>
        ) : files.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: theme.textSecondary,
              fontSize: "16px",
            }}
          >
            No files uploaded yet. Upload files to get started!
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "24px",
            }}
          >
            {files.map((file) => (
              <div
                key={file._id}
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
                    : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                  border: isDark
                    ? `1px solid rgba(0, 212, 255, 0.15)`
                    : `1px solid rgba(0, 120, 255, 0.1)`,
                  borderRadius: "16px",
                  padding: "20px",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isDark
                    ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                    : "0 4px 20px rgba(0, 120, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 8px 30px rgba(0, 212, 255, 0.15)"
                    : "0 8px 30px rgba(0, 120, 255, 0.15)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isDark
                    ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                    : "0 4px 20px rgba(0, 120, 255, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* File Header */}
                <div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      color: theme.text,
                      margin: 0,
                      marginBottom: "4px",
                      wordBreak: "break-word",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    title={file.name}
                  >
                    {file.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background: "rgba(0, 212, 255, 0.15)",
                        color: "#00d4ff",
                        fontWeight: 600,
                      }}
                    >
                      {file.mimetype || "File"}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background: isDark
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.08)",
                        color: theme.textSecondary,
                      }}
                    >
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    onClick={() => {
                      navigate(`/files/${file._id}/view`);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      background:
                        "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(0, 212, 255, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0, 212, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 212, 255, 0.2)";
                    }}
                  >
                    <FaEye size={14} />
                    View
                  </button>
                  <button
                    onClick={() => openShareModal(file)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      background: isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)",
                      color: "#00d4ff",
                      border: "1px solid rgba(0, 212, 255, 0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(0, 212, 255, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    <FaShare size={14} />
                    Share
                  </button>
                </div>

                {/* Secondary Actions */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    onClick={() => {
                      setSummaryFileId(file._id);
                      setShowSummaryModal(true);
                    }}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      background: isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)",
                      color: "#fbbf24",
                      border: "1px solid rgba(251, 191, 36, 0.3)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(251, 191, 36, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    <FaMagic size={14} />
                    Summary
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    disabled={deletingId === file._id}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      background: isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)",
                      color: "#ff6b6b",
                      border: "1px solid rgba(255, 107, 107, 0.3)",
                      cursor:
                        deletingId === file._id ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                      opacity: deletingId === file._id ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (deletingId !== file._id) {
                        e.currentTarget.style.background =
                          "rgba(255, 107, 107, 0.15)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(0, 0, 0, 0.05)";
                    }}
                  >
                    <FaTrash size={14} />
                    {deletingId === file._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => closeShareModal()}
          >
            <div
              style={{
                borderRadius: "20px",
                padding: "32px",
                width: "384px",
                maxWidth: "100%",
                background: isDark
                  ? "rgba(30, 30, 30, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                border: isDark
                  ? "1px solid rgba(0, 212, 255, 0.15)"
                  : "1px solid rgba(0, 0, 0, 0.05)",
                backdropFilter: "blur(10px)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  marginBottom: "24px",
                  color: "#00d4ff",
                }}
              >
                Share "{fileToShare?.name}"
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "14px",
                      marginBottom: "12px",
                      color: "#00d4ff",
                    }}
                  >
                    Select friends to share with:
                  </label>
                  <div
                    style={{
                      maxHeight: 200,
                      overflowY: "auto",
                      padding: "12px",
                      borderRadius: "10px",
                      background: isDark
                        ? "rgba(40, 40, 40, 0.5)"
                        : "rgba(0, 0, 0, 0.02)",
                      border: isDark
                        ? "1px solid rgba(0, 212, 255, 0.1)"
                        : "1px solid rgba(0, 212, 255, 0.1)",
                    }}
                  >
                    {friends.map((friend) => (
                      <div key={friend._id} style={{ marginBottom: 8 }}>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            color: theme.text,
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedFriends.includes(friend._id)}
                            onChange={() => handleFriendToggle(friend._id)}
                          />
                          {friend.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: "14px",
                      marginBottom: "8px",
                      color: "#00d4ff",
                    }}
                  >
                    Add by email:
                  </label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="email"
                      placeholder="Enter friend's email"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: isDark
                          ? "1px solid rgba(0, 212, 255, 0.2)"
                          : "1px solid rgba(0, 212, 255, 0.2)",
                        background: isDark
                          ? "rgba(40, 40, 40, 0.7)"
                          : "rgba(255, 255, 255, 0.8)",
                        color: isDark ? "#fff" : "#000",
                      }}
                    />
                    <button
                      onClick={handleAddFriendByEmail}
                      disabled={!friendEmail.trim()}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "10px",
                        fontWeight: 600,
                        background:
                          "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                        color: "white",
                        border: "none",
                        cursor: friendEmail.trim() ? "pointer" : "not-allowed",
                        opacity: friendEmail.trim() ? 1 : 0.5,
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "24px",
                }}
              >
                <button
                  onClick={() => closeShareModal()}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    background: isDark
                      ? "rgba(40, 40, 40, 0.8)"
                      : "rgba(0, 0, 0, 0.1)",
                    color: isDark ? "#fff" : "#000",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleShare}
                  disabled={selectedFriends.length === 0}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    color: "white",
                    background:
                      "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                    border: "none",
                    cursor:
                      selectedFriends.length > 0 ? "pointer" : "not-allowed",
                    opacity: selectedFriends.length > 0 ? 1 : 0.5,
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Modal */}
        {showSummaryModal && summaryFileId && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              setShowSummaryModal(false);
              setSummaryFileId(null);
            }}
          >
            <div
              style={{
                borderRadius: "20px",
                width: "90%",
                maxWidth: "700px",
                background: isDark
                  ? "rgba(30, 30, 30, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "90vh",
                overflow: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "16px",
                  borderBottom: isDark
                    ? "1px solid rgba(0, 212, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.05)",
                }}
              >
                <button
                  onClick={() => {
                    setShowSummaryModal(false);
                    setSummaryFileId(null);
                  }}
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: theme.text,
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: 24 }}>
                <FileSummary fileId={summaryFileId} />
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {modalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setModalOpen(false)}
          >
            <div
              style={{
                borderRadius: "20px",
                padding: "32px",
                width: "384px",
                maxWidth: "100%",
                background: isDark
                  ? "rgba(30, 30, 30, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p
                style={{
                  marginBottom: "24px",
                  color: theme.text,
                }}
              >
                {modalMessage}
              </p>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  color: "white",
                  background:
                    "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        {confirmOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setConfirmOpen(false)}
          >
            <div
              style={{
                borderRadius: "20px",
                padding: "32px",
                width: "384px",
                maxWidth: "100%",
                background: isDark
                  ? "rgba(30, 30, 30, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p
                style={{
                  marginBottom: "24px",
                  color: theme.text,
                }}
              >
                {confirmMessage}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setConfirmOpen(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    background: isDark
                      ? "rgba(40, 40, 40, 0.8)"
                      : "rgba(0, 0, 0, 0.1)",
                    color: theme.text,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    setConfirmOpen(false);
                  }}
                  style={{
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    color: "white",
                    background: "#ff6b6b",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFiles;
