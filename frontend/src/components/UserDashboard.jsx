import React, { useState, useEffect, useRef } from "react";
import UserSidebar from "./UserSidebar.jsx";
import apiService from "../services/api.js";
import "./UserDashboard.css";
import { useNavigate, Link } from "react-router-dom";
import DashNav from "./DashNav.jsx";
import {
  FaDownload,
  FaTrash,
  FaPaperclip,
  FaShareAlt,
  FaEllipsisV,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import { useGlobalFileUpload } from "./GlobalFileUploadContext";
import FileSummary from "./FileSummary.jsx";

const UserDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newSubject, setNewSubject] = useState({ name: "", subject_code: "" });
  const [newTopic, setNewTopic] = useState({ name: "", description: "" });
  const [needsGoogleDriveAuth, setNeedsGoogleDriveAuth] = useState(false);
  const [suggestedSubject, setSuggestedSubject] = useState("");
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectInput, setSubjectInput] = useState("");
  const [uploadedFileId, setUploadedFileId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  // Placeholder: friends list and selected friends
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [friendEmail, setFriendEmail] = useState("");
  const { openUploadModal } = useGlobalFileUpload();
  // Add local state for topic file upload
  const [topicUploadTarget, setTopicUploadTarget] = useState({
    subject: null,
    topic: null,
  });
  const topicFileInputRef = useRef(null);
  // Add local state for subject menu
  const [subjectMenuOpenId, setSubjectMenuOpenId] = useState(null);
  // Add local state for file menu in topic files
  const [topicFileMenuOpenId, setTopicFileMenuOpenId] = useState(null);
  const navigate = useNavigate();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryFileId, setSummaryFileId] = useState(null);
  // Add state for expanded topics
  const [expandedTopics, setExpandedTopics] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  // Add state for topic upload modal
  const [showTopicUploadModal, setShowTopicUploadModal] = useState(false);
  const [topicUploadFile, setTopicUploadFile] = useState(null);
  const [topicUploadProgress, setTopicUploadProgress] = useState(0);
  const [topicUploadLoading, setTopicUploadLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
    checkGoogleDriveAccess();
  }, []);

  const checkGoogleDriveAccess = async () => {
    try {
      const response = await apiService.checkGoogleDriveStatus();
      setNeedsGoogleDriveAuth(!response.hasDriveAccess);
    } catch (error) {
      setNeedsGoogleDriveAuth(true);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await apiService.getSubjects();
      setSubjects(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Failed to fetch subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await apiService.createSubject(newSubject);
      setNewSubject({ name: "", subject_code: "" });
      setShowAddSubject(false);
      fetchSubjects();
    } catch (error) {
      setModalMessage("Failed to create subject: " + error.message);
      setModalOpen(true);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    try {
      await apiService.addTopic(selectedSubject._id, newTopic);
      setNewTopic({ name: "", description: "" });
      setShowAddTopic(false);
      setSelectedSubject(null);
      fetchSubjects();
    } catch (error) {
      setModalMessage("Failed to create topic: " + error.message);
      setModalOpen(true);
    }
  };

  const handleConfirmSubject = async () => {
    // Call backend to create/associate subject with file
    try {
      await apiService.createSubjectAndLinkFile({
        subjectName: subjectInput,
        fileId: uploadedFileId,
      });
      setShowSubjectModal(false);
      setSuggestedSubject("");
      setSubjectInput("");
      setUploadedFileId(null);
      fetchSubjects();
    } catch (err) {
      alert("Failed to create/associate subject");
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    setSubjectToDelete(subjectId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSubject = async () => {
    try {
      await apiService.deleteSubject(subjectToDelete);
      setShowDeleteConfirm(false);
      setSubjectToDelete(null);
      fetchSubjects(); // Refresh the subjects list
    } catch (error) {
      alert("Failed to delete subject: " + error.message);
    }
  };

  const handleDeleteFile = (fileId) => {
    if (!fileId) {
      setModalMessage("Invalid file ID");
      setModalOpen(true);
      return;
    }
    setConfirmMessage("Are you sure you want to delete this file?");
    setOnConfirm(() => () => handleDeleteFileConfirmed(fileId));
    setConfirmOpen(true);
  };
  const handleDeleteFileConfirmed = async (fileId) => {
    try {
      await apiService.request(`/api/files/${fileId}`, { method: "DELETE" });
      fetchSubjects();
    } catch (err) {
      setModalMessage("Failed to delete file");
      setModalOpen(true);
    }
  };

  const handleDeleteTopic = (subjectId, topicId) => {
    if (!topicId || !subjectId) {
      setModalMessage("Invalid topic or subject ID");
      setModalOpen(true);
      return;
    }
    setConfirmMessage("Are you sure you want to delete this topic?");
    setOnConfirm(() => () => handleDeleteTopicConfirmed(subjectId, topicId));
    setConfirmOpen(true);
  };
  const handleDeleteTopicConfirmed = async (subjectId, topicId) => {
    try {
      await apiService.deleteTopic(subjectId, topicId);
      fetchSubjects();
    } catch (err) {
      setModalMessage("Failed to delete topic");
      setModalOpen(true);
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
        : [...prev, friendId]
    );
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

  const handleAddFriendByEmail = () => {
    if (!friendEmail.trim()) return;
    // Add to friends list if not already present
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

  // Local handler for topic file upload
  const handleTopicFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !topicUploadTarget.subject || !topicUploadTarget.topic) return;
    try {
      await apiService.uploadFile(
        file,
        undefined, // no progress callback
        topicUploadTarget.subject._id,
        topicUploadTarget.topic._id
      );
      fetchSubjects();
    } catch (err) {
      alert("Failed to upload file to topic");
    }
    setTopicUploadTarget({ subject: null, topic: null });
    if (topicFileInputRef.current) topicFileInputRef.current.value = "";
  };

  // New function for opening topic upload modal
  const openTopicUploadModal = (subject, topic) => {
    setTopicUploadTarget({ subject, topic });
    setShowTopicUploadModal(true);
    setTopicUploadFile(null);
    setTopicUploadProgress(0);
  };

  // New function for handling topic file uploads (non-AI)
  const handleTopicFileUpload = async (e) => {
    e.preventDefault();
    if (!topicUploadFile || !topicUploadTarget.subject || !topicUploadTarget.topic) {
      alert("Please select a file");
      return;
    }

    setTopicUploadLoading(true);
    try {
      // Use a different API endpoint or add a flag to disable AI processing
      await apiService.uploadFile(
        topicUploadFile,
        (progress) => {
          setTopicUploadProgress(progress);
        },
        topicUploadTarget.subject._id,
        topicUploadTarget.topic._id
      );

      setTopicUploadFile(null);
      setShowTopicUploadModal(false);
      setTopicUploadProgress(0);
      setTopicUploadTarget({ subject: null, topic: null });
      fetchSubjects();
      // Removed alert - file uploads silently
    } catch (error) {
      console.error("Topic file upload error:", error);
      if (error.message.includes("401") || error.message.includes("Google")) {
        setNeedsGoogleDriveAuth(true);
        alert(
          "You need to authorize Google Drive access to upload files. Please click the 'Authorize Google Drive' button."
        );
      } else {
        alert("Failed to upload file: " + error.message);
      }
    } finally {
      setTopicUploadLoading(false);
    }
  };

  // Helper to toggle topic expansion
  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading">Loading subjects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <>
      <DashNav />
      <div className="user-dashboard">
        <main className="dashboard-main2">
          <header className="dashboard-header">
            <h1>My Subjects</h1>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className="add-subject-btn"
                onClick={() => setShowAddSubject(true)}
              >
                + Add Subject
              </button>
              {/* Mobile Upload Icon Button */}
              <button
                className="upload-file-btn-mobile add-subject-btn"
                onClick={openUploadModal}
                style={{
                  marginLeft: "12px",
                  whiteSpace: "nowrap",
                }}
                title="Upload File with AI"
              >
                Upload File
              </button>
              {/* Desktop Upload Button */}
              <button
                className="upload-file-btn-desktop add-subject-btn"
                onClick={openUploadModal}
                style={{
                  marginLeft: "16px",
                }}
              >
                Upload File
              </button>
            </div>
          </header>

          {needsGoogleDriveAuth && (
            <div
              className="google-drive-notice"
              style={{
                background: "#fff3cd",
                border: "1px solid #ffeaa7",
                borderRadius: "4px",
                padding: "1rem",
                marginBottom: "1rem",
                color: "#856404",
              }}
            >
              <p>
                <strong>Google Drive Access Required</strong>
              </p>
              <p>
                To upload files, you need to authorize Google Drive access.
                Click the "Authorize Google Drive" button above.
              </p>
            </div>
          )}

          <div className="subjects-grid">
            {subjects.length === 0 ? (
              <div className="no-subjects">
                <p>No subjects yet. Create your first subject!</p>
                <button
                  className="add-subject-btn"
                  onClick={() => setShowAddSubject(true)}
                  style={{ marginTop: "1rem" }}
                >
                  + Create Your First Subject
                </button>
              </div>
            ) : (
              subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="subject-card"
                  style={{ position: "relative" }}
                >
                  <div className="subject-header">
                    <h3>{subject.name}</h3>
                    {/* <span className="subject-code">{subject.subject_code}</span> */}

                    {/* Dropdown menu */}
                    {subjectMenuOpenId === subject._id && (
                      <div
                        className="file-menu-dropdown"
                        style={{
                          position: "absolute",
                          top: 44,
                          right: 16,
                          background: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: 8,
                          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                          zIndex: 10,
                          minWidth: 140,
                        }}
                      >
                        <button
                          onClick={() => setSubjectMenuOpenId(null)}
                          className="file-menu-item"
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 18px",
                            color: "#222",
                            background: "none",
                            border: "none",
                            textAlign: "left",
                            cursor: "pointer",
                            borderBottom: "1px solid #f1f1f1",
                          }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteSubject(subject._id);
                            setSubjectMenuOpenId(null);
                          }}
                          className="file-menu-item"
                          style={{
                            display: "block",
                            width: "100%",
                            padding: "10px 18px",
                            color: "#ef4444",
                            background: "none",
                            border: "none",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    <button
                      className="delete-subject-btn"
                      onClick={() => handleDeleteSubject(subject._id)}
                      title="Delete subject"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="topics-section">
                    <div className="topics-header">
                      <h4>Topics</h4>
                      <button
                        className="add-topic-btn"
                        onClick={() => {
                          setSelectedSubject(subject);
                          setShowAddTopic(true);
                        }}
                      >
                        +
                      </button>
                    </div>

                    {subject.topics && subject.topics.length > 0 ? (
                      <div className="topics-list">
                        {subject.topics.map((topic) => (
                          <div key={topic._id} className="topic-item">
                            <div
                              className="topic-header"
                              style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                              onClick={() => toggleTopic(topic._id)}
                            >
                              {expandedTopics.includes(topic._id) ? (
                                <FaChevronDown style={{ marginRight: 8 }} />
                              ) : (
                                <FaChevronRight style={{ marginRight: 8 }} />
                              )}
                              <h5 style={{ margin: 0 }}>{topic.name}</h5>
                            </div>
                            {expandedTopics.includes(topic._id) && (
                              <>
                                {topic.description && (
                                  <p className="topic-description">{topic.description}</p>
                                )}
                                <div className="topic-actions" style={{ position: "relative" }}>
                                  <button
                                    className="file-menu-btn"
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      fontSize: 20,
                                      marginLeft: 8,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTopicFileMenuOpenId(
                                        topicFileMenuOpenId === topic._id ? null : topic._id
                                      );
                                    }}
                                    aria-label="Topic actions"
                                  >
                                    <FaEllipsisV />
                                  </button>
                                  {topicFileMenuOpenId === topic._id && (
                                    <div
                                      className="file-menu-dropdown"
                                      style={{
                                        position: "absolute",
                                        top: 36,
                                        right: 0,
                                        background: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: 8,
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                        zIndex: 10,
                                        minWidth: 140,
                                      }}
                                    >
                                      <button
                                        className="file-menu-item"
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          padding: "10px 18px",
                                          color: "#222",
                                          background: "none",
                                          border: "none",
                                          textAlign: "left",
                                          cursor: "pointer",
                                          borderBottom: "1px solid #f1f1f1",
                                        }}
                                        onClick={() => {
                                          openTopicUploadModal(subject, topic);
                                          setTopicFileMenuOpenId(null);
                                        }}
                                      >
                                        Upload File
                                      </button>
                                      <button
                                        className="file-menu-item"
                                        style={{
                                          display: "block",
                                          width: "100%",
                                          padding: "10px 18px",
                                          color: "#ef4444",
                                          background: "none",
                                          border: "none",
                                          textAlign: "left",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          handleDeleteTopic(subject._id, topic._id);
                                          setTopicFileMenuOpenId(null);
                                        }}
                                      >
                                        Delete Topic
                                      </button>
                                    </div>
                                  )}
                                  {/* Hidden file input for topic upload */}
                                  <input
                                    type="file"
                                    ref={topicFileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleTopicFileChange}
                                    accept="*"
                                  />
                                </div>
                                {topic.files && topic.files.length > 0 && (
                                  <div className="files-list">
                                    {topic.files.map((file, fileIdx) => (
                                      <div
                                        key={file._id || fileIdx}
                                        className="file-item"
                                        style={{ position: "relative" }}
                                      >
                                        <span className="file-name">
                                          {file.name}
                                        </span>
                                        {/* 3-dots menu button */}
                                        <button
                                          className="file-menu-btn"
                                          style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            fontSize: 20,
                                            marginLeft: 8,
                                          }}
                                          onClick={() =>
                                            setTopicFileMenuOpenId(
                                              topicFileMenuOpenId === file._id
                                                ? null
                                                : file._id
                                            )
                                          }
                                          aria-label="File actions"
                                        >
                                          <FaEllipsisV />
                                        </button>
                                        {/* Dropdown menu */}
                                        {topicFileMenuOpenId === file._id && (
                                          <div
                                            className="file-menu-dropdown"
                                            style={{
                                              position: "absolute",
                                              top: 44,
                                              right: 16,
                                              background: "#fff",
                                              border: "1px solid #e5e7eb",
                                              borderRadius: 8,
                                              boxShadow:
                                                "0 4px 16px rgba(0,0,0,0.08)",
                                              zIndex: 10,
                                              minWidth: 140,
                                            }}
                                          >
                                            <button
                                              onClick={() => {
                                                setSummaryFileId(file._id);
                                                setShowSummaryModal(true);
                                                setTopicFileMenuOpenId(null);
                                              }}
                                              className="file-menu-item"
                                              style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "10px 18px",
                                                color: "#2563eb",
                                                background: "none",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #f1f1f1",
                                              }}
                                            >
                                              AI Summary
                                            </button>
                                            <a
                                              href={file.drive_file_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="file-menu-item"
                                              style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "10px 18px",
                                                color: "#222",
                                                textDecoration: "none",
                                                cursor: "pointer",
                                                fontSize: "15px",
                                                fontWeight: "400",
                                                textAlign: "left",
                                              
                                                background: "none",
                                                border: "none",
                                                borderBottom: "1px solid #f1f1f1",
                                              }}
                                            >
                                              View
                                            </a>
                                            <button
                                              onClick={() => {
                                                openShareModal(file);
                                                setTopicFileMenuOpenId(null);
                                              }}
                                              className="file-menu-item"
                                              style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "10px 18px",
                                                color: "#2563eb",
                                                background: "none",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #f1f1f1",
                                              }}
                                            >
                                              Share
                                            </button>
                                            <button
                                              onClick={() => {
                                                handleDeleteFile(file._id);
                                                setTopicFileMenuOpenId(null);
                                              }}
                                              className="file-menu-item"
                                              style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "10px 18px",
                                                color: "#ef4444",
                                                background: "none",
                                                border: "none",
                                                textAlign: "left",
                                                cursor: "pointer",
                                                borderBottom: "1px solid #f1f1f1",
                                              }}
                                            >
                                              Delete
                                            </button>
                                            
                                            
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-topics">
                        No topics yet. Add your first topic!
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Add Subject Modal */}
        {showAddSubject && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Subject</h3>
              <form onSubmit={handleAddSubject}>
                <div className="form-group">
                  <label>Subject Name:</label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject Code:</label>
                  <input
                    type="text"
                    value={newSubject.subject_code}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        subject_code: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    Add Subject
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddSubject(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Topic Modal */}
        {showAddTopic && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Add New Topic to {selectedSubject?.name}</h3>
              <form onSubmit={handleAddTopic}>
                <div className="form-group">
                  <label>Topic Name:</label>
                  <input
                    type="text"
                    value={newTopic.name}
                    onChange={(e) =>
                      setNewTopic({ ...newTopic, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description (Optional):</label>
                  <textarea
                    value={newTopic.description}
                    onChange={(e) =>
                      setNewTopic({ ...newTopic, description: e.target.value })
                    }
                    rows="3"
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">
                    Add Topic
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddTopic(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Delete Subject</h3>
              <p>
                Are you sure you want to delete this subject? This action cannot
                be undone.
              </p>
              <div className="modal-actions">
                <button onClick={confirmDeleteSubject} className="btn-danger">
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subject Suggestion Modal */}
        {showSubjectModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Suggested Subject</h3>
              <div className="form-group">
                <label>Subject Name:</label>
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleConfirmSubject}>
                  Confirm
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowSubjectModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Share "{fileToShare?.name}"</h3>
              <div className="form-group">
                <label>Select friends to share with:</label>
                <div
                  style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    margin: "1rem 0",
                  }}
                >
                  {friends.map((friend) => (
                    <div key={friend._id} style={{ marginBottom: 8 }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedFriends.includes(friend._id)}
                          onChange={() => handleFriendToggle(friend._id)}
                        />{" "}
                        {friend.name}
                      </label>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16 }}>
                  <input
                    type="email"
                    placeholder="Enter friend's email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    style={{
                      padding: 8,
                      borderRadius: 6,
                      border: "1px solid #d1d5db",
                      width: "70%",
                    }}
                  />
                  <button
                    className="btn-primary"
                    style={{ marginLeft: 8, padding: "0.5rem 1rem" }}
                    onClick={handleAddFriendByEmail}
                    disabled={!friendEmail.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="btn-primary"
                  onClick={handleShare}
                  disabled={selectedFriends.length === 0}
                >
                  Share
                </button>
                <button className="btn-secondary" onClick={closeShareModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Topic Upload Modal (Non-AI) */}
        {showTopicUploadModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Upload File to Topic</h3>
              <p style={{ marginBottom: "1rem", color: "#666" }}>
                Uploading to: <strong>{topicUploadTarget.subject?.name}</strong> → <strong>{topicUploadTarget.topic?.name}</strong>
              </p>
              <form onSubmit={handleTopicFileUpload}>
                <div className="form-group">
                  <label>Select File:</label>
                  <input 
                    type="file" 
                    onChange={(e) => setTopicUploadFile(e.target.files[0])} 
                    required 
                  />
                </div>
                {topicUploadProgress > 0 && (
                  <div className="upload-progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${topicUploadProgress}%` }}
                    ></div>
                    <span>{Math.round(topicUploadProgress)}%</span>
                  </div>
                )}
                <div className="modal-actions">
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={topicUploadLoading}
                  >
                    {topicUploadLoading ? "Uploading..." : "Upload File"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowTopicUploadModal(false)}
                    disabled={topicUploadLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSummaryModal && summaryFileId && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target.classList.contains("modal-overlay")) {
                setShowSummaryModal(false);
                setSummaryFileId(null);
              }
            }}
          >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: 8,
                }}
              >
                <button
                  onClick={() => {
                    setShowSummaryModal(false);
                    setSummaryFileId(null);
                  }}
                  style={{
                    fontSize: 22,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              <div style={{ padding: 24 }}>
                <FileSummary fileId={summaryFileId} />
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .upload-file-btn-mobile {
            display: flex !important;
          }
          .upload-file-btn-desktop {
            display: none !important;
          }
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .dashboard-header > div {
            width: 100%;
            justify-content: flex-start;
          }
        }
        @media (min-width: 769px) {
          .upload-file-btn-mobile {
            display: none !important;
          }
          .upload-file-btn-desktop {
            display: block !important;
          }
        }
        .upload-file-btn-mobile.add-subject-btn,
        .upload-file-btn-desktop.add-subject-btn {
          margin-right: 0;
        }
        .modal select {
          width: 100%;
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #d1d5db;
          font-size: 14px;
          background-color: white;
          transition: border-color 0.2s;
        }
        .modal select:focus {
          outline: none;
          border-color: #0078FF;
          box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.1);
        }
        .modal select:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }
        .file-menu-item:hover, .file-menu-item:focus {
          background: #f5faff;
          color: #2563eb;
          outline: none;
        }
      `}</style>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{modalMessage}</p>
            <button onClick={() => setModalOpen(false)} className="btn-primary">Close</button>
          </div>
        </div>
      )}
      {confirmOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p>{confirmMessage}</p>
            <button onClick={() => { onConfirm(); setConfirmOpen(false); }} className="btn-danger">Yes</button>
            <button onClick={() => setConfirmOpen(false)} className="btn-secondary">No</button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
