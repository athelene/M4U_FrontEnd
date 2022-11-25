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
  //servername = "https://login.memoriesforus.com";
  servername = "https://memoriesforusbe.azurewebsites.net";
}

export default {
  async addMessage(
    userID,
    messageText,
    messageStart,
    messageEnd,
    messageHeader
  ) {
    let myroute = servername + "/addmessage";
    const params = {
      userID: userID,
      messageText: messageText,
      messageStart: messageStart,
      messageEnd: messageEnd,
      messageHeader: messageHeader,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getMessage(userID) {
    let myroute = servername + "/getmessage";
    const params = {
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res[0];
    });
    return result;
  },

  async cancelMessage(userID, messageID) {
    let myroute = servername + "/cancelmessage";
    const params = {
      userID: userID,
      messageID: messageID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res[0];
    });
    return result;
  },

  async getUserCountsSubType() {
    let myroute = servername + "/getUserCountsSubType";
    const params = {
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res[0];
    });
    return result;
  },

  async charterInvitationsOpenCount() {
    let myroute = servername + "/charterInvitationsOpenCount";
    const params = {
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res[0];
    });
    return result;
  },

  async getSubTypes() {
    let myroute = servername + "/getsubtypes";
    const params = {
      token: token,
      reauthToken: reauthToken,
    };

    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },
  async getUserByEmail(email) {
    let myroute = servername + "/user";
    const params = {
      email: email,
      token: token,
      reauthToken: reauthToken,
    };

    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getUserByID(userID) {
    let myroute = servername + "/userbyid";
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

  async getUserByName(firstName, lastName) {
    let myroute = servername + "/userbyname";
    const params = {
      firstName: firstName,
      lastName: lastName,
      token: token,
      reauthToken: reauthToken,
    };

    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async editUser(subExpiration, subType, userID) {
    let myroute = servername + "/adminUpdateUser";
    const params = {
      subExpiration: subExpiration,
      subType: subType,
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
