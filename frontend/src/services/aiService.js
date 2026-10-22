import { apiRequest } from "./api";

export const generateSummary = (text) =>
	apiRequest("/ai/summary", {
		method: "POST",
		body: JSON.stringify({ text }),
	});

export const suggestAction = ({ text, category, location }) =>
	apiRequest("/ai/suggest-action", {
		method: "POST",
		body: JSON.stringify({ text, category, location }),
	});
