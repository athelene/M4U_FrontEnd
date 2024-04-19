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
    listCircleRights,
    listAssigned
  ) {
    let myroute = servername + "/newlist";
    const params = {
      userID: userID,
      listName: listName,
      listDate: listDate,
      listCircle: listCircle,
      listColor: listColor,
      listCircleRights: listCircleRights,
      listAssigned: listAssigned,

      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async newItem(itemName, dueDate, assignedTo, notes, listID) {
    let myroute = servername + "/newitem";
    const params = {
      itemName: itemName,
      dueDate: dueDate,
      assignedTo: assignedTo,
      notes: notes,
      listID: listID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async editItem(itemName, dueDate, assignedTo, notes, listID, itemID) {
    console.log(
      "sending: ",
      itemName,
      dueDate,
      assignedTo,
      notes,
      listID,
      itemID
    );
    let myroute = servername + "/edititem";
    const params = {
      itemName: itemName,
      dueDate: dueDate,
      assignedTo: assignedTo,
      notes: notes,
      listID: listID,
      itemID: itemID,
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
    listColor,
    listAssigned
  ) {
    let myroute = servername + "/editlist";

    const params = {
      userID: userID,
      listID: listID,
      listName: listName,
      listDate: listDate,
      circleID: circleID,
      listCircleRights: listCircleRights,
      listColor: listColor,
      listAssigned: listAssigned,
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
      return res[0];
    });
    return result;
  },

  async deleteList(listID, userID) {
    let myroute = servername + "/deletelist";
    const params = {
      listID: listID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteCompletedItems(listID) {
    let myroute = servername + "/deletecompleteditems";
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

  async getListItems(listID) {
    let myroute = servername + "/getlistitems";
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

  async markItemOpen(itemID, userID) {
    let myroute = servername + "/markItemOpen";

    const params = {
      userID: userID,
      itemID: itemID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async markItemDone(itemID, userID) {
    let myroute = servername + "/markItemDone";

    const params = {
      userID: userID,
      itemID: itemID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteItem(itemID) {
    let myroute = servername + "/deletelistitem";
    const params = {
      itemID: itemID,
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
