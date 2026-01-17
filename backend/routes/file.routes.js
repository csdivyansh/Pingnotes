import express from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  uploadFiles, // 🔥 unified handler
  getAllFiles,
  getFileById,
  deleteFile,
  restoreFile,
  permanentDeleteFile,
  getFilesSharedWithGroup,
  emptyTrash,
  shareFile,
  deleteAllFiles, // <-- add this import
  getFileSummary, // <-- add this import
  updateAllFilesToWebViewLink,
} from "../controllers/file/file.controller.js";

const router = express.Router();
// Use memory storage instead of disk storage for Vercel compatibility
const upload = multer({ storage: multer.memoryStorage() });

// 🔒 Protect all routes
router.use(requireAuth(["admin", "teacher", "user"]));

// 🚀 Single or Multiple uploads handled here
router.post("/upload", upload.any(), uploadFiles);
router.get("/", getAllFiles);
router.get("/trash", async (req, res) => {
  try {
    const files = await (
      await import("../models/file.model.js")
    ).default.find({
      uploaded_by: req.user.id,
      uploaded_by_role:
        req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1),
      is_deleted: true,
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trashed files" });
  }
});
router.post("/restore/:id", restoreFile);
router.delete("/permanent/:id", permanentDeleteFile);
router.delete("/empty-trash", emptyTrash);
router.delete(
  "/all",
  requireAuth(["admin", "teacher", "user"]),
  deleteAllFiles,
);
router.get("/:id", getFileById);
router.delete("/:id", deleteFile);
router.get("/shared/group/:groupId", getFilesSharedWithGroup);
router.post("/:id/share", shareFile);
router.get("/:id/summary", getFileSummary);

// Admin utility: update all files to use webViewLink
router.post("/update-all-to-webviewlink", updateAllFilesToWebViewLink);

export default router;
