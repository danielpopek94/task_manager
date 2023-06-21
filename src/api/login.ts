import axios from 'axios';
import { BASE_URL } from '.';

export const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(BASE_URL + '/login', { email, password });

    return response.data;
  } catch (err) {
    throw err;
  }
};
