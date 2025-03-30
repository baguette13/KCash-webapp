import axios, { Method } from 'axios';

// Type definition for the request data and function return type
interface RequestData {
  [key: string]: any; // Object to represent data being sent in the request body
}

const sendRequest = async (
  url: string,
  method: Method,
  data: RequestData | null = null,
): Promise<any> => {
  
  try {
    const headers = {
      "Authorization": `Bearer ${sessionStorage.getItem("access_token")}`,
      'Content-Type': 'application/json',
    };

    const response = await axios({
      url: `http://localhost:8000/${url}`,
      method: method,
      headers: headers,
      data: data, // Sending data for methods like POST, PUT
    });

    // Return response data (you can type it further based on the structure)
    return response.data;
  } catch (error: any) {
    // Handle any errors by printing the error message or response
    console.error(`Error with ${method} request to ${url}:`, error.response || error.message);
    throw error;
  }
};
export default sendRequest
