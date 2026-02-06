// src/api/client/storage.ts
export const TOKEN_HEADER = "Authorization";

export const getStorageItems = () => {
  const token = localStorage.getItem("idToken");

  return {
    ...(token && { [TOKEN_HEADER]: `Bearer ${token}` }),
    "Content-Type": "application/json",
  };
};
