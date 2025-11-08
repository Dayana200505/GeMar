import axios from 'axios';

// Configuración base de axios
const API_URL = 'http://localhost:8000/api/readings'; // Ajusta según tu URL de Laravel

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const readingService = {
  /**
   * Obtener todas las lecturas
   */
  getAllReadings: async () => {
    try {
      const response = await api.get('/readings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener una lectura por ID
   */
  getReadingById: async (id) => {
    try {
      const response = await api.get(`/readings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener lectura por periodo
   */
  getReadingByPeriodo: async (periodo) => {
    try {
      const response = await api.get(`/readings/periodo/${periodo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener lectura anterior de un departamento
   */
  getPreviousReading: async (department) => {
    try {
      const response = await api.get(`/readings/previous/${department}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Guardar nueva lectura completa
   */
  saveReading: async (readingData) => {
    try {
      const response = await api.post('/readings', readingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar lectura existente
   */
  updateReading: async (id, readingData) => {
    try {
      const response = await api.put(`/readings/${id}`, readingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar lectura
   */
  deleteReading: async (id) => {
    try {
      const response = await api.delete(`/readings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default readingService;