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

//FUNCTION TO CALL IF ANY CALLS RECEIVE A 401 (unauthorized) ERROR
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
  // QuickConnect stuff
  async getTodaysQuickConnect(today) {
    let myroute = servername + "/todaysqc";
    const params = {
      today: today,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getMyQCAnswerToday(userID, today) {
    let myroute = servername + "/getmyqcanswertoday";
    const params = {
      userID: userID,
      today: today,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async saveMyAnswer(qcID, myanswer, userID) {
    let myroute = servername + "/savemyanswer";
    const params = {
      userID: userID,
      qcID: qcID,
      myanswer: myanswer,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async updateMyAnswer(qcID, myanswer, userID) {
    let myroute = servername + "/updatemyanswer";
    const params = {
      userID: userID,
      qcID: qcID,
      myanswer: myanswer,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getCircleAnswersToday(userID, today) {
    let myroute = servername + "/getcircleanswerstoday";
    const params = {
      userID: userID,
      today: today,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getQuestions(startDate, retrieveBlock) {
    //gets quick connect questions from the starting date forward (e.g. sorted desc)
    //retrieves the number of questions determined from the calling page
    let myroute = servername + "/getquestions";
    const params = {
      startDate: startDate,
      retrieveBlock: retrieveBlock,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getQuestionChunk(startRecord, maxPages) {
    let myroute = servername + "/getquestionchunk";
    const params = {
      startRecord: startRecord,
      retrieveBlock: maxPages,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getQuestionCount() {
    let myroute = servername + "/getquestioncount";
    const params = {
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getMyAnswer(userID, viewPointID) {
    let myroute = servername + "/getmyanswer";
    const params = {
      userID: userID,
      viewPointID: viewPointID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getAnswers(userID, viewPointID) {
    let myroute = servername + "/getanswers";
    const params = {
      userID: userID,
      viewPointID: viewPointID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async editMyAnswer(qcID, myanswer, userID) {
    let myroute = servername + "/editthisqcquestion";
    const params = {
      qcID: qcID,
      myanswer: myanswer,
      UserID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async addQuestion(qcDate, qcQuestion, qcUserID) {
    let myroute = servername + "/addquickconnectquestion";
    const params = {
      qcDate: qcDate,
      qcQuestion: qcQuestion,
      qcUserID: qcUserID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async editQuestion(viewPointID, viewPointQuestion, viewPointDate, userID) {
    let myroute = servername + "/editthisqcquestion";
    const params = {
      ViewPointID: viewPointID,
      ViewPointQuestion: viewPointQuestion,
      ViewPointDate: viewPointDate,
      UserID: userID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteQuestion(viewPointID) {
    let myroute = servername + "/deletequickconnectquestion";
    const params = {
      viewPointID: viewPointID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async saveQCSuggestion(userID, qcSuggestion) {
    let myroute = servername + "/saveQCSuggestion";
    const params = {
      userID: userID,
      qcSuggestion: qcSuggestion,
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
