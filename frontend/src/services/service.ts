import sendRequest from "./sendRequest";
import { UserDetails } from "../interfaces/interfaces";

class MainService {

  getUserHistory() {
    const path = "api/orders/";
    const method = "GET";

    return sendRequest(path, method);
  }

  editUserData(userDetails: UserDetails) {
    const path = "api/profile/update/";
    const method = "POST";
    const requestBody = {
      first_name: userDetails.first_name,
      last_name: userDetails.last_name,
      email: userDetails.email,
      username: userDetails.username,
    };
    return sendRequest(path, method, requestBody);
  }

  getUserData() {
    const path = `api/profile/details/`;
    const method = "GET";
    return sendRequest(path, method);
  }

  getAllOrders() {
    const path = "api/logistics/orders/";
    const method = "GET";
    return sendRequest(path, method);
  }

  getPendingOrders() {
    const path = "api/logistics/orders/pending/";
    const method = "GET";
    return sendRequest(path, method);
  }

  getCompletedOrders() {
    const path = "api/logistics/orders/completed/";
    const method = "GET";
    return sendRequest(path, method);
  }

  updateOrderStatus(orderId: number, status: string) {
    const path = `api/logistics/orders/${orderId}/status/`;
    const method = "PUT";
    const requestBody = { status };
    return sendRequest(path, method, requestBody);
  }
}

const mainService = new MainService();
export default mainService;
