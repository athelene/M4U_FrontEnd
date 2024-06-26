//STATUS

//import axios from "axios";
import { CapacitorHttp } from "@capacitor/core";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
const reauthToken = window.localStorage.getItem("rt");

//SERVERSTATE will be either DEV or PRODUCTION
const serverState = import.meta.env.VITE_SERVERSTATE;

//Bringing in user, logged in flag, jwt token and refresh token
const userState = useUserStore();
const { user, isLoggedIn, token } = storeToRefs(userState);

//ESTABLISH SERVER NAME TO SET UP PROPER API CALL
let servername = "https://" + window.location.hostname;

//FUNCTION TO CALL IF ANY AXIOS CALLS RECEIVE A 401 (unauthorized) ERROR
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

  async addNews(newsTitle, newsText, newsDate, newsSubType) {
    let myroute = servername + "/addnews";
    const params = {
      newsTitle: newsTitle,
      newsText: newsText,
      newsDate: newsDate,
      newsSubType: newsSubType,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteNews(newsID) {
    let myroute = servername + "/deletenews";
    const params = {
      newsID: newsID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getUserSubTypes() {
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

  async getOpenAdminInvitations() {
    let myroute = servername + "/openadmininvitations";
    const params = {
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

  async editInvitation(subExpiration, subType, userEmail) {
    let myroute = servername + "/adminUpdateInvitation";
    const params = {
      subExpiration: subExpiration,
      subType: subType,
      userEmail: userEmail,
      token: token,
      reauthToken: reauthToken,
    };

    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteInvitation(invitationID) {
    let myroute = servername + "/adminDeleteInvitation";
    const params = {
      invitationID: invitationID,
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
