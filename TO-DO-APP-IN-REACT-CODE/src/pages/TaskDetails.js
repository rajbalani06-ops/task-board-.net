import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTaskById,
  getComments,
  addComment,
  updateTask,
} from "../services/taskservice";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTaskDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const taskRes = await getTaskById(id);
      setTitle(taskRes.title || "");
      setDescription(taskRes.description || "");
      setPriority(taskRes.priority || "Medium");
      setStatus(taskRes.status || "Todo");
      setDueDate(taskRes.dueDate ? taskRes.dueDate.split("T")[0] : "");

      const commentsRes = await getComments(id);
      setComments(Array.isArray(commentsRes) ? commentsRes : []);
    } catch (err) {
      setError("Failed to load task details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTaskDetails();
  }, [loadTaskDetails]);

  const handleUpdateTask = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError("Due date cannot be in the past");
        return;
      }
    }

    try {
      setSaving(true);
      setError("");

      await updateTask(id, {
        title,
        description,
        priority,
        status,
        dueDate,
      });
    } catch (err) {
      setError("Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!author.trim()) {
      setError("Author is required");
      return;
    }

    if (!input.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setError("");

      await addComment(id, {
        author,
        body: input,
      });

      setAuthor("");
      setInput("");
      loadTaskDetails();
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  return (
    <div className="task-details-page">
      <div className="task-details-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <h2>Task Details</h2>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading...</p>}

        {!loading && (
          <div className="task-info">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Todo</option>
              <option>InProgress</option>
              <option>Review</option>
              <option>Done</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <button onClick={handleUpdateTask} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        <h3>Comments</h3>

        <div className="comment-box">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleAddComment}>Add Comment</button>
        </div>

        <div className="comment-list">
          {comments.length === 0 ? (
            <p>No comments yet</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment-item">
                <strong>{c.author}</strong>
                <p>{c.body}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
