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
  servername = "https://memoriesforusbe.azurewebsites.net";
}

export default {
  //used to get the user's books that do not already contain a specific story
  async getBooksToAddStory(userID, storyID) {
    console.log("ES sees book info as: ", userID, storyID);
    let myroute = servername + "/getbookstoaddtostory";
    const params = {
      userID: userID,
      storyID: storyID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async addToBooks(bookID, storyID) {
    console.log("ES addToBooks receives: ", bookID, storyID);
    let myroute = servername + "/addtobooks";
    const params = {
      bookID: bookID,
      storyID: storyID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async removeFromBooks(bookID, storyID) {
    let myroute = servername + "/removefrombooks";
    const params = {
      bookID: bookID,
      storyID: storyID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getAllBooks(userID) {
    let myroute = servername + "/getallbooks";
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

  async getAllMyBooks(userID) {
    let myroute = servername + "/getallmybooks";
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

  async getTimeCapsules(userID) {
    let myroute = servername + "/getTimeCapsules";
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

  async getBookContent(userID, bookID) {
    let myroute = servername + "/getbookcontent";
    const params = {
      userID: userID,
      bookID: bookID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getMyBooks(userID) {
    let myroute = servername + "/getmybooks";
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

  async newBook(userID, bookTitle, tcDate, circleID, coverColor, coverFont) {
    let myroute = servername + "/newbook";
    const params = {
      userID: userID,
      bookTitle: bookTitle,
      tcDate: tcDate,
      circleID: circleID,
      coverColor: coverColor,
      coverFont: coverFont,

      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async editBook(
    userID,
    bookID,
    bookTitle,
    tcDate,
    circleID,
    coverColor,
    coverFont
  ) {
    console.log("starting bookactions.editbook");
    let myroute = servername + "/editbook";
    const params = {
      userID: userID,
      bookID: bookID,
      bookTitle: bookTitle,
      tcDate: tcDate,
      circleID: circleID,
      coverColor: coverColor,
      coverFont: coverFont,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async getBookDetails(bookID) {
    let myroute = servername + "/getbookdetails";
    console.log("event page sees: ", bookID);
    const params = {
      bookID: bookID,
      token: token,
      reauthToken: reauthToken,
    };
    var result = this.callApi(myroute, params).then((res) => {
      return res;
    });
    return result;
  },

  async deleteBook(bookID, userID) {
    let myroute = servername + "/deleteBook";
    const params = {
      bookID: bookID,
      userID: userID,
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
