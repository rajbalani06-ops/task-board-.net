import API from "./api";

export const getProjects = async () => {
  try {
    const res = await API.get("/projects");
    return res.data;
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const getProjectById = async (projectId) => {
  try {
    const res = await API.get(`/projects/${projectId}`);
    return res.data;
  } catch (err) {
    console.error("GET PROJECT ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const createProject = async (data) => {
  try {
    const payload = {
      name: data.name?.trim(),
      description: data.description?.trim() || "",
    };

    if (!payload.name) {
      throw new Error("Project name is required");
    }

    const res = await API.post("/projects", payload);
    return res.data;
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const updateProject = async (projectId, data) => {
  try {
    const payload = {
      name: data.name?.trim(),
      description: data.description?.trim() || "",
    };

    if (!payload.name) {
      throw new Error("Project name is required");
    }

    const res = await API.put(`/projects/${projectId}`, payload);
    return res.data;
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const res = await API.delete(`/projects/${projectId}`);
    return res.data;
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err.response?.data || err.message);
    throw err;
  }
};
