<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h4">
          My Connections
          <q-btn
            icon="mdi-account-plus-outline"
            @click="openNewConnectionDialog()"
          ></q-btn>
        </p>
        <p class="text-h6 text-info">{{ errMsg }}</p>
        <q-btn-toggle
          class="q-mr-lg"
          v-model="accepted"
          spread
          rounded
          no-caps
          toggle-color="accent"
          color="primary"
          text-color="white"
          :options="[
            {
              label: 'Connections',
              value: 'one',
            },
            { label: 'Invitations Received', value: 'two' },
            { label: 'Invitations Sent', value: 'three' },
          ]"
        />
      </div>
      <!--start list of accepted connections-->
      <div
        class="text-center relative-center"
        id="list"
        v-if="accepted === 'one'"
      >
        <q-list bordered separator class="justify-center groupList">
          <div
            v-for="person in everyoneList"
            :key="person.MemberID"
            class="text-center justify-center relative-center shareList"
          >
            <q-item-section
              class="relative-center text-center"
              v-if="person.CircleStatus === 'Invitation Accepted'"
            >
              <q-item class="text-center">
                <q-item-label class="absolute-center"
                  >{{ person.UserDisplayName }}
                  <q-btn
                    flat
                    icon="mdi-delete"
                    @click="
                      confirmDeleteOn(person.UserDisplayName, person.MemberID)
                    "
                    class="text-accent"
                  ></q-btn>
                </q-item-label>
              </q-item>
            </q-item-section>
          </div>
        </q-list>
      </div>
      <!--end list of accepted connections-->

      <!--START RECEIVED INVITATIONS-->
      <div
        class="text-center relative-center"
        id="list"
        v-if="accepted === 'two'"
      >
        <q-list bordered separator class="justify-center groupList">
          <div
            v-for="person in openInvitations"
            :key="person.CircleMemID"
            class="text-center justify-center relative-center shareList"
          >
            <q-item-section
              class="relative-center text-center bordered separator"
            >
              <q-item class="text-center row">
                <q-item-label class="absolute-center">
                  <span class="text-h6">{{ person.UserDisplayName }}</span>
                  <q-btn
                    flat
                    icon="mdi-check-bold"
                    label="Accept"
                    size="xs"
                    @click="acceptInvitation(person.CircleMemID)"
                  ></q-btn>
                  <q-btn
                    flat
                    label="Decline"
                    icon="mdi-close-thick"
                    size="xs"
                    @click="declineInvitation(person.CircleMemID)"
                  ></q-btn>
                </q-item-label>
              </q-item>
            </q-item-section>
          </div>
        </q-list>
      </div>
      <!--END RECEIVED INVITATIONS-->

      <!--START SENT INVITATIONS-->
      <div
        class="text-center relative-center"
        id="list"
        v-if="accepted === 'three'"
      >
        <p class="text-h6 text-info">
          These are the invitations you've sent that have not yet been accepted.
        </p>
        <q-list bordered separator class="justify-center groupList">
          <div
            v-for="person in sentInvitations"
            :key="person.ID"
            class="text-center justify-center relative-center shareList"
          >
            <q-item-section class="relative-center text-center">
              <q-item class="text-center">
                <q-item-label class="absolute-center"
                  >{{ person.invitedEmail }}
                </q-item-label>
              </q-item>
            </q-item-section>
          </div>
        </q-list>
      </div>
      <!--END SENT INVITATIONS-->

      <!--Beginning of delete connection confirmation Dialog-->
      <q-dialog v-model="confirmDelete" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar
              icon="mdi-delete-alert-outline"
              color="negative"
              text-color="white"
            />
            <span class="q-ml-sm"
              >Are you sure you want to permenantly delete
              <span class="text-weight-bolder">{{ userName }}?</span></span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Delete"
              color="primary"
              @click="deleteConnection(userName, memberID)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--end of delete connection confirmation Dialog-->

      <!--Beginning of add new connection dialog-->
      <q-dialog v-model="addConnectionDialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">
              Enter the email address of the person you want to connect to.
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <p class="text-subtitle1 text-negative">{{ errMsg }}</p>
            <q-btn color="accent" v-if="inviteBtn" to="/invite">Yes!</q-btn>
            <q-input
              v-if="
                errMsg !==
                'This person is not a member of Memories For Us. Would you like to send them an invitation to join?'
              "
              dense
              v-model="email"
              autofocus
              @keyup.enter="prompt = false"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Invite Connection" @click="addConnection()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--end of add new connection dialog-->
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
//import shareActions from "../actions/share"; //
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import groupActions from "../actions/groups";
import connectionActions from "../actions/connections";

