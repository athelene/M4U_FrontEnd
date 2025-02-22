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
let adminID = 310;

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
  adminID = 126;
} else {
  // servername = "https://login.memoriesforus.com";
  servername = "https://memoriesforusbe.azurewebsites.net";
  adminID = 310;
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

  async getDrafts(userID, recordStart, pageLength) {
    let myroute = servername + "/mydrafts";
    const params = {
      userID: userID,
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

  async getMyJournal(userID, recordStart, pageLength) {
    let myroute = servername + "/myjournal";
    const params = {
      userID: userID,
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

  async getAllStories(userID, recordStart, pageLength) {
    let myroute = servername + "/allstories";

    const params = {
      userID: userID,
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

  async getMyStories(userID, recordStart, pageLength) {
    let myroute = servername + "/mystories";
    const params = {
      userID: userID,
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

  async getGroupMemories(userID, recordStart, pageLength, circleID) {
    let myroute = servername + "/getgroupmemories";
    const params = {
      userID: userID,
      recordStart: recordStart,
      pageLength: pageLength,
      recordCount: 0,
      circleID: circleID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async searchMemories(userID, recordStart, pageLength, searchTerm) {
    let myroute = servername + "/searchMemories";
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

  async getHeartStatus(storyID, userID) {
    let myroute = servername + "/getHeartStatus";
    const params = {
      storyID: storyID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async addHeartStatus(storyID, userID) {
    let myroute = servername + "/addHeartStatus";
    const params = {
      storyID: storyID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async removeHeartStatus(storyID, userID) {
    let myroute = servername + "/removeHeartStatus";
    const params = {
      storyID: storyID,
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getCommentTotal(storyID) {
    let myroute = servername + "/getcommenttotal";
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

  async addComment(storyID, userID, commentText) {
    let myroute = servername + "/addcomment";
    const params = {
      storyID: storyID,
      userID: userID,
      commentText: commentText,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getComments(storyID) {
    let myroute = servername + "/getcomments";
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

  async deleteComment(commentID) {
    let myroute = servername + "/deletecomment";
    const params = {
      commentID: commentID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getMyCircles(userID) {
    let myroute = servername + "/getmycircles";
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

  async newMemory(userID, storyData, circleID) {
    var params = {};
    let myroute = servername + "/addmemory";

    if (storyData.Hidden === true) {
      var hidden = 1;
    } else {
      var hidden = 0;
    }

    if (storyData.StoryTypeID === 1) {
      //This is a simple memory
      params = {
        userID: userID,
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTitle: null,
        StoryText: null,
        StoryTypeID: storyData.StoryTypeID,
        CircleID: circleID,
        Hidden: hidden,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 2) {
      //This is an interview
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
      //This is a recipe
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
      //This is a tradition
      params = {
        userID: userID,
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: storyData.StoryTypeID,
        StoryIngredients: storyData.StoryIngredients,
        Interviewee: storyData.Interviewee,
        Hidden: hidden,
        CircleID: circleID,
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 5) {
      //This is a Help Memory for localhost and makes owner an admin
      params = {
        userID: 310,
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: storyData.StoryTypeID,
        StoryIngredients: storyData.StoryIngredients,
        Interviewee: storyData.Interviewee,
        Hidden: hidden,
        HelpType: storyData.HelpType,
        CircleID: 0,
        UserMediaLoc: "Logo.png",
        token: token,
        reauthToken: reauthToken,
      };
    }

    // if (storyData.StoryTypeID === 5 && servername !== "http://localhost:9000") {
    //   params = {
    //     userID: 126,
    //     StoryTitle: storyData.StoryTitle,
    //     StoryText: storyData.StoryText,
    //     StoryTypeID: storyData.StoryTypeID,
    //     StoryIngredients: storyData.StoryIngredients,
    //     Interviewee: storyData.Interviewee,
    //     Hidden: hidden,
    //     HelpType: storyData.HelpType,
    //     CircleID: 0,
    //     UserMediaLoc: "Logo.png",
    //     token: token,
    //     reauthToken: reauthToken,
    //   };
    // }
    var result = this.postApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async updateMemory(storyData, newCircle, setType) {
    let myroute = servername + "/updatememory";
    if (storyData.Hidden === true) {
      var hidden = Number(1);
    } else {
      var hidden = Number(0);
    }
    var params = {};
    if (storyData.StoryTypeID === 1) {
      params = {
        StoryID: Number(storyData.StoryID),
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: Number(setType),
        HelpTypeID: Number(0),
        //       Hidden: Number(hidden),
        CircleID: Number(newCircle),
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
        //       Hidden: Number(hidden),
        CircleID: Number(newCircle),
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
        //      Hidden: Number(hidden),
        CircleID: Number(newCircle),
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
        //      Hidden: Number(hidden),
        CircleID: Number(newCircle),
        token: token,
        reauthToken: reauthToken,
      };
    }

    if (storyData.StoryTypeID === 5) {
      params = {
        StoryID: Number(storyData.StoryID),
        StoryTitle: storyData.StoryTitle,
        StoryText: storyData.StoryText,
        StoryTypeID: Number(setType),
        //      Hidden: Number(hidden),
        CircleID: Number(newCircle),
        HelpTypeID: Number(storyData.HelpTypeID),
        token: token,
        reauthToken: reauthToken,
      };
    }

    var result = this.postApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteMemory(storyID) {
    let myroute = servername + "/deletememory";
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

  async getTraditions() {
    let myroute = servername + "/gettraditions";

    const params = {
      token: token,
      reauthToken: reauthToken,
    };

    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getInterviews() {
    let myroute = servername + "/getinterviews";
    const params = {
      token: token,
      reauthToken: reauthToken,
    };

    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getHelpTypes() {
    let myroute = servername + "/gethelptypes";
    const params = {
      token: token,
      reauthToken: reauthToken,
    };

    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async saveInterviewSuggestion(userID, interviewSuggestion) {
    let myroute = servername + "/saveInterviewSuggestion";
    const params = {
      userID: userID,
      interviewSuggestion: interviewSuggestion,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getMemoryTemplates(userID, templateType) {
    let myroute = servername + "/getTemplates";
    const params = {
      userID: userID,
      typeID: templateType,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async saveTemplate(
    userID,
    templateType,
    templateName,
    templateText,
    templateIngredients,
    templateCircle
  ) {
    var circleID = "";
    let myroute = servername + "/saveTemplate";

    if (templateCircle) {
      circleID = templateCircle;
    }
    const params = {
      userID: userID,
      typeID: templateType,
      templateName: templateName,
      templateText: templateText,
      templateIngredients: templateIngredients,
      templateCircle: circleID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteTemplate(templateID) {
    let myroute = servername + "/deleteTemplate";
    const params = {
      templateID: templateID,
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
      console.log("error is: ", error);
      if (error.response.status === 401) {
        unAuthRedirect();
      }
    }
  },
};
