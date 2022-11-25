import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {},
      token: "",
      isLoggedIn: false,
      pageLength: 5,
      filter: "all",
    };
  },
  persist: true,

  actions: {
    userLogin(loginReturn) {
      this.user = loginReturn;
      console.log("in user.js, loginReturn.UserID is: ", loginReturn.UserID);
      if (loginReturn.UserID > 0) {
        this.isLoggedIn = true;
        console.log("user.js isLogged in is: ", this.isLoggedIn);
      }
    },
    userToken(loginToken) {
      this.token = loginToken;
    },

    setFilter(filter) {
      this.filter = filter;
    },

    userLogout() {
      this.user = false;
      this.token = "";
      this.isLoggedIn = false;
    },
  },
});
