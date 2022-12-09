<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="text-accent">
        <img src="/favicon-32x32.png" @click="resetPage()" />
        <q-separator></q-separator>
        <q-toolbar-title @click="resetPage()">
          Memories For Us
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer elevated>
      <q-toolbar>
        Memories For Us, Copyright 2023
        <q-space></q-space>
      </q-toolbar>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const userState = useUserStore();
    const { user, isLoggedIn, token } = storeToRefs(userState);
    const router = useRouter();
    function goToPage(page) {
      router.push(page);
    }
    const goToTop = () => {
      window.scrollTo(0, 0);
    };

    const resetPage = () => {
      console.log(router);
      //  window.location.reload();
    };

    function logout() {
      userState.userLogout();
      router.push({ path: "/" });
    }

    return {
      user,
      token,
      isLoggedIn,
      logout,
      goToPage,
      resetPage,
    };
  },
});
</script>
<style>
body {
  color: #160159;
}
.bg-image {
  background-image: url(../../public/background.jpg);
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
