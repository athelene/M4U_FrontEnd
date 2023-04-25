<template>
  <q-layout view="hHh lpR fFf">
    <!--BEGINNING OF HEADER-->
    <q-header elevated>
      <q-toolbar class="text-accent">
        <img src="/favicon-32x32.png" @click="resetPage()" />
        <q-separator></q-separator>
        <q-toolbar-title @click="resetPage()">
          Memories For Us
        </q-toolbar-title>
        <q-separator></q-separator>
        <q-btn
          v-if="
            invitationCount !== 0 &&
            invitationCount !== null &&
            isLoggedIn === true
          "
          to="/connections"
          icon="mdi-link-variant"
          round
          class="q-mr-lg"
        >
          <q-badge color="negative" floating transparent>
            {{ invitationCount }}
          </q-badge>
        </q-btn>
        <q-avatar rounded v-if="isLoggedIn && user.UserMediaLoc">
          <img :src="profileSas" />
        </q-avatar>
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
    <!--END OF HEADER-->

    <!--BEGINNING OF MENU DRAWER-->
    <q-drawer
      v-if="isLoggedIn"
      v-model="rightDrawerOpen"
      side="right"
      bordered
      overlay
    >
      <!-- drawer content -->
      <q-list>
        <q-item>
          <span class="q-ml-sm">
            <q-avatar rounded v-if="user.UserMediaLoc">
              <img :src="profileSas" />
            </q-avatar>
            {{ user.UserDisplayName }}
          </span>
        </q-item>
        <q-item clickable v-ripple @click="rightDrawerOpen = false">
          <q-item-section>
            <q-icon name="mdi-close" class="text-weight-bolder q-ml-sm" />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/home')">
          <q-item-section> Home </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/profile')">
          <q-item-section> Account </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/connections')">
          <q-item-section> My Connections </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/share')">
          <q-item-section> Share Groups </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/quickconnect')">
          <q-item-section> Quick Connect Questions</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="goToPage('/suggestqc')">
          <q-item-section> Suggest A Quick Connect Question </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/suggestinterview')">
          <q-item-section> Suggest an Interview Question </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="goToPage('/import')">
          <q-item-section> Bulk Import Photos </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="moreBtn = !moreBtn">
          <q-item-section>
            <q-icon
              name="mdi-arrow-collapse-down"
              class="q-ml-md"
              v-if="!moreBtn"
              >More
            </q-icon>
            <q-icon name="mdi-arrow-collapse-up" class="q-ml-md" v-if="moreBtn"
              >Less
            </q-icon>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="goToPage('/contact')"
          v-if="moreBtn"
          class="q-ml-lg"
        >
          <q-item-section> Contact Us </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="goToPage('/tos')"
          v-if="moreBtn"
          class="q-ml-lg"
        >
          <q-item-section> Terms of Service/Privacy Policy</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="goToPage('/credits')"
          v-if="moreBtn && user.AdminLevel === 100"
          class="q-ml-lg"
        >
          <q-item-section> Credits </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="goToPage('/export')"
          v-if="moreBtn"
          class="q-ml-lg"
        >
          <q-item-section> Export Data </q-item-section>
        </q-item>
        <q-item
          v-if="user.AdminLevel === 100"
          clickable
          v-ripple
          @click="goToPage('/admin')"
        >
          <q-item-section> Admin </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="logout()">
          <q-item-section> Logout </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <!--END OF MENU DRAWER-->

    <q-page-container>
      <q-list bordered separator>
        <q-item v-for="msg in incomingMessages" :key="msg.MessageID">
          <q-item-section>
            <q-item-label>
              <span class="text-h6"
                >{{ msg.MessageHeader }}:
              </span></q-item-label
            >{{ msg.MessageText }}
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat @click="cancelMessage(msg.MessageID)">
              <q-icon name="mdi-close"></q-icon>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
      <router-view />
    </q-page-container>
    <!--BEGINNING OF FOOTER-->
    <q-footer elevated>
      <q-toolbar>
        Memories For Us, Copyright 2023
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
    <!--END OF FOOTER-->
  </q-layout>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  computed,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import connectionActions from "../actions/connections";
import publicPages from "../router/openRoutes";
import mediaActions from "../actions/blobs"; //
import adminActions from "../actions/admin";

export default defineComponent({
  name: "MainLayout",

  components: {},

  setup() {
    const route = useRoute();
    const path = computed(() => route.path);
    const userState = useUserStore();
    const { user, isLoggedIn, token } = storeToRefs(userState);
    const router = useRouter();

    const incomingMessages = reactive([]);
    const invitationCount = ref(null);
    const moreBtn = ref(false);
    const profileSas = ref(null);
    const rightDrawerOpen = ref(false);

    function goToPage(page) {
      rightDrawerOpen.value = false;
      router.push(page);
    }

    onMounted(() => {
      if (isLoggedIn.value === true) {
        getMessages();
      }
      const publicCheck = !publicPages.includes(route.name);

      if (publicCheck === true && isLoggedIn.value === true) {
        invitations();
      } else {
        invitationCount.value = null;
      }
      if (publicCheck === true && isLoggedIn.value === true) {
        getSasKey();
      } else {
        invitationCount.value = null;
      }
    });

    // You can watch the property for triggering some other action on change
    watch(
      () => route.name,
      () => {
        const publicCheck = !publicPages.includes(route.name);
        if (publicCheck === true) {
          invitations();
        } else {
          invitationCount.value = null;
        }
        if (publicCheck === true) {
          getSasKey();
        } else {
          invitationCount.value = null;
        }
      }
    );

    const getMessages = async () => {
      incomingMessages.splice(0, incomingMessages.length);
      await adminActions.getMessage(userState.user.UserID).then((result) => {
        Object.assign(incomingMessages, result);
      });
    };

    const cancelMessage = async (messageID) => {
      await adminActions
        .cancelMessage(userState.user.UserID, messageID)
        .then(() => {
          getMessages();
        });
    };

    const getSasKey = async () => {
      await mediaActions
        .getSasKey(userState.user.UserMediaLoc)
        .then((incomingSas) => {
          profileSas.value = incomingSas;
        });
    };

    const resetPage = () => {
      if (isLoggedIn.value === true) {
        if (path.value === "/home") {
          window.location.reload();
        } else {
          router.push({ path: "/home" });
        }
      } else {
        router.push({ path: "/" });
      }

      //  window.location.reload();
    };

    function logout() {
      rightDrawerOpen.value = false;
      userState.userLogout();
      isLoggedIn.value = false;
      user.value = null;
      token.value = null;
      console.log("environment is: ", process.env.DEV);
      if (process.env.DEV === true) {
        window.location.replace("http://localhost:9000");
      } else {
        window.location.replace("https://www.memoriesforus.com/");
      }
    }

    const invitations = async () => {
      if (route.path === "/") {
        return;
      } else {
        await connectionActions
          .unacceptedInvitations(userState.user.UserID)
          .then((open) => {
            invitationCount.value = open.length;
          });
      }
    };

    return {
      goToPage,
      cancelMessage,
      incomingMessages,
      invitationCount,
      invitations,
      isLoggedIn,
      logout,
      moreBtn,
      profileSas,
      resetPage,
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
      token,
      user,
    };
  },
});
</script>
<style>
body {
  color: #160159;
}
.bg-image {
  background-image: url(../../public/m4u_background2.jpg);
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
