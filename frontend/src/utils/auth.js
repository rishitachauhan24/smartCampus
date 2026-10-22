export const getToken = () => {
  return localStorage.getItem("smartcampus_token");
};

export const isLoggedIn = () => {
  return Boolean(getToken());
};

export const clearToken = () => {
  localStorage.removeItem("smartcampus_token");
};