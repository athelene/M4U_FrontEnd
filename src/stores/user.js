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
      if (loginReturn.UserID > 0) {
        this.isLoggedIn = true;
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
