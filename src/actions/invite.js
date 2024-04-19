//STATUS

//import axios from "axios";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

const reauthToken = window.localStorage.getItem("rt");

//SERVERSTATE will be either DEV or PRODUCTION
const serverState = import.meta.env.VITE_SERVERSTATE;

//Bringing in user, logged in flag, jwt token and refresh token
const userState = useUserStore();
const { user, isLoggedIn, token } = storeToRefs(userState);

//ESTABLISH SERVER NAME TO SET UP PROPER API CALL
let servername = "https://" + window.location.hostname;

function unAuthRedirect() {
  if (servername === "http://localhost") {
    location.href = "http://localhost:9000";
  }
  //  location.href = serverState + "/login"
  else {
    userState.userLogout();
    isLoggedIn.value = false;
    user.value = null;
    token.value = null;
    location.href = "https://www.memoriesforus.com";
  }
}

if (servername === "https://localhost") {
  servername = "http://localhost:8700";
} else {
  servername = "https://memoriesforusbe.azurewebsites.net";
}

export default {
  async getFreeInvitations(userID, userSubType) {
    let myroute = servername + "/getFreeInvitations";
    const params = {
      userID: userID,
      userSubType: userSubType,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async sendInvitation(userID, invitee, email, tcDate, invitedBy, userSubType) {
    console.log("userSubType is: ", userSubType);
    let myroute = servername + "/sendInvitation";
    // if (userSubType === 1) {
    //   myroute = servername + "/sendInvitation";
    // } else {
    //   myroute = servername + "/sendAdminInvitation";
    // }
    console.log("myroute is: ", myroute);

    const params = {
      userID: userID,
      invitee: invitee,
      email: email,
      tcDate: tcDate,
      invitedBy: invitedBy,
      userSubType: userSubType,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async sendAdminInvitation(
    userID,
    invitee,
    email,
    tcDate,
    invitedBy,
    userSubType
  ) {
    let myroute = "";
    myroute = servername + "/sendAdminInvitation";

    const params = {
      userID: userID,
      invitee: invitee,
      email: email,
      tcDate: tcDate,
      invitedBy: invitedBy,
      userSubType: userSubType,
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
