// API service for communicating with the backend
// Backend URL is loaded from .env file (VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Token ${token}` }),
  };
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to login');
  }
  return await response.json();
};

export const registerUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to register');
  }
  return await response.json();
};

export const checkPhishing = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/check-phishing/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking phishing:', error);
    throw error;
  }
};

export const getUrlAnalysis = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-url/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw error;
  }
};

export const getUserUrls = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-urls/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user urls:', error);
    throw error;
  }
};

export const getAdminUrls = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses/`, { // Admin endpoint
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching admin analyses:', error);
    throw error;
  }
};

export const addComment = async (url, text) => {
  const response = await fetch(`${API_BASE_URL}/add-comment/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ url, text }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add comment');
  }
  return await response.json();
};

export const getRecentComments = async () => {
  const response = await fetch(`${API_BASE_URL}/recent-comments/`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getRecentPhishingUrls = async () => {
  const response = await fetch(`${API_BASE_URL}/recent-phishing/`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export const getAdminStats = async () => {
  const response = await fetch(`${API_BASE_URL}/admin-stats/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export default {
  checkPhishing,
  getUrlAnalysis,
  getUserUrls,
  getAdminUrls,
  loginUser,
  registerUser,
  addComment,
  getRecentComments,
  getRecentPhishingUrls,
  getAdminStats
};