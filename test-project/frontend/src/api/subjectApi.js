import API from "./axios";

export const fetchSubjects = async () => {
  const response = await API.get("/subjects");
  return response.data;
};

export const createSubjectApi = async (subjectData) => {
  const response = await API.post("/subjects", subjectData);
  return response.data;
};

export const updateSubjectApi = async (id, subjectData) => {
  const response = await API.put(`/subjects/${id}`, subjectData);
  return response.data;
};

export const deleteSubjectApi = async (id) => {
  const response = await API.delete(`/subjects/${id}`);
  return response.data;
};
