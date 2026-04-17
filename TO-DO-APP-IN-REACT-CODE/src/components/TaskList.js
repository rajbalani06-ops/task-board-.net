import React from "react";
import { useNavigate } from "react-router-dom";
import { deleteTaskById } from "../services/taskservice";
import { toast } from "react-toastify";

function TaskList({ tasks, refreshTasks }) {
  const navigate = useNavigate();


  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Delete this task?</p>

          <div className="toast-actions">
            <button
              className="toast-delete-btn"
              onClick={async () => {
                try {
                  await deleteTaskById(id);
                  toast.success("Task deleted successfully 🗑");
                  refreshTasks();
                } catch (err) {
                  if (err.response && err.response.data) {
                    toast.error(err.response.data);
                  } else {
                    toast.error("Delete failed");
                  }
                }
                closeToast();
              }}
            >
              Delete
            </button>

            <button
              className="toast-cancel-btn"
              onClick={() => {
                toast.info("Deletion cancelled");
                closeToast();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

  if (!tasks.length) {
    return <p className="empty">No tasks found</p>;
  }

  return (
    <div className="table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
<td className="task-title-cell">{task.title}</td>

              <td>
                <span className={`badge priority-${task.priority?.toLowerCase()}`}>
                  {task.priority}
                </span>
              </td>

              <td>
                <span
                  className={`badge status-${task.status
                    ?.toLowerCase()
                    .replace("inprogress", "in-progress")}`}
                >
                  {task.status}
                </span>
              </td>

              <td className="desc">{task.description || "-"}</td>

              <td>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                {task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                <button onClick={() => navigate(`/tasks/${task.id}`)}>
                  View
                </button>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



export default TaskList;