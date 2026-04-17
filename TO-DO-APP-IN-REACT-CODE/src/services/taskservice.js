import API from "./api";

export const getTasks = async (projectId, params = {}) => {
  try {
    const query = new URLSearchParams();

    query.append("page", params.page || 1);
    query.append("pageSize", params.pageSize || 10);

    if (params.status) query.append("status", params.status);
    if (params.priority) query.append("priority", params.priority);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.sortDir) query.append("sortDir", params.sortDir);

    const res = await API.get(
      `/projects/${projectId}/tasks?${query.toString()}`
    );

    return res.data;
  } catch (err) {
    console.error("GET TASKS ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const getTaskById = async (taskId) => {
  try {
    const res = await API.get(`/tasks/${taskId}`);
    return res.data;
  } catch (err) {
    console.error("GET TASK ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const createTask = async (projectId, data) => {
  try {
    const payload = {
      title: data.title?.trim(),
      description: data.description?.trim() || "",
      status: data.status || "Todo",
      priority: data.priority || "Medium",
      dueDate: data.dueDate
        ? new Date(data.dueDate).toISOString()
        : null,
    };

    if (!payload.title) {
      throw new Error("Title is required");
    }

    const res = await API.post(
      `/projects/${projectId}/tasks`,
      payload
    );

    return res.data;
  } catch (err) {
    console.error("CREATE TASK ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const updateTask = async (taskId, data) => {
  try {
    const payload = {
      title: data.title?.trim(),
      description: data.description?.trim() || "",
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate
        ? new Date(data.dueDate).toISOString()
        : null,
    };

    if (!payload.title) {
      throw new Error("Title is required");
    }

    const res = await API.put(`/tasks/${taskId}`, payload);
    return res.data;
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteTaskById = async (taskId) => {
  try {
    const res = await API.delete(`/tasks/${taskId}`);
    return res.data;
  } catch (err) {
    console.error("DELETE TASK ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const getComments = async (taskId) => {
  try {
    const res = await API.get(`/tasks/${taskId}/comments`);
    return res.data;
  } catch (err) {
    console.error("GET COMMENTS ERROR:", err.response?.data || err.message);
    throw err;
  }
};

export const addComment = async (taskId, data) => {
  try {
    if (!data.author?.trim()) {
      throw new Error("Author is required");
    }

    if (!data.body?.trim()) {
      throw new Error("Comment cannot be empty");
    }

    const res = await API.post(`/tasks/${taskId}/comments`, {
      author: data.author.trim(),
      body: data.body.trim(),
    });

    return res.data;
  } catch (err) {
    console.error("ADD COMMENT ERROR:", err.response?.data || err.message);
    throw err;
  }
};
