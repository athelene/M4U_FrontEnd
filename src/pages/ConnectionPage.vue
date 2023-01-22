<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h5 text-info">
          CONNECTIONS
          <q-icon
            name="mdi-information-outline"
            size="xs"
            @click="getInfo = true"
          ></q-icon>
        </p>

        <q-dialog v-model="getInfo">
          <q-card>
            <q-card-section>
              <div class="text-h6">Connections</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <p class="text-h6">
                Connections are the people you share memories with. Click the
                add button to connect with other members.
              </p>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <p class="text-h5">{{ errMsg }}</p>
        <q-btn
          icon="mdi-link-variant-plus"
          @click="newConnection = !newConnection"
        ></q-btn>
      </div>

      <!--DIV FOR UNACCEPTED CONNECTIONS-->

      <q-list separator dense class="q-mt-md" v-if="invitations">
        <q-item-label header class="text-info text-subtitle1"
          >Open Invitations</q-item-label
        >
        <q-item
          class="text-center"
          bordered
          separator
          v-for="invitation in invitations"
          :key="invitation.MemberID"
        >
          <q-item-section top avatar>
            <AvatarCard
              v-if="invitation.UserMediaLoc"
              :userMediaLoc="invitation.UserMediaLoc"
            ></AvatarCard>
            <q-avatar rounded v-if="!invitation.UserMediaLoc">
              <q-icon name="mdi-account-outline"></q-icon>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ invitation.UserDisplayName }}
          </q-item-section>

          <q-item-section side>
            <q-btn
              v-if="invitation.InvType === 'received'"
              label="Accept"
              color="accent"
              size="xs"
              @click="acceptInvitation(invitation.CircleMemID)"
            ></q-btn>
            <q-item-label
              caption
              v-if="invitation.InvType === 'sent'"
              class="text-info"
            >
              Sent/Pending
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <hr />
      <!--DIV FOR ACCEPTED CONNECTIONS-->

      <q-list separator dense class="q-mt-md">
        <q-item-label header class="text-info text-subtitle1"
          >Current Connections</q-item-label
        >
        <div v-for="connection in connections" :key="connection.MemberID">
          <q-item
            v-if="connection.Status === 'Accepted'"
            class="text-center"
            bordered
            separator
          >
            <q-item-section top avatar>
              <AvatarCard
                v-if="connection.UserMediaLoc"
                :userMediaLoc="connection.UserMediaLoc"
              ></AvatarCard>
              <q-avatar rounded v-if="!connection.UserMediaLoc">
                <q-icon name="mdi-account-outline"></q-icon>
              </q-avatar>
            </q-item-section>
            <q-item-section>
              {{ connection.UserDisplayName }}
            </q-item-section>
            <q-item-section side>
              <q-btn
                icon="mdi-close-circle-outline"
                round
                flat
                size="sm"
                @click="
                  confirmDelete(connection.MemberID, connection.UserDisplayName)
                "
              ></q-btn>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
      <!--Beginning of Add Group-->
      <q-dialog v-model="newConnection" persistent>
        <q-card style="min-width: 350px" class="text-info">
          <q-card-section>
            <div class="text-h6">New Connection</div>
            <div class="text-subtitle1 text-accent">{{ nameErr }}</div>
          </q-card-section>
          <q-card-section>
            <q-btn-group>
              <q-btn
                color="info"
                glossy
                label="Search by email"
                @click="setSearchEmail()"
              />
              <q-btn
                color="info"
                glossy
                label="Search by name"
                @click="setSearchName()"
              />
            </q-btn-group>
          </q-card-section>
          <q-tab-panels
            v-model="panel"
            animated
            class="shadow-2 rounded-borders"
          >
            <q-tab-panel name="emailSearch">
              <div class="text-h6">Enter email</div>
              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  label="Email Address"
                  v-model="newConnectionEmail"
                  autofocus
                  @keyup.enter="prompt = false"
                />
              </q-card-section>

              <q-card-section>
                <span v-if="searchList.length > 0 && searchStarted === true">
                  <div
                    class="text-subtitile1 q-mr-sm text-accent q-mb-sm"
                    v-if="searchList.length > 0 && searchStarted === true"
                  >
                    {{ searchList.UserEmail }} was found!
                  </div>
                  <q-btn @click="addMember(searchList[0].UserID)" accent
                    >Connect</q-btn
                  >
                </span>
                <span
                  v-if="searchList.length <= 0 && searchStarted === true"
                  class="text-subtitle1"
                >
                  There are no members with that email address. Would you like
                  to invite them to join Memories for Us?
                  <q-btn :to="{ name: 'invite' }">Invite</q-btn>
                </span>
              </q-card-section>
            </q-tab-panel>

            <q-tab-panel name="nameSearch">
              <div class="text-h6">Enter name</div>
              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  v-model="newConnectionFirstName"
                  label="First Name"
                  autofocus
                />
                <q-input
                  dense
                  v-model="newConnectionLastName"
                  label="Last Name"
                />
              </q-card-section>
              <q-card-section v-if="dupSuggestion !== null">
                {{ dupSuggestion }}
              </q-card-section>
              <q-card-section>
                <span
                  v-if="
                    searchList.length > 0 &&
                    searchStarted === true &&
                    panel === 'nameSearch'
                  "
                >
                  <q-list bordered separator>
                    <q-item
                      dense
                      class="text-subtitile1 q-mr-sm text-accent q-mb-sm"
                      v-for="search in searchList"
                      :key="search.UserID"
                    >
                      <q-item-label>
                        <q-btn
                          class="q-mr-md"
                          info
                          @click="addMember(search.UserID)"
                          >Connect</q-btn
                        >
                        {{ search.UserDisplayName }}

                        <AvatarCard
                          v-if="search.UserMediaLoc"
                          :userMediaLoc="search.UserMediaLoc"
                        ></AvatarCard>
                      </q-item-label>
                    </q-item>
                  </q-list>
                </span>
                <span
                  v-if="searchList.length <= 0 && searchStarted === true"
                  class="text-subtitle1"
                >
                  There are no members with that name. You can try to find them
                  by email address. Or you can invite them to join Memories for
                  Us.

                  <q-btn :to="{ name: 'invite' }">Invite</q-btn>
                </span>
              </q-card-section>
            </q-tab-panel>
          </q-tab-panels>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" @click="cancelSearch()" />
            <q-btn
              v-if="searchStarted === false"
              flat
              label="Search"
              @click="searchConnection()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--end of Add Group-->

      <!--Beginning of Duplicate notification-->
      <q-dialog v-model="dupConnection">
        <q-card>
          <q-card-section>
            <div class="text-h6">Duplicate Connection</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            You are already connected to this person or there is an invitation
            pending. Please choose another email.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--end of duplicate notification-->

      <!---Beginning of dialog to confirm deleting connection-->
      <q-dialog v-model="confirmDeleteDialog" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="mdi-alert-circle" text-color="negative" />
            <span class="q-ml-sm"
              >This will permenantly delete
              <span class="text-weight-bolder">
                {{ deleteMemberName }}
              </span>
              as a connection. Are you sure you want to continue?</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              color="primary"
              @click="cancelDelete()"
            />
            <q-btn
              flat
              label="Permenantly Delete"
              color="primary"
              @click="deleteConnection()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!---End of dialog confirming deleting connection-->
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import connectionActions from "../actions/connections";
import AvatarCard from "src/components/avatarCard.vue";

