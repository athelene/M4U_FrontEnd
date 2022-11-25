<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="text-accent">
        <img src="/favicon-32x32.png" @click="resetPage()" />
        <q-separator></q-separator>
        <q-toolbar-title @click="resetPage()">
          Memories For Us
        </q-toolbar-title>
        <q-btn
          v-if="isLoggedIn"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleRightDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-footer elevated>
      <q-toolbar>
        Memories For Us, Copyright 2022
        <q-space></q-space>
        <q-btn
          label="Get 30 days Free!"
          flat
          icon="mdi-currency-usd"
          @click="goToPage('/daysfree')"
        ></q-btn>
        <q-space></q-space>
        <q-btn
          label="Invite a Friend"
          flat
          icon="mdi-account-plus-outline"
          @click="goToPage('/invite')"
        ></q-btn>
      </q-toolbar>
    </q-footer>
    <q-drawer v-if="isLoggedIn" v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <q-list>
        <q-item clickable v-ripple @click="rightDrawerOpen = false">
          <q-item-section>
            <q-icon name="mdi-close" class="text-weight-bolder q-ml-sm" />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/home')">
          <q-item-section> Home </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/profile')">
          <q-item-section> Profile </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/share')">
          <q-item-section> Share Groups </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/types')">
          <q-item-section> Email Us </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/types')">
          <q-item-section> Report a Problem</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/types')">
          <q-item-section> Terms of Service</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/types')">
          <q-item-section> Admin </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/types')">
          <q-item-section> Credits </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="logout()">
          <q-item-section> Logout </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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
    const rightDrawerOpen = ref(false);
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
      rightDrawerOpen,
      goToPage,
      resetPage,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
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
