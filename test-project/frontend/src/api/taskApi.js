import API from "./axios";

// Fetch Tasks
export const fetchTasks = async () => {
  const response = await API.get("/tasks");

  return response.data;
};

// Create Task
export const createTaskApi = async (taskData) => {
  const response = await API.post(
    "/tasks",
    taskData
  );

  return response.data;
};

// Update Task
export const updateTaskApi = async (
  taskId,
  taskData
) => {
  const response = await API.put(
    `/tasks/${taskId}`,
    taskData
  );

  return response.data;
};

// Delete Task
export const deleteTaskApi = async (taskId) => {
  const response = await API.delete(
    `/tasks/${taskId}`
  );

  return response.data;
};