export default defineComponent({
  name: "ConnectionPage",
  components: { AvatarCard },
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);

    const confirmDeleteDialog = ref(false);
    const deleteMemberID = ref(null);
    const deleteMemberName = ref(null);
    const dupConnection = ref(false);
    const dupSuggestion = ref(null);
    const errMsg = ref(null);
    const getInfo = ref(false);
    const connections = ref(null);
    const invitations = ref(null);
    const nameErr = ref(null);
    const newConnection = ref(false);
    const newConnectionFirstName = ref(null);
    const newConnectionLastName = ref(null);
    const newConnectionEmail = ref(null);
    const panel = ref("emailSearch");
    const primaryCircle = ref(null);
    const searchList = reactive([]);
    const emptySearch = reactive([]);
    const searchStarted = ref(false);

    onMounted(() => {
      getPrimaryCircle().then(() => {
        getConnections();
        getOpenInvitations();
      });
    });

    const getPrimaryCircle = async () => {
      await connectionActions
        .getPrimaryCircle(user.UserID)
        .then((incomingCircle) => {
          primaryCircle.value = incomingCircle[0].CircleID;
        });
    };

    const getConnections = async () => {
      console.log("running getConnections");
      await connectionActions
        .getCircleMembersAll([primaryCircle.value])
        .then((incomingConnections) => {
          connections.value = incomingConnections;
        });
    };

    const getOpenInvitations = async () => {
      await connectionActions
        .getOpenInvitations([user.UserID])
        .then((incomingInvitations) => {
          invitations.value = incomingInvitations;
        });
    };

    const acceptInvitation = async (memID) => {
      await connectionActions.acceptInvitation(memID, user.UserID).then(() => {
        getOpenInvitations();
        getConnections();
      });
    };

    const searchConnection = async () => {
      dupSuggestion.value = null;
      searchStarted.value = true;
      //     Object.assign(searchList, emptySearch);

      nameErr.value = null;
      if (panel.value === "emailSearch") {
        //CHECK FOR VALID INPUT

        if (
          newConnectionEmail.value === null ||
          newConnectionEmail.value === ""
        ) {
          nameErr.value = "Email Address Required";
          searchStarted.value = false;
          return;
        }
        //START SEARCH FOR EMAIL

        connectionActions
          .searchToAddToEveryone(
            user.UserID,
            newConnectionFirstName.value,
            newConnectionLastName.value,
            newConnectionEmail.value,
            panel.value
          )
          .then((list) => {
            list.forEach((element) => {
              for (var i = 0; i < connections.value.length; i++) {
                if (connections.value[i].MemberID === element.UserID) {
                  dupConnection.value = true;
                  return;
                }
              }
            });
            list.forEach((element) => {
              for (var j = 0; j < invitations.value.length; j++) {
                if (invitations.value[j].InvitedBy === element.UserID) {
                  dupConnection.value = true;
                  //              searchStarted.value = false;
                  return;
                }
              }
            });
            Object.assign(searchList, list);
          });
      }

      //START SEARCH FOR NAME

      if (panel.value === "nameSearch") {
        //CHECK FOR VALID INPUT
        if (
          newConnectionFirstName.value === null ||
          newConnectionFirstName.value === ""
        ) {
          nameErr.value = "First and Last Name Required";
          searchStarted.value = false;
          return;
        }
        if (
          newConnectionLastName.value === null ||
          newConnectionLastName.value === ""
        ) {
          nameErr.value = "First and Last Name Required";
          searchStarted.value = false;
          return;
        }
        Object.assign(searchList, emptySearch);

        connectionActions
          .searchToAddToEveryone(
            user.UserID,
            newConnectionFirstName.value,
            newConnectionLastName.value,
            newConnectionEmail.value,
            panel.value
          )
          .then((list) => {
            list.forEach((element) => {
              var result = connections.value.find(
                (conn) => conn.MemberID === element.UserID
              );
              var result2 = invitations.value.find(
                (inv) => inv.InvitedBy === element.UserID
              );

              if (
                (typeof result === "undefined" || result === null) &&
                (typeof result2 === "undefined" || result2 === null)
              ) {
                searchList.push(element);
              } else {
                dupSuggestion.value =
                  "Note: You are already connected to or have a pending invitation with " +
                  element.UserDisplayName;
              }
            });
          });
      }
    };

    const cancelSearch = async () => {
      getConnections();
      getOpenInvitations();
      nameErr.value = null;
      newConnectionFirstName.value = null;
      newConnectionLastName.value = null;
      newConnectionEmail.value = null;
      panel.value = "emailSearch";
      newConnection.value = false;
      searchList.value = null;
      searchStarted.value = false;
      dupSuggestion.value = null;
    };

    const resetSearchFields = async () => {
      Object.assign(searchList, emptySearch);
      newConnectionFirstName.value = null;
      newConnectionLastName.value = null;
      newConnectionEmail.value = null;
      searchStarted.value = false;
    };

    const setSearchEmail = async () => {
      Object.assign(searchList, emptySearch);
      for (const key in searchList) {
        delete searchList[key];
      }
      newConnectionFirstName.value = null;
      newConnectionLastName.value = null;
      newConnectionEmail.value = null;
      panel.value = "emailSearch";
      searchStarted.value = false;
    };

    const setSearchName = async () => {
      // Object.assign(searchList, emptySearch);
      searchList.splice(0, searchList.length);
      newConnectionFirstName.value = null;
      newConnectionLastName.value = null;
      newConnectionEmail.value = null;
      panel.value = "nameSearch";
      searchStarted.value = false;
    };
    const addMember = async (memberID) => {
      if (panel.value === "emailSearch") {
        await connectionActions
          .addToEveryoneEmail(user.UserID, memberID)
          .then((returnMsg) => {
            resetSearchFields();
            getConnections();
            nameErr.value = "Invitation to connect sent.";
          });
      }
      if (panel.value === "nameSearch") {
        await connectionActions
          .addToEveryoneEmail(user.UserID, memberID)
          .then((returnMsg) => {
            resetSearchFields();
            getConnections();
            nameErr.value = "Invitation to connect sent.";
          });
      }
    };

    const confirmDelete = async (memberID, memberName) => {
      confirmDeleteDialog.value = true;
      deleteMemberID.value = memberID;
      deleteMemberName.value = memberName;
    };

    const deleteConnection = async () => {
      await connectionActions
        .deleteConnection(deleteMemberID.value, user.UserID)
        .then(() => {
          confirmDeleteDialog.value = false;
          deleteMemberID.value = null;
          deleteMemberName.value = null;
          getConnections();
        });
    };

    const cancelDelete = async () => {
      confirmDeleteDialog.value = false;
      deleteMemberID.value = null;
      deleteMemberName.value = null;
    };

    return {
      acceptInvitation,
      addMember,
      cancelDelete,
      cancelSearch,
      confirmDeleteDialog,
      confirmDelete,
      deleteConnection,
      deleteMemberID,
      deleteMemberName,
      dupConnection,
      dupSuggestion,
      connections,
      errMsg,
      getConnections,
      getInfo,
      invitations,
      nameErr,
      newConnection,
      newConnectionEmail,
      newConnectionFirstName,
      newConnectionLastName,
      panel,
      resetSearchFields,
      searchConnection,
      searchList,
      searchStarted,
      setSearchEmail,
      setSearchName,
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
