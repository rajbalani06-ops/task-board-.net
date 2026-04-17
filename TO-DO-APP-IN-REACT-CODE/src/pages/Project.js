import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject } from "../services/projectservice";

function Project() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProjects();
      setProjects(Array.isArray(res) ? res : []);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const project = await createProject({
        name,
        description,
      });

      setName("");
      setDescription("");
      await loadProjects();

      if (project?.id) {
        navigate(`/projects/${project.id}`);
      }
    } catch (err) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) {
        const firstError = Object.values(apiErrors).flat()[0];
        setError(firstError || "Failed to create project");
      } else {
        setError("Failed to create project");
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="app-container">
      <div className="projects-wrapper">
        <div className="projects-page">
          <div className="projects-header">
            <div>
              <p className="projects-eyebrow">Workspace</p>
              <h1 className="title">Projects</h1>
              <p className="projects-subtitle">
                Organize work by project and jump into each task board.
              </p>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <form className="project-form" onSubmit={handleCreateProject}>
            <input
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
            />
            <input
              className="form-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
            />
            <button className="add-task-btn" type="submit" disabled={creating}>
              {creating ? "Creating..." : "+ Add Project"}
            </button>
          </form>

          {loading && <p>Loading projects...</p>}

          <div className="projects-grid">
            {projects.map((project) => {
              const totalTasks =
                (project.todoCount || 0) +
                (project.inProgressCount || 0) +
                (project.reviewCount || 0) +
                (project.doneCount || 0);

              return (
                <div
                  key={project.id}
                  className="project-card"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="project-card-top">
                    <h3>{project.name}</h3>
                    <span className="project-total">{totalTasks} tasks</span>
                  </div>

                  <p className="project-description">
                    {project.description || "No description added yet."}
                  </p>

                  <div className="project-summary">
                    <span>{project.todoCount || 0} Todo</span>
                    <span>{project.inProgressCount || 0} In Progress</span>
                    <span>{project.reviewCount || 0} Review</span>
                    <span>{project.doneCount || 0} Done</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Project;