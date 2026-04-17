import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import useApi from "../hooks/useApi";
import { getTasks, createTask } from "../services/taskservice";
import { toast } from "react-toastify";

function Home() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const numericProjectId = Number(projectId);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const { loading: loadingTasks, request: fetchTasks } = useApi(getTasks);
  const { loading: creating, request: createTaskApi } = useApi(createTask);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const loadTasks = React.useCallback(async () => {
    try {
      if (!numericProjectId || Number.isNaN(numericProjectId)) {
        setTasks([]);
        setTotalPages(1);
        return;
      }

      const response = await fetchTasks(numericProjectId, {
        page,
        pageSize,
        status: filterStatus,
        priority: filterPriority,
        sortBy,
        sortDir,
      });

      setTasks(Array.isArray(response?.data) ? response.data : []);

      const total = response?.totalCount || 0;
      setTotalPages(response?.totalPages || Math.ceil(total / pageSize));
    } catch {
      toast.error("Failed to load tasks");
    }
  }, [
    fetchTasks,
    numericProjectId,
    page,
    pageSize,
    filterStatus,
    filterPriority,
    sortBy,
    sortDir,
  ]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = tasks.filter(
    (task) =>
      task &&
      task.title &&
      task.title.toLowerCase().includes(search.toLowerCase())
  );

  const addTask = async (e) => {
    e.preventDefault();

    if (!numericProjectId || Number.isNaN(numericProjectId)) {
      toast.error("Please open a valid project first");
      navigate("/projects");
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast.warning("Title and Description are required");
      return;
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error("Due date cannot be in the past");
        return;
      }
    }

    try {
      await createTaskApi(numericProjectId, {
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });

      toast.success("Task created successfully");

      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("Todo");
      setDueDate("");
      loadTasks();
    } catch (err) {
      const errors = err?.response?.data?.errors;
      const apiMessage = err?.response?.data?.message;

      let message = "Failed to create task";

      if (errors) {
        const allErrors = Object.values(errors).flat().filter(Boolean);

        if (allErrors.length > 0) {
          const matchedNumberError = allErrors.find((msg) =>
            msg.toLowerCase().includes("number")
          );

          const matchedPastDateError = allErrors.find(
            (msg) =>
              msg.toLowerCase().includes("past") ||
              msg.toLowerCase().includes("date") ||
              msg.toLowerCase().includes("due")
          );

          if (matchedNumberError) {
            message = "Title cannot be just numbers";
          } else if (matchedPastDateError) {
            message = "Due date cannot be in the past";
          } else {
            message = allErrors[0];
          }
        }
      } else if (apiMessage) {
        message = apiMessage;
      }

      toast.error(message);
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <div className="header-bar">
        <h1 className="title">Taskboard</h1>
        <div className="theme-toggle">
          <span className="toggle-label">
            {darkMode ? "Dark mode is ON" : "Turn on dark mode"}
          </span>
          <div
            className={`toggle-switch ${darkMode ? "active" : ""}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="toggle-circle"></div>
          </div>
        </div>
      </div>

      <div className="top-bar">
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks"
        />
      </div>

      <div className="task-filters">
        <select
          className="form-input"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Statuses</option>
          <option value="Todo">Todo</option>
          <option value="InProgress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Done">Done</option>
        </select>

        <select
          className="form-input"
          value={filterPriority}
          onChange={(e) => {
            setFilterPriority(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <select
          className="form-input"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
        >
          <option value="createdAt">Sort by Created</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>

        <select
          className="form-input"
          value={sortDir}
          onChange={(e) => {
            setSortDir(e.target.value);
            setPage(1);
          }}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {loadingTasks && <p>Loading tasks...</p>}

      <form onSubmit={addTask} className="task-form">
        <input
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          className="form-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <select
          className="form-input"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <select
          className="form-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Todo</option>
          <option>InProgress</option>
          <option>Review</option>
          <option>Done</option>
        </select>

        <input
          className="form-input"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button className="add-task-btn" type="submit" disabled={creating}>
          {creating ? "Adding..." : "+ Add Task"}
        </button>
      </form>

      <TaskList tasks={filteredTasks} refreshTasks={loadTasks} />

      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={page === num ? "active-page" : ""}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
