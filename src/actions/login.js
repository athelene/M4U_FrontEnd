//STATUS

import axios from "axios";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
const reauthToken = window.localStorage.getItem("rt");

//SERVERSTATE will be either DEV or PRODUCTION
const serverState = import.meta.env.VITE_SERVERSTATE;

//Bringing in user, logged in flag, jwt token and refresh token
const userState = useUserStore();
const { user, isLoggedIn, token } = storeToRefs(userState);

//FUNCTION TO CALL IF ANY AXIOS CALLS RECEIVE A 401 (unauthorized) ERROR
function unAuthRedirect() {
  location.href = serverState + "/login";
}

//ESTABLISH SERVER NAME TO SET UP PROPER API CALL
let servername = "https://" + window.location.hostname;

if (servername === "https://localhost") {
  servername = "http://localhost:8700";
} else {
  // servername = "https://login.memoriesforus.com";
  servername = "https://memoriesforusbe.azurewebsites.net";
}

export default {
  async login(userEmail, userPassword) {
    let myroute = servername + "/auth";
    const params = {
      userEmail: userEmail,
      userPassword: userPassword,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async dupCheck(userEmail) {
    let myroute = servername + "/dupCheck";
    const params = {
      userEmail: userEmail,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async register(
    userFirst,
    userLast,
    userDisplayName,
    userEmail,
    userPassword
  ) {
    let myroute = servername + "/register";
    const params = {
      userFirst: userFirst,
      userLast: userLast,
      userDisplayName: userDisplayName,
      userEmail: userEmail,
      userPassword: userPassword,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    console.log("login.js registration receives from api: ", result);
    return result;
  },

  async checkoutPage(userEmail) {
    console.log("starting loginAction checkoutpage", userEmail);
    let myroute = servername + "/create-checkout-session";
    const params = {
      userEmail: userEmail,
    };
    var result = this.callApi(myroute, params).then((res) => {
      console.log("login.js receives url as: ", res);
      return res;
    });
    return result;
  },

  async updateUser(userID, userFirst, userLast, userDisplayName, userEmail) {
    let myroute = servername + "/updateUser";
    let res = "";
    const params = {
      userID: userID,
      userFirst: userFirst,
      userLast: userLast,
      userDisplayName: userDisplayName,
      newEmail: userEmail,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async changeEmail(userEmail, userID) {
    let myroute = servername + "/changeEmail";
    const params = {
      userID: userID,
      newEmail: userEmail,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async updatePassword(userID, oldPassword, newPassword) {
    let myroute = servername + "/updatePassword";
    const params = {
      userID: userID,
      oldPassword: oldPassword,
      newPassword: newPassword,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getUserInfo(userID) {
    let myroute = servername + "/userinfo";
    const params = {
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      console.log("res is: ", res);
      return res;
    });
    console.log("result is: ", result);
    return result;
  },

  async callApi(myroute, params) {
    try {
      let res = await axios.get(myroute, { params });
      return res.data;
    } catch (error) {
      if (error.response.status === 401) {
        unAuthRedirect();
      }
      console.log("send the user to the login page", error);
    }
  },
};
