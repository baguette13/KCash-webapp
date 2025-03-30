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
}

const mainService = new MainService();
export default mainService;
