const API_URL = 'http://localhost:3000';

export const API = {
    
  async getTasks() {
    const res = await fetch(`${API_URL}/tasks`);
    return await res.json();
  },

  async createTask(taskData) {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    return await res.json();
  },

  async updateTaskStatus(taskId, newStatus) {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    return await res.json();
  },

  async updateTask(taskId, updatedData) {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    return await res.json();
  },

  async deleteTask(taskId) {
    await fetch(`${API_URL}/tasks/${taskId}`, { method: 'DELETE' });
  },

  async getCommentsByTaskId(taskId) {
    const res = await fetch(`${API_URL}/comments?taskId=${taskId}`);
    return await res.json();
  },

  async addComment(commentData) {
    const res = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    return await res.json();
  }
};