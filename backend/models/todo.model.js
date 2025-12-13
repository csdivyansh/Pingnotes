import mongoose from "mongoose";

export const todoSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    todos: [
      {
        text: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    lastOpenDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Todo", todoSchema);
