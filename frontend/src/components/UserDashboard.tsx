import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { themes } from "./themeConfig";
import DashNav from "./DashNav";
import { useGlobalFileUpload } from "./GlobalFileUploadContext";
import apiService from "../services/api";
import FileSummary from "./FileSummary";
import {
  FaDownload,
  FaTrash,
  FaPaperclip,
  FaShareAlt,
  FaEllipsisV,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

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
    setOnConfirm(() => () => handleDeleteFileConfirmed(fileId));
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
    setOnConfirm(() => () => handleDeleteTopicConfirmed(subjectId, topicId));
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
        className="min-h-screen pt-20 pb-16 transition-all duration-300"
        style={{ background: theme.bg, color: theme.text }}
      >
        <DashNav />
        <div className="text-center py-12 text-lg font-semibold">
          Loading subjects...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="min-h-screen pt-20 pb-16 transition-all duration-300"
        style={{ background: theme.bg, color: theme.text }}
      >
        <DashNav />
        <div className="text-center py-12 text-lg font-semibold text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <DashNav />
      <div
        className="min-h-screen pt-20 pb-16 transition-all duration-300"
        style={{ background: theme.bg, color: theme.text }}
      >
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <header
            className="flex items-center justify-between gap-6 mb-9 rounded-2xl p-6 backdrop-blur-md transition-all duration-300"
            style={{
              background: isDark
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
              borderColor: isDark
                ? "rgba(0, 212, 255, 0.15)"
                : "rgba(0, 0, 0, 0.08)",
              borderWidth: "1px",
            }}
          >
            <h1 className="text-4xl font-bold">My Subjects</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddSubject(true)}
                className="px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-black"
                style={{
                  background: `linear-gradient(93deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                }}
              >
                + Add Subject
              </button>
              <button
                onClick={openUploadModal}
                className="px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-black"
                style={{
                  background: `linear-gradient(93deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                }}
              >
                Upload
              </button>
            </div>
          </header>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {subjects.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                No subjects yet. Create one to get started!
              </div>
            ) : (
              subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="rounded-2xl p-8 transition-all duration-300 flex flex-direction flex-col min-h-96 backdrop-blur"
                  style={{
                    background: isDark
                      ? "rgba(30, 30, 30, 0.8)"
                      : "rgba(255, 255, 255, 0.85)",
                    borderColor: isDark
                      ? "rgba(0, 212, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.08)",
                    borderWidth: "1px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={() => {}}
                  onMouseLeave={() => setSubjectMenuOpenId(null)}
                >
                  {/* Subject Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
                      {subject.subject_code && (
                        <span
                          className="inline-block px-3 py-1 rounded-lg text-sm font-semibold"
                          style={{
                            background: "rgba(0, 212, 255, 0.15)",
                            color: "#00d4ff",
                            borderWidth: "1px",
                            borderColor: "rgba(0, 212, 255, 0.3)",
                          }}
                        >
                          {subject.subject_code}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSubject(subject._id)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 text-white"
                      style={{
                        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                      }}
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>

                  {/* Topics Section */}
                  {subject.topics && subject.topics.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-opacity-10 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4
                          className="text-lg font-bold"
                          style={{ color: "#00d4ff" }}
                        >
                          Topics
                        </h4>
                        <button
                          onClick={() => setSelectedSubject(subject)}
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg text-black transition-all duration-300 hover:scale-110"
                          style={{
                            background: "linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)",
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Topics List */}
                      <div className="space-y-2">
                        {subject.topics.map((topic) => (
                          <div
                            key={topic._id}
                            className="rounded-xl p-3 transition-all duration-300"
                            style={{
                              background: isDark
                                ? "rgba(40, 40, 40, 0.6)"
                                : "rgba(255, 255, 255, 0.6)",
                              borderColor: isDark
                                ? "rgba(0, 212, 255, 0.15)"
                                : "rgba(0, 0, 0, 0.08)",
                              borderWidth: "1px",
                            }}
                          >
                            <div className="flex items-center justify-between cursor-pointer">
                              <div
                                className="flex-1"
                                onClick={() => toggleTopic(topic._id)}
                              >
                                <h5
                                  className="font-bold text-sm"
                                  style={{ color: "#00d4ff" }}
                                >
                                  {topic.name}
                                </h5>
                                {topic.description && (
                                  <p
                                    className="text-xs mt-1 opacity-75"
                                    style={{
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
                                className="ml-2 p-1 rounded transition-all duration-200 hover:opacity-70"
                              >
                                <FaTrash
                                  size={14}
                                  style={{ color: "#ff6b6b" }}
                                />
                              </button>
                            </div>

                            {/* Topic Files */}
                            {expandedTopics.includes(topic._id) &&
                              topic.files &&
                              topic.files.length > 0 && (
                                <div className="mt-3 space-y-1 border-t border-opacity-20 pt-3">
                                  {topic.files.map((file) => (
                                    <div
                                      key={file._id}
                                      className="flex items-center justify-between p-2 rounded text-xs"
                                      style={{
                                        background: isDark
                                          ? "rgba(0, 212, 255, 0.08)"
                                          : "rgba(0, 212, 255, 0.05)",
                                        borderColor: isDark
                                          ? "rgba(0, 212, 255, 0.2)"
                                          : "rgba(0, 212, 255, 0.15)",
                                        borderWidth: "1px",
                                      }}
                                    >
                                      <span className="truncate">
                                        {file.name}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleDeleteFile(file._id)
                                        }
                                        className="ml-2 p-1 hover:opacity-70 transition-opacity"
                                      >
                                        <FaTrash
                                          size={12}
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
        </main>

        {/* Add Subject Modal */}
        {showAddSubject && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowAddSubject(false)}
          >
            <div
              className="rounded-2xl p-8 w-96 max-w-full"
              style={{
                background: isDark
                  ? "rgba(30, 30, 30, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                borderColor: isDark
                  ? "rgba(0, 212, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.05)",
                borderWidth: "1px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: "#00d4ff" }}>
                Add Subject
              </h3>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div>
                  <label className="block font-semibold text-sm mb-2" style={{ color: "#00d4ff" }}>
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, name: e.target.value })
                    }
                    placeholder="Enter subject name"
                    className="w-full px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    style={{
                      background: isDark
                        ? "rgba(40, 40, 40, 0.7)"
                        : "rgba(255, 255, 255, 0.8)",
                      borderColor: isDark
                        ? "rgba(0, 212, 255, 0.2)"
                        : "rgba(0, 212, 255, 0.2)",
                      borderWidth: "1.5px",
                      color: isDark ? "#ffffff" : "#0a192f",
                    }}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-sm mb-2" style={{ color: "#00d4ff" }}>
                    Subject Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={newSubject.subject_code}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, subject_code: e.target.value })
                    }
                    placeholder="Enter subject code"
                    className="w-full px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    style={{
                      background: isDark
                        ? "rgba(40, 40, 40, 0.7)"
                        : "rgba(255, 255, 255, 0.8)",
                      borderColor: isDark
                        ? "rgba(0, 212, 255, 0.2)"
                        : "rgba(0, 212, 255, 0.2)",
                      borderWidth: "1.5px",
                      color: isDark ? "#ffffff" : "#0a192f",
                    }}
                  />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddSubject(false)}
                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                    style={{
                      background: isDark
                        ? "rgba(40, 40, 40, 0.8)"
                        : "rgba(0, 0, 0, 0.1)",
                      color: isDark ? "#ffffff" : "#0a192f",
                      borderWidth: "1.5px",
                      borderColor: isDark
                        ? "rgba(0, 212, 255, 0.3)"
                        : "rgba(0, 212, 255, 0.3)",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg font-semibold text-black transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)`,
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setConfirmOpen(false)}
          >
            <div
              className="rounded-2xl p-8 w-96 max-w-full"
              style={{
                background: isDark
                  ? "rgba(30, 30, 30, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Confirm</h3>
              <p className="mb-6">{confirmMessage}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 rounded-lg font-semibold"
                  style={{
                    background: isDark
                      ? "rgba(40, 40, 40, 0.8)"
                      : "rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    setConfirmOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg font-semibold text-white"
                  style={{ background: "#ff6b6b" }}
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="rounded-2xl p-8 w-96 max-w-full"
              style={{
                background: isDark
                  ? "rgba(30, 30, 30, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-6">{modalMessage}</p>
              <button
                onClick={() => setModalOpen(false)}
                className="w-full px-4 py-2 rounded-lg font-semibold text-black"
                style={{
                  background: `linear-gradient(135deg, #00d4ff 0%, #0078ff 100%)`,
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;
