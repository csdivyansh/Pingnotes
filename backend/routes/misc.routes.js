import express from "express";
import {
  getTodos,
  updateTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
} from "../controllers/todo/todo.controller.js";

const router = express.Router();

// Todo routes
router.get("/todos/:userName", getTodos);
router.put("/todos/:userName", updateTodos);
router.post("/todos/:userName", addTodo);
router.delete("/todos/:userName/:index", deleteTodo);
router.patch("/todos/:userName/:index", toggleTodo);

export default router;
