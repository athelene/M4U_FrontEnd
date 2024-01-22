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
  // servername = "https://login.memoriesforus.com";
  servername = "https://memoriesforusbe.azurewebsites.net";
}

export default {
  async getLists(userID) {
    let myroute = servername + "/getlists";
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

  async getListContent(userID, bookID) {
    let myroute = servername + "/getlistcontent";
    const params = {
      userID: userID,
      listID: listID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async newList(
    userID,
    listName,
    listDate,
    listCircle,
    listColor,
    listCircleRights
  ) {
    let myroute = servername + "/newlist";
    const params = {
      userID: userID,
      listName: listName,
      listDate: listDate,
      listCircle: listCircle,
      listColor: listColor,
      listCircleRights: listCircleRights,

      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async editList(
    userID,
    listID,
    listName,
    listDate,
    circleID,
    listCircleRights,
    listColor
  ) {
    let myroute = servername + "/editlist";
    const params = {
      userID: userID,
      listID: listID,
      listName: listName,
      listDate: listDate,
      circleID: circleID,
      listCircleRights,
      listCircleRights,
      listColor: listColor,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getListDetails(listID) {
    let myroute = servername + "/getlistdetails";
    const params = {
      listID: listID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  // async deleteList(listID, userID) {
  //   let myroute = servername + "/deletelist";
  //   const params = {
  //     listID: listID,
  //     userID: userID,
  //     token: token,
  //     reauthToken: reauthToken,
  //   };
  //   var result = this.callApi(myroute, params).then((res) => {
  //     return res;
  //   });
  //   return result;
  // },

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
