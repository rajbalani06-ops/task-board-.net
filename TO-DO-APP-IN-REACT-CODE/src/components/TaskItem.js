import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteTaskById } from "../services/taskservice";

function TaskItem({ task, refreshTasks }) {
  const navigate = useNavigate();

  const deleteTask = async () => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    try {
      await deleteTaskById(task.id);
      refreshTasks();
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="task-card">
      <h3>{task.title}</h3>

      <div className="task-meta">
        <span className="badge status">{task.status}</span>
        <span className="badge priority">{task.priority}</span>
      </div>

      <div className="task-actions">
        <button onClick={() => navigate(`/tasks/${task.id}`)}>
          View
        </button>

        <button onClick={deleteTask} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;