import { Method } from 'axios';
import api from './axiosConfig';

interface RequestData {
  [key: string]: any; 
}

const sendRequest = async (
  url: string,
  method: Method,
  data: RequestData | null = null,
): Promise<any> => {
  
  try {
    const response = await api({
      url: url,
      method: method,
      data: data, 
    });

    return response.data;
  } catch (error: any) {
    console.error(`Error with ${method} request to ${url}:`, error.response || error.message);
    throw error;
  }
};
export default sendRequest