export default defineComponent({
  name: "SharePage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const errMsg = ref(null);
    const addConnectionDialog = ref(false);
    const addEmail = ref(null);
    const confirmDelete = ref(false);
    const everyoneList = ref(null);
    const addConnectionErrrMsg = ref(null);
    const primaryCircle = ref(null);
    const email = ref(null);
    const inviteBtn = ref(false);
    const accepted = ref("one");
    const memberID = ref(null);
    const userName = ref(null);
    const openInvitations = ref(null);
    const sentInvitations = ref(null);

    onMounted(() => {
      console.log("ShareGroups page started", user);
      getPrimaryCircle();
      myOpenInvitations();
      mySentInvitations();
    });

    const confirmDeleteOn = async (UserDisplayName, MemberID) => {
      confirmDelete.value = true;
      userName.value = UserDisplayName;
      memberID.value = MemberID;
    };

    const getPrimaryCircle = async () => {
      await connectionActions
        .getPrimaryCircle(userState.user.UserID)
        .then((circle) => {
          console.log("page sees primary circle as: ", circle[0].CircleID);
          primaryCircle.value = circle[0].CircleID;
        })
        .then(() => {
          getEveryoneList(primaryCircle.value);
        });
    };

    const deleteConnection = async () => {
      await connectionActions
        .deleteConnection(memberID.value, primaryCircle.value)
        .then(() => {
          confirmDelete.value = false;
          getEveryoneList(primaryCircle.value);
        });
    };

    const getEveryoneList = async (primaryCircle) => {
      await connectionActions
        .getCircleMembersAll(primaryCircle, userState.user.UserID)
        .then((pickList) => {
          everyoneList.value = pickList;
        });
    };

    const openNewConnectionDialog = async () => {
      email.value = null;
      errMsg.value = null;
      addConnectionDialog.value = !addConnectionDialog.value;
    };

    const addConnection = async () => {
      if (everyoneList.value.some((e) => e.UserEmail === email.value)) {
        errMsg.value = "This email address is already a connection.";
        return;
      }

      if (sentInvitations.value.some((e) => e.invitedEmail === email.value)) {
        errMsg.value = "You have already sent an invitation to this address.";
        return;
      }

      errMsg.value = null;
      connectionActions.searchMembers(email.value).then((memberRes) => {
        console.log("result of search is: ", memberRes);
        if (memberRes.length < 1) {
          inviteBtn.value = true;
          errMsg.value =
            "This person is not a member of Memories For Us. Would you like to send them an invitation to join?";
          return;
        }

        connectionActions
          .addToEveryone(userState.user.UserID, memberRes[0].UserID)
          .then(() => {
            getEveryoneList(primaryCircle.value);
          });
        errMsg.value = "An invitation to connect as been sent.";
      });
    };

    const myOpenInvitations = async () => {
      errMsg.value = null;
      await connectionActions
        .myOpenInvitations(userState.user.UserID)
        .then((open) => {
          openInvitations.value = open;
          if (open.length > 0) {
            errMsg.value = "You have an invitation to connect!";
            accepted.value = "two";
          } else {
            accepted.value = "one";
          }
        });
    };

    const mySentInvitations = async () => {
      await connectionActions
        .mySentInvitations(userState.user.UserID)
        .then((sent) => {
          sentInvitations.value = sent;
        });
    };

    const acceptInvitation = async (circleMemID) => {
      await connectionActions
        .acceptInvitation(circleMemID, userState.user.UserID)
        .then(() => {
          myOpenInvitations();
          getEveryoneList(primaryCircle.value);
          window.location.reload();
        });
    };

    const declineInvitation = async (circleMemID) => {
      await connectionActions
        .declineInvitation(circleMemID, userState.user.UserID)
        .then(() => {
          myOpenInvitations();
          getEveryoneList(primaryCircle.value);
          window.location.reload();
        });
    };

    return {
      errMsg,
      email,
      confirmDelete,
      everyoneList,
      confirmDeleteOn,
      deleteConnection,
      addConnectionDialog,
      openNewConnectionDialog,
      addConnection,
      inviteBtn,
      accepted,
      userName,
      openInvitations,
      sentInvitations,
      acceptInvitation,
      declineInvitation,
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
  background-image: url(/background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
  text-align: center;
}
</style>
