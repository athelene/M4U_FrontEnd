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
  // servername = "https://login.memoriesforus.com";
  servername = "https://memoriesforusbe.azurewebsites.net";
}

export default {
  //GET ANY SYSTEMWIDE MESSAGES
  async getMessage() {
    let myroute = servername + "/getmessage";
    const params = {
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getAllHelp(recordStart, pageLength) {
    let myroute = servername + "/getAllHelp";

    const params = {
      recordStart: recordStart,
      pageLength: pageLength,
      recordCount: 0,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getHelpTypes() {
    let myroute = servername + "/getHelpTypes";

    const params = {
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res.recordset;
    });
    return result;
  },

  async getTypeHelp(recordStart, pageLength, helpTypeID) {
    let myroute = servername + "/gettypehelp";
    const params = {
      recordStart: recordStart,
      pageLength: pageLength,
      recordCount: 0,
      helpTypeID: helpTypeID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async searchHelp(userID, recordStart, pageLength, searchTerm) {
    let myroute = servername + "/searchHelp";
    const params = {
      userID: userID,
      recordStart: recordStart,
      pageLength: pageLength,
      recordCount: 0,
      searchTerm: searchTerm,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async newHelp(userID, storyData, circleID) {
    var params = {};
    let myroute = servername + "/addmemory";
    if (storyData.Hidden === true) {
      var hidden = 1;
    } else {
      var hidden = 0;
    }

    if (storyData.StoryTypeID === 1) {
      params = {
        userID: userID,
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: storyData.StoryTypeID,
        CircleID: circleID,
        Hidden: hidden,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 2) {
      params = {
        userID: userID,
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: storyData.StoryTypeID,
        Interviewee: storyData.Interviewee,
        Hidden: hidden,
        CircleID: circleID,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 3) {
      params = {
        userID: userID,
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: storyData.StoryTypeID,
        StoryIngredients: storyData.StoryIngredients,
        Hidden: hidden,
        CircleID: circleID,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 4) {
      params = {
        userID: userID,
        StoryTitle: storyData.StoryTitle.trim,
        StoryText: storyData.StoryText.trim,
        StoryTypeID: storyData.StoryTypeID,
        StoryIngredients: storyData.StoryIngredients.trim,
        Interviewee: storyData.Interviewee.trim,
        Hidden: hidden,
        CircleID: circleID,
        token: token,
        reauthToken: reauthToken,
      };
    }

    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async updateHelp(storyData, newCircle, setType) {
    let myroute = servername + "/updatememory";
    if (storyData.Hidden === true) {
      var hidden = 1;
    } else {
      var hidden = 0;
    }
    var params = {};
    if (storyData.StoryTypeID === 1) {
      params = {
        StoryID: Number(storyData.StoryID),
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: Number(setType),
        Hidden: hidden,
        CircleID: newCircle,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 2) {
      params = {
        StoryID: Number(storyData.StoryID),
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: Number(storyData.StoryTypeID),
        Interviewee: storyData.Interviewee,
        Hidden: hidden,
        CircleID: newCircle,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 3) {
      params = {
        StoryID: Number(storyData.StoryID),
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: Number(storyData.StoryTypeID),
        StoryIngredients: storyData.StoryIngredients,
        Hidden: hidden,
        CircleID: newCircle,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 4) {
      params = {
        StoryID: Number(storyData.StoryID),
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: Number(storyData.StoryTypeID),
        StoryIngredients: storyData.StoryIngredients,
        Interviewee: storyData.Interviewee,
        Hidden: hidden,
        CircleID: newCircle,
        token: token,
        reauthToken: reauthToken,
      };
    }
    var result = this.postApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteHelp(storyID) {
    let myroute = servername + "/deletehelp";
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

  // async callApi(myroute, params) {
  //   try {
  //     let res = await axios.get(myroute, { params });
  //     return res.data;
  //   } catch (error) {
  //     if (error.response.status === 401) {
  //       unAuthRedirect();
  //     }
  //     console.log("send the user to the login page", error);
  //   }
  // },

  // async postApi(myroute, params) {
  //   try {
  //     let res = await axios.post(
  //       myroute,
  //       { params },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     return res.data;
  //   } catch (error) {
  //     if (error.response.status === 401) {
  //       //  unAuthRedirect();
  //       console.log("error is: ", error.response);
  //     }
  //     console.log("send the user to the login page", error);
  //   }
  // },

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

      return res.data;
    } catch (error) {
      if (error.response.status === 401) {
        unAuthRedirect();
      }
    }
  },
};
