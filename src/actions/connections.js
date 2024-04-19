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

//FUNCTION TO CALL IF ANY AXIOS CALLS RECEIVE A 401 (unauthorized) ERROR
// function unAuthRedirect() {
//   location.href = serverState + "/login";
// }
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
  async deleteConnection(memberID, userID) {
    let myroute = servername + "/deleteConnection";
    const params = {
      memberID: memberID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getPrimaryCircle(userID) {
    let myroute = servername + "/getprimarycircle";
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

  async getCircleMembersAll(circleID) {
    let myroute = servername + "/getcirclemembersall";
    const params = {
      circleID: circleID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async searchMembers(email) {
    let myroute = servername + "/searchmembers";
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

  async searchToAddToEveryone(userID, firstname, lastname, email, searchby) {
    let myroute = "";
    let params = [];
    if (searchby === "emailSearch") {
      myroute = servername + "/searchToAddToEveryoneEmail";
      params = {
        userID: userID,
        searchTerm: email,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (searchby === "nameSearch") {
      myroute = servername + "/searchToAddToEveryoneName";
      params = {
        userID: userID,
        searchTermFirst: firstname,
        searchTermLast: lastname,
        token: token,
        reauthToken: reauthToken,
      };
    }
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async addToEveryoneEmail(userID, selected) {
    let myroute = servername + "/addToEveryone2";
    const params = {
      selected: selected,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  //User's open invitations
  async myOpenInvitations(userID) {
    let myroute = servername + "/myopeninvitations";
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

  //User's sent and received open invitations
  async getOpenInvitations(userID) {
    let myroute = servername + "/getopeninvitations";
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

  //User's sent and recieved open invitations
  async unacceptedInvitations(userID) {
    let myroute = servername + "/unacceptedinvitations";
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

  //User's combined sent invitations
  async mySentInvitations(userID) {
    let myroute = servername + "/mysentinvitations";
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

  //Accept a connection request from another member
  async acceptInvitation(circleMemID, userID) {
    let myroute = servername + "/acceptinvitation";
    const params = {
      circleMemID: circleMemID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async declineInvitation(circleMemID, userID) {
    let myroute = servername + "/declineinvitation";
    const params = {
      userID: userID,
      circleMemID: circleMemID,
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
