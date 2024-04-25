//STATUS

import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

const reauthToken = window.localStorage.getItem("rt");

//SERVERSTATE will be either DEV or PRODUCTION
const serverState = import.meta.env.VITE_SERVERSTATE;
const devMode = import.meta.env.MODE;
const viteMode = import.meta.env.VITE_MODENAME;

//Bringing in user, logged in flag, jwt token and refresh token
const userState = useUserStore();
const { user, isLoggedIn, token } = storeToRefs(userState);

//ESTABLISH SERVER NAME TO SET UP PROPER API CALL
let servername = "https://" + window.location.hostname;

//FUNCTION TO CALL IF ANY CALLS RECEIVE A 401 (unauthorized) ERROR
// function unAuthRedirect() {
//   location.href = serverState + "/";
// }
function unAuthRedirect() {
  if (servername === "http://localhost") {
    location.href = "http://localhost:9000";
  } else {
    userState.userLogout();
    isLoggedIn.value = false;
    user.value = null;
    token.value = null;
  }
}

if (servername === "https://localhost") {
  servername = "http://localhost:8700";
} else {
  servername = "https://memoriesforusbe.azurewebsites.net";
}

export default {
  async login(userEmail, userPassword) {
    let myroute = servername + "/auth";
    const params = {
      userEmail: userEmail,
      userPassword: userPassword,
    };
    var result = this.postApi(myroute, params).then((res) => {
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

  //Register a monthly paying subscriber - config for post
  async register(
    userFirst,
    userLast,
    userDisplayName,
    userEmail,
    userPassword,
    code
  ) {
    let myroute = servername + "/register";
    const params = {
      userFirst: userFirst,
      userLast: userLast,
      userDisplayName: userDisplayName,
      userEmail: userEmail,
      userPassword: userPassword,
      code: code,
    };
    var result = this.postApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  //Register a charter member - configured for post
  async registerCharter(
    userFirst,
    userLast,
    userDisplayName,
    userEmail,
    userPassword,
    verificationCode
  ) {
    let myroute = servername + "/invitedregister";
    const params = {
      userFirst: userFirst,
      userLast: userLast,
      userDisplayName: userDisplayName,
      userEmail: userEmail,
      userPassword: userPassword,
      verificationCode: verificationCode,
    };
    var result = this.postApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getStripePortal(stripeCustomer) {
    let myroute = servername + "/create-customer-portal-session";
    const params = {
      stripeCustomer: stripeCustomer,
    };
    var result = this.callApi(myroute, params).then((res) => {
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
    var result = this.postApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async sendForgotEamil(email) {
    let myroute = servername + "/forgot";
    const params = {
      email: email,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async resetCheck(email, verificationCode) {
    let myroute = servername + "/resetCheck";
    const params = {
      email: email,
      verifyCode: verificationCode,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async resetPassword(email, password) {
    let myroute = servername + "/resetPassword";
    const params = {
      email: email,
      password: password,
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
      return res;
    });
    return result;
  },

  async cancelAccount(reason, userID, userSubTypeID) {
    let myroute = servername + "/cancelaccount";
    const params = {
      userID: userID,
      userSubTypeID: userSubTypeID,
      reason: reason,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async reinstateAccount(userID) {
    let myroute = servername + "/reinstateaccount";
    const params = {
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async callApi(myroute, params) {
    const config = {
      method: "GET",
      url: myroute,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      params: params,
    };

    try {
      let res = await CapacitorHttp.request(config);
      return res.data;
    } catch (error) {
      if (error.response.status === 401) {
        unAuthRedirect();
      }
      console.log("send the user to the login page", error);
    }
  },

  async postApi(myroute, params) {
    const config = {
      method: "POST",
      url: myroute,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json, text/plain, */*",
      },
      params: params,
    };

    try {
      let res = await CapacitorHttp.request(config);
      console.log("postapi2 returns: ", res);
      return res.data;
    } catch (error) {
      if (error.response.status === 401) {
        unAuthRedirect();
      }
    }
  },
};
