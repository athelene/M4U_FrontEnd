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
 servername = process.env.VUE_APP_SERVERNAME;
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

  //User's sent and recieved open invitations
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
    console.log("circleMemID, UserID: ", circleMemID, userID);
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
