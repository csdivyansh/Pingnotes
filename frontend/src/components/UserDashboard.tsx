import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";
import DashNav from "./DashNav";
import { useGlobalFileUpload } from "./GlobalFileUploadContext";
import apiService from "../services/api";
import { FaTrash } from "react-icons/fa";

interface Subject {
  _id: string;
  name: string;
  subject_code?: string;
  topics?: Topic[];
  created_at?: string;
}

interface Topic {
  _id: string;
  name: string;
  description?: string;
  files?: File[];
}

interface File {
  _id: string;
  name: string;
  path?: string;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const theme = isDark ? themes.dark : themes.light;
  const { openUploadModal } = useGlobalFileUpload();

  // State management
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [newSubject, setNewSubject] = useState({ name: "", subject_code: "" });
  const [newTopic, setNewTopic] = useState({ name: "", description: "" });
  const [needsGoogleDriveAuth, setNeedsGoogleDriveAuth] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [subjectMenuOpenId, setSubjectMenuOpenId] = useState<string | null>(
    null,
  );
  const [topicFileMenuOpenId, setTopicFileMenuOpenId] = useState<string | null>(
    null,
  );

  // Effects
  useEffect(() => {
    fetchSubjects();
    checkGoogleDriveAccess();
  }, []);

  // API functions
  const checkGoogleDriveAccess = async () => {
    try {
      const response = await apiService.checkGoogleDriveStatus();
      setNeedsGoogleDriveAuth(!response.hasDriveAccess);
    } catch {
      setNeedsGoogleDriveAuth(true);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await apiService.getSubjects();
      setSubjects(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createSubject(newSubject);
      setNewSubject({ name: "", subject_code: "" });
      setShowAddSubject(false);
      fetchSubjects();
    } catch (err: any) {
      setModalMessage("Failed to create subject: " + err.message);
      setModalOpen(true);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    try {
      await apiService.addTopic(selectedSubject._id, newTopic);
      setNewTopic({ name: "", description: "" });
      setShowAddTopic(false);
      setSelectedSubject(null);
      fetchSubjects();
    } catch (err: any) {
      setModalMessage("Failed to create topic: " + err.message);
      setModalOpen(true);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    setSubjectToDelete(subjectId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSubject = async () => {
    if (!subjectToDelete) return;
    try {
      await apiService.deleteSubject(subjectToDelete);
      setShowDeleteConfirm(false);
      setSubjectToDelete(null);
      fetchSubjects();
    } catch (err: any) {
      setModalMessage("Failed to delete subject: " + err.message);
      setModalOpen(true);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (!fileId) {
      setModalMessage("Invalid file ID");
      setModalOpen(true);
      return;
    }
    setConfirmMessage("Are you sure you want to delete this file?");
    setOnConfirm(() => handleDeleteFileConfirmed(fileId));
    setConfirmOpen(true);
  };

  const handleDeleteFileConfirmed = async (fileId: string) => {
    try {
      await apiService.request(`/api/files/${fileId}`, { method: "DELETE" });
      fetchSubjects();
    } catch {
      setModalMessage("Failed to delete file");
      setModalOpen(true);
    }
  };

  const handleDeleteTopic = (subjectId: string, topicId: string) => {
    if (!topicId || !subjectId) {
      setModalMessage("Invalid topic or subject ID");
      setModalOpen(true);
      return;
    }
    setConfirmMessage("Are you sure you want to delete this topic?");
    setOnConfirm(() => handleDeleteTopicConfirmed(subjectId, topicId));
    setConfirmOpen(true);
  };

  const handleDeleteTopicConfirmed = async (
    subjectId: string,
    topicId: string,
  ) => {
    try {
      await apiService.deleteTopic(subjectId, topicId);
      fetchSubjects();
    } catch {
      setModalMessage("Failed to delete topic");
      setModalOpen(true);
    }
  };

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId],
    );
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: isDark
            ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)"
            : "linear-gradient(135deg, #f9fbfd 0%, #f6f9ff 50%, #ffffff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
        }}
      >
        <DashNav />
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: theme.text,
          }}
        >
          Loading subjects...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: isDark
            ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)"
            : "linear-gradient(135deg, #f9fbfd 0%, #f6f9ff 50%, #ffffff 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
        }}
      >
        <DashNav />
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#ff6b6b",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

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
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 800,
              color: theme.text,
              letterSpacing: "-1px",
            }}
          >
            My Subjects
          </h1>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setShowAddSubject(true)}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "15px",
                background: `linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)`,
                color: "white",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
              }}
              onMouseEnter={(e) => {
                const elem = e.currentTarget;
                elem.style.transform = "translateY(-2px)";
                elem.style.boxShadow = "0 8px 25px rgba(0, 212, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                const elem = e.currentTarget;
                elem.style.transform = "translateY(0)";
                elem.style.boxShadow = "0 4px 15px rgba(0, 212, 255, 0.3)";
              }}
            >
              + Add Subject
            </button>
            <button
              onClick={openUploadModal}
              style={{
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "15px",
                background: `linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)`,
                color: "white",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
              }}
              onMouseEnter={(e) => {
                const elem = e.currentTarget;
                elem.style.transform = "translateY(-2px)";
                elem.style.boxShadow = "0 8px 25px rgba(0, 212, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                const elem = e.currentTarget;
                elem.style.transform = "translateY(0)";
                elem.style.boxShadow = "0 4px 15px rgba(0, 212, 255, 0.3)";
              }}
            >
              Upload Files
            </button>
          </div>
        </div>

        {/* Subjects Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "28px",
            marginBottom: "48px",
          }}
        >
          {subjects.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "48px 20px",
                color: theme.textSecondary,
                fontSize: "16px",
              }}
            >
              No subjects yet. Create one to get started!
            </div>
          ) : (
            subjects.map((subject) => (
              <div
                key={subject._id}
                style={{
                  background: isDark
                    ? `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`
                    : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)`,
                  border: isDark
                    ? `1px solid rgba(0, 212, 255, 0.15)`
                    : `1px solid rgba(0, 120, 255, 0.1)`,
                  borderRadius: "20px",
                  padding: "24px",
                  minHeight: "380px",
                  display: "flex",
                  flexDirection: "column",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: isDark
                    ? "0 4px 20px rgba(0, 212, 255, 0.05)"
                    : "0 4px 20px rgba(0, 120, 255, 0.08)",
                }}
              >
                {/* Subject Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        marginBottom: "8px",
                        color: theme.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {subject.name}
                    </h3>
                    {subject.subject_code && (
                      <span
                        style={{
                          display: "block",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 600,
                          background: "rgba(0, 212, 255, 0.15)",
                          color: "#00d4ff",
                          border: "1px solid rgba(0, 212, 255, 0.3)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                        title={subject.subject_code}
                      >
                        {subject.subject_code}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteSubject(subject._id)}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <FaTrash size={16} />
                  </button>
                </div>

                {/* Topics Section */}
                {subject.topics && subject.topics.length > 0 && (
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop: `1px solid ${
                        isDark
                          ? "rgba(0, 212, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.08)"
                      }`,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "12px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#00d4ff",
                          margin: 0,
                        }}
                      >
                        Topics
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedSubject(subject);
                          setShowAddTopic(true);
                        }}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "16px",
                          color: "white",
                          background:
                            "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                          border: "none",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Topics List */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        overflow: "auto",
                      }}
                    >
                      {subject.topics.map((topic) => (
                        <div
                          key={topic._id}
                          style={{
                            borderRadius: "12px",
                            padding: "12px",
                            background: isDark
                              ? "rgba(40, 40, 40, 0.6)"
                              : "rgba(255, 255, 255, 0.6)",
                            border: isDark
                              ? "1px solid rgba(0, 212, 255, 0.15)"
                              : "1px solid rgba(0, 0, 0, 0.08)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{ flex: 1 }}
                              onClick={() => toggleTopic(topic._id)}
                            >
                              <h5
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "#00d4ff",
                                  margin: 0,
                                  marginBottom: "4px",
                                }}
                              >
                                {topic.name}
                              </h5>
                              {topic.description && (
                                <p
                                  style={{
                                    fontSize: "12px",
                                    margin: 0,
                                    opacity: 0.75,
                                    color: isDark ? "#aaa" : "#666",
                                  }}
                                >
                                  {topic.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleDeleteTopic(subject._id, topic._id)
                              }
                              style={{
                                marginLeft: "8px",
                                padding: "4px",
                                borderRadius: "6px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                transition: "opacity 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.opacity = "0.7";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.opacity = "1";
                              }}
                            >
                              <FaTrash size={12} style={{ color: "#ff6b6b" }} />
                            </button>
                          </div>

                          {/* Topic Files */}
                          {expandedTopics.includes(topic._id) &&
                            topic.files &&
                            topic.files.length > 0 && (
                              <div
                                style={{
                                  marginTop: "12px",
                                  paddingTop: "12px",
                                  borderTop: `1px solid ${
                                    isDark
                                      ? "rgba(0, 212, 255, 0.2)"
                                      : "rgba(0, 212, 255, 0.15)"
                                  }`,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                {topic.files.map((file) => (
                                  <div
                                    key={file._id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      padding: "8px",
                                      borderRadius: "6px",
                                      fontSize: "12px",
                                      background: isDark
                                        ? "rgba(0, 212, 255, 0.08)"
                                        : "rgba(0, 212, 255, 0.05)",
                                      border: isDark
                                        ? "1px solid rgba(0, 212, 255, 0.2)"
                                        : "1px solid rgba(0, 212, 255, 0.15)",
                                    }}
                                  >
                                    <span
                                      style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        color: theme.text,
                                      }}
                                    >
                                      {file.name}
                                    </span>
                                    <button
                                      onClick={() => handleDeleteFile(file._id)}
                                      style={{
                                        marginLeft: "8px",
                                        padding: "4px",
                                        border: "none",
                                        background: "transparent",
                                        cursor: "pointer",
                                        transition: "opacity 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = "0.7";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = "1";
                                      }}
                                    >
                                      <FaTrash
                                        size={10}
                                        style={{ color: "#ff6b6b" }}
                                      />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
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
          onClick={() => setShowAddSubject(false)}
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
              Add Subject
            </h3>
            <form
              onSubmit={handleAddSubject}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
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
                  Subject Name
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                  placeholder="Enter subject name"
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    transition: "all 0.3s",
                    outline: "none",
                    background: isDark
                      ? "rgba(40, 40, 40, 0.7)"
                      : "rgba(255, 255, 255, 0.8)",
                    border: isDark
                      ? "1.5px solid rgba(0, 212, 255, 0.2)"
                      : "1.5px solid rgba(0, 212, 255, 0.2)",
                    color: isDark ? "#ffffff" : "#0a192f",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(0, 212, 255, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
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
                  Subject Code (Optional)
                </label>
                <input
                  type="text"
                  value={newSubject.subject_code}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      subject_code: e.target.value,
                    })
                  }
                  placeholder="Enter subject code"
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    transition: "all 0.3s",
                    outline: "none",
                    background: isDark
                      ? "rgba(40, 40, 40, 0.7)"
                      : "rgba(255, 255, 255, 0.8)",
                    border: isDark
                      ? "1.5px solid rgba(0, 212, 255, 0.2)"
                      : "1.5px solid rgba(0, 212, 255, 0.2)",
                    color: isDark ? "#ffffff" : "#0a192f",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(0, 212, 255, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
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
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    transition: "all 0.3s",
                    background: isDark
                      ? "rgba(40, 40, 40, 0.8)"
                      : "rgba(0, 0, 0, 0.1)",
                    color: isDark ? "#ffffff" : "#0a192f",
                    border: isDark
                      ? "1.5px solid rgba(0, 212, 255, 0.3)"
                      : "1.5px solid rgba(0, 212, 255, 0.3)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    color: "white",
                    background:
                      "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 212, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0, 212, 255, 0.3)";
                  }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Topic Modal */}
      {showAddTopic && selectedSubject && (
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
          onClick={() => setShowAddTopic(false)}
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
              Add Topic to {selectedSubject.name}
            </h3>
            <form
              onSubmit={handleAddTopic}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
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
                  Topic Name
                </label>
                <input
                  type="text"
                  value={newTopic.name}
                  onChange={(e) =>
                    setNewTopic({ ...newTopic, name: e.target.value })
                  }
                  placeholder="Enter topic name"
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    transition: "all 0.3s",
                    outline: "none",
                    background: isDark
                      ? "rgba(40, 40, 40, 0.7)"
                      : "rgba(255, 255, 255, 0.8)",
                    border: isDark
                      ? "1.5px solid rgba(0, 212, 255, 0.2)"
                      : "1.5px solid rgba(0, 212, 255, 0.2)",
                    color: isDark ? "#ffffff" : "#0a192f",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(0, 212, 255, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
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
                  Description (Optional)
                </label>
                <textarea
                  value={newTopic.description}
                  onChange={(e) =>
                    setNewTopic({ ...newTopic, description: e.target.value })
                  }
                  placeholder="Enter topic description"
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    transition: "all 0.3s",
                    outline: "none",
                    background: isDark
                      ? "rgba(40, 40, 40, 0.7)"
                      : "rgba(255, 255, 255, 0.8)",
                    border: isDark
                      ? "1.5px solid rgba(0, 212, 255, 0.2)"
                      : "1.5px solid rgba(0, 212, 255, 0.2)",
                    color: isDark ? "#ffffff" : "#0a192f",
                    resize: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(0, 212, 255, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
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
                  type="button"
                  onClick={() => setShowAddTopic(false)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    transition: "all 0.3s",
                    background: isDark
                      ? "rgba(40, 40, 40, 0.8)"
                      : "rgba(0, 0, 0, 0.1)",
                    color: isDark ? "#ffffff" : "#0a192f",
                    border: isDark
                      ? "1.5px solid rgba(0, 212, 255, 0.3)"
                      : "1.5px solid rgba(0, 212, 255, 0.3)",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 24px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    color: "white",
                    background:
                      "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(0, 212, 255, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(0, 212, 255, 0.3)";
                  }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
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
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "16px",
                color: theme.text,
              }}
            >
              Confirm
            </h3>
            <p
              style={{
                marginBottom: "24px",
                color: theme.textSecondary,
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
                  transition: "all 0.3s",
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
                  transition: "all 0.3s",
                  boxShadow: "0 4px 15px rgba(255, 107, 107, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(255, 107, 107, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(255, 107, 107, 0.3)";
                }}
              >
                Confirm
              </button>
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
                background: "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 4px 15px rgba(0, 212, 255, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(0, 212, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(0, 212, 255, 0.3)";
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
