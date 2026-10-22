import { apiRequest } from "./api";

export const getProjects = () => apiRequest("/projects");

export const createProject = (project) =>
  apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });

export const getProject = (id) => apiRequest(`/projects/${id}`);

export const updateProject = (id, project) =>
  apiRequest(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(project),
  });

export const createNote = (id, note) =>
  apiRequest(`/projects/${id}/notes`, {
    method: "POST",
    body: JSON.stringify(note),
  });

export const updateNote = (id, noteId, note) =>
  apiRequest(`/projects/${id}/notes/${noteId}`, {
    method: "PATCH",
    body: JSON.stringify(note),
  });

export const summarizeNote = (id, noteId) =>
  apiRequest(`/projects/${id}/notes/${noteId}/ai-summary`, {
    method: "POST",
  });

export const addMember = (id, email) =>
  apiRequest(`/projects/${id}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const getProjectAnalytics = (id) =>
  apiRequest(`/projects/${id}/analytics`);

export const uploadProjectFile = (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest(`/projects/${id}/files`, {
    method: "POST",
    body: formData,
  });
};

export const getPublicProject = (slug) =>
  apiRequest(`/public/projects/${slug}`);
