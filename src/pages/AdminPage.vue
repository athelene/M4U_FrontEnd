<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <q-card-section>
        <div class="q-ml-lg">
          <p class="text-h5 text-info">ADMINISTRATION</p>
        </div>
        <div class="text-center relative-center" id="list">
          <q-list bordered separator class="justify-center groupList">
            <q-item class="text-center" clickable v-ripple>
              <q-item-section class="relative-center text-center">
                <q-item-label class="absolute-center">
                  <router-link to="/admininvite">Send Invitation</router-link>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="text-center" clickable v-ripple>
              <q-item-section class="relative-center text-center">
                <q-item-label class="absolute-center">
                  <router-link to="/adminqc"
                    >Manage Quick Connect Questions</router-link
                  >
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              class="text-center"
              clickable
              v-ripple
              @click="messageDialog = true"
            >
              <q-item-section class="relative-center text-center">
                <q-item-label class="absolute-center">
                  Add a system message
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              class="text-center"
              clickable
              v-ripple
              @click="newsDialog = true"
            >
              <q-item-section class="relative-center text-center">
                <q-item-label class="absolute-center"> Add News </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="text-center" clickable v-ripple>
              <q-item-label class="absolute-center">
                <router-link to="/adminusers">Manage Users</router-link>
              </q-item-label>
            </q-item>
            <q-item class="text-center" clickable v-ripple>
              <q-item-label class="absolute-center">
                <router-link to="/manageinvitations"
                  >Manage Admin Invitations</router-link
                >
              </q-item-label>
            </q-item>
            <q-item class="text-center" clickable v-ripple>
              <q-item-section class="relative-center text-center">
                <q-item-label class="absolute-center">
                  <router-link to="/manageinvitations"
                    >Manage Invitations</router-link
                  >
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="text-center" clickable v-ripple>
              <q-item-label class="absolute-center">
                <q-btn @click="cleanUpExports()">Clean Up Exports</q-btn>
              </q-item-label>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-section>
        <!--STATS-->

        <div class="q-ml-lg">
          <p class="text-h5 text-info">Memories For Us Stats</p>
        </div>
        <div class="text-center relative-center" id="list">
          <q-list bordered separator class="justify-center groupList">
            <q-item>
              <q-item-section>Standard Monthly Subscribers</q-item-section>
              <q-item-section>{{ type1 }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section
                >Charter Member 2 (10 free invitations)</q-item-section
              >
              <q-item-section>{{ type2 }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section
                >Charter Member 3 (5 free invitations)</q-item-section
              >
              <q-item-section>{{ type3 }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section
                >Charter Member 4 (No free invitations)</q-item-section
              >
              <q-item-section>{{ type4 }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Unclaimed Charter Members</q-item-section>
              <q-item-section>{{ unclaimedCharters }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section>Admin Users</q-item-section>
              <q-item-section>{{ type6 }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section
                >Total Current Memories For Us Users</q-item-section
              >
              <q-item-section>{{ totalUserCounts }}</q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-info"
                >Total Used and Unused Memories For Us
                Memberships</q-item-section
              >
              <q-item-section class="text-info">{{
                totalPotentialUsers
              }}</q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
    <!--ADD SYSTEM MESSAGE-->
    <q-dialog v-model="messageDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your message</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="messageHeader" autofocus label="Header" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense type="textarea" v-model="message" label="Message" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input filled v-model="startDate" label="Start Date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="startDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input filled v-model="endDate" label="End Date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="endDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="restartMessage()" />
          <q-btn flat label="Add message" @click="addMessage()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!--ADD NEWS ITEM-->

    <q-dialog v-model="newsDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">New News</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="newsTitle" autofocus label="Title" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense type="textarea" v-model="newsText" label="Message" />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input filled v-model="startDate" label="Start Date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="startDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select
            filled
            v-model="selectedSubType"
            :options="userSubTypes"
            label="Subscription Type"
            emit-value
            map-options
            option-value="UserSubTypeID"
            option-label="UserSubType"
          />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="restartNews()" />
          <q-btn flat label="Add News" @click="addNews()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

import { ref, onMounted, computed } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import adminActions from "../actions/admin";
import exportActions from "../actions/exports";

export default defineComponent({
  name: "SharePage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const router = useRouter();

    const startDate = ref(null);
    const endDate = ref(null);
    const message = ref(null);
    const messageHeader = ref(null);
    const incomingMessages = reactive([]);

    const messageDialog = ref(false);
    const newsDialog = ref(false);
    const newsTitle = ref(null);
    const newsText = ref(null);
    const type1 = ref(null);
    const type2 = ref(null);
    const type3 = ref(null);
    const type4 = ref(null);
    const type6 = ref(null);
    const totalUserCounts = ref(null);
    const openInvitations = ref(null);
    const potential3 = ref(null);
    const potential4 = ref(null);
    const totalPotentialCharters = ref(null);
    const unUsedInvitations = ref(null);
    const usedInvitations = ref(null);
    const totalCurrentUsers = ref(null);
    const selectedSubType = ref(null);
    const sentInvitations = ref(null);
    const unclaimedCharters = ref(null);
    const totalPotentialUsers = ref(null);
    const userList = ref(null);
    const userSubTypes = ref(null);

    onMounted(() => {
      if (Number(userState.user.AdminLevel) !== 100) {
        router.push({ name: "home" });
      }
      getUserCountsSubType();
      getUserSubTypes();
    });

    const addMessage = async () => {
      messageDialog.value = false;
      await adminActions
        .addMessage(
          userState.user.UserID,
          message.value,
          startDate.value,
          endDate.value,
          messageHeader.value
        )
        .then(() => {
          window.location.reload();
        });
    };

    const restartMessage = async () => {
      newsTitle.value = null;
      newsText.value = null;
      startDate.value = null;
      selectedSubType.value = null;
      newsDialog.value = false;
    };

    const getUserSubTypes = async () => {
      await adminActions.getUserSubTypes().then((subTypes) => {
        userSubTypes.value = subTypes;
      });
    };

    const restartNews = async () => {
      newsText.value = null;
      newsTitle.value = null;
      startDate.value = null;
      endDate.value = null;
      newsDialog.value = false;
    };

    const addNews = async () => {
      newsDialog.value = false;
      await adminActions
        .addNews(
          newsTitle.value,
          newsText.value,
          startDate.value,
          selectedSubType.value
        )
        .then(() => {
          window.location.reload();
        });
    };

    const getUserCountsSubType = async () => {
      await adminActions
        .getUserCountsSubType()
        .then((userCounts) => {
          for (var i = 0; i < userCounts.length; i++) {
            var type = userCounts[i];
            if (type.UserSubType === 1) {
              type1.value = type.userCount;
            }
            if (type.UserSubType === 2) {
              type2.value = type.userCount;
            }
            if (type.UserSubType === 3) {
              type3.value = type.userCount;
            }
            if (type.UserSubType === 4) {
              type4.value = type.userCount;
            }
            if (type.UserSubType === 6) {
              type6.value = type.userCount;
            }
          }
          totalUserCounts.value =
            type1.value + type2.value + type3.value + type4.value + type6.value;
        })
        .then(() => {
          charterInvitationsCount();
        })
        .then(() => {
          calcUsers();
        });
    };

    const charterInvitationsCount = async () => {
      await adminActions.charterInvitationsOpenCount().then((counts) => {
        unUsedInvitations.value = counts[0].userCount;
      });
    };

    const calcUsers = async () => {
      potential3.value = type2.value * 10;
      potential4.value = type3.value * 5;
      totalPotentialCharters.value =
        type2.value + potential3.value + potential4.value;
      unclaimedCharters.value =
        totalPotentialCharters.value - type2.value - type3.value - type4.value;
      totalCurrentUsers.value =
        type1.value + type2.value + type3.value + type4.value + type6.value;
      usedInvitations.value = type3.value + type4.value;
      totalPotentialUsers.value =
        totalCurrentUsers.value + unclaimedCharters.value;
    };

    // const userDialogOpen = async () => {
    //   await adminActions.getUserList().then((users) => {
    //     userList.value = users;
    //   });
    //   userDialog.value = true;
    // };

    const cleanUpExports = async () => {
      await exportActions.cleanUpExports().then(() => {});
    };

    return {
      addMessage,
      addNews,
      cleanUpExports,
      message,
      messageHeader,
      startDate,
      endDate,
      messageDialog,
      newsDialog,
      newsText,
      newsTitle,
      restartMessage,
      restartNews,
      type1,
      type2,
      type3,
      type4,
      type6,
      totalUserCounts,
      totalCurrentUsers,
      potential3,
      potential4,
      selectedSubType,
      sentInvitations,
      totalPotentialCharters,
      unUsedInvitations,
      unclaimedCharters,
      totalPotentialUsers,
      userList,
      userSubTypes,
    };
  },
});
</script>
<style scoped>
.qc-card {
  width: 85%;
  margin-top: 10%;
  padding-top: 15%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
}

.feed-card {
  width: 75%;
  margin: auto;
}

.qpage {
  width: 100%;
  padding-top: 10%;
}

.imageBtnBackground {
  background-color: #fefbee;
}

.bg-image {
  background-image: url(../../public/m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
  text-align: center;
}
</style>
