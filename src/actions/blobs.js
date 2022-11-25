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
  //GET SASKEY FROM AZURE
  async getSasKey(mediaLoc) {
    let myroute = servername + "/getSASKey";
    const params = {
      mediaLoc: mediaLoc,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getMedia(storyID) {
    let myroute = servername + "/getMedia";
    const params = {
      storyID: storyID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getNewMedia(userID) {
    let myroute = servername + "/getnewmedia";
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

  async clearNew(userID) {
    let myroute = servername + "/clearNewMedia";
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

  async addNewBlob(formData) {
    let myroute = servername + "/addNewBlob";
    let res = await axios.post(myroute, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  },

  async addNewProfileBlob(formData) {
    let myroute = servername + "/addNewProfileBlob";
    let profileReturn = await axios.post(myroute, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    //     .then((profileSas) => {
    // console.log(
    //   "eventservice addnewProfileblob then, profileSas.data is: ",
    //   profileSas.data
    // );
    //        return profileSas.data;
    //      });
    return profileReturn;
  },

  async deleteMedia(mediaLoc) {
    let myroute = servername + "/deletemedia";
    const params = {
      mediaLoc: mediaLoc,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async makeFeature(mediaLoc) {
    let myroute = servername + "/makeFeature";
    const params = {
      mediaLoc: mediaLoc,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  //USED TO CALL EVERY API IN THIS FILE
  async callApi(myroute, params) {
    try {
      let res = await axios.get(myroute, { params });
      //     console.log("memories.js route and res.data is: ", myroute, res.data);
      return res.data;
    } catch (error) {
      if (error.response.status === 401) {
        unAuthRedirect();
      }
      console.log("send the user to the login page", error);
    }
  },
};
