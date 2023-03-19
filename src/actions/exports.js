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
  async getExportDate(userID) {
    let myroute = servername + "/getExportDate";
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

  async getExport(userID) {
    let myroute = servername + "/exportMemories";
    const params = {
      userID: userID,
      token: token,
      reauthToken: reauthToken,
    };

    try {
      let res = await axios.get(myroute, { params }).then((response) => {
        console.log("response from api is: ", response.data);
        return response.data;
      });
      return res;
    } catch {
      if (error.response.status === 401) {
        unAuthRedirect();
      }
      console.log("send the user to the login page", error);
    }
  },

  async getExportHtml(userID) {
    const params = {
      token: token,
      reauthToken: reauthToken,
    };
    let myroute = servername + "/downloadHtml";
    console.log("about to download blob");
    await axios({
      url: myroute,
      method: "GET",
      responseType: "blob",
      params: {
        userID: userID,
      },
    }).then((response) => {
      console.log("blob response is: ", response);
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      var fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", "memories.html");
      document.body.appendChild(fileLink);

      fileLink.click();
    });
  },

  async getExportZip(userID) {
    console.log("action page receives userID as ", userID);
    const params = {
      token: token,
      reauthToken: reauthToken,
    };
    let myroute = servername + "/downloadZip";
    console.log("about to download blob, myroute is: ", myroute);

    await axios({
      url: myroute,
      method: "GET",
      // responseType: "blob",

      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/zip",
      },
      params: {
        userID: userID,
      },
    })
      .then((response) => {
        console.log(response.data);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "media.zip");
        document.body.appendChild(link);
        link.click();
      })
      .then(() => {
        console.log("about to return to exportpage");
        return 1;
      });
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

  async postApi(myroute, params) {
    try {
      let res = await axios.post(
        myroute,
        { params },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (error) {
      if (error.response.status === 401) {
        //  unAuthRedirect();
        console.log("error is: ", error.response);
      }
      console.log("send the user to the login page", error);
    }
  },
};
