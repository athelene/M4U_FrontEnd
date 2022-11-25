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
  async addGroup(groupName) {
    let myroute = servername + "/newcircle";
    const params = {
      circleName: groupName,
      userID: userState.user.UserID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getGroups(userID) {
    let myroute = servername + "/getmycircles";
    console.log("userID to getGroups is: ", userID);
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

  async editGroup(circleID, circleName) {
    let myroute = servername + "/updatecircle";
    const params = {
      circleID: circleID,
      circleName: circleName,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteGroup(circleID, userID) {
    let myroute = servername + "/deletecircle";
    const params = {
      circleID: circleID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getEveryonePickList(circleID, userID) {
    let myroute = servername + "/getcirclepicklist";
    const params = {
      circleID: circleID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async addCircleMember(memberID, circleID, userID) {
    let myroute = servername + "/addcirclemember";
    const params = {
      memberID: memberID,
      circleID: circleID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteCircleMember(memberID, circleID) {
    let myroute = servername + "/deletecirclemember";
    const params = {
      memberID: memberID,
      circleID: circleID,
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
