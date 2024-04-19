<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h5 text-info">MANAGE ADMIN INVITATIONS</p>
      </div>
      <p class="text-h6">{{ noUserMsg }}</p>
      <q-card-section>
        <q-list separator bordered>
          <q-item v-for="u in memList" :key="u.UserID" clickable>
            <q-item-section>{{ u.InviteEmail }}</q-item-section>
            <q-item-section
              ><q-btn icon="mdi-pencil" @click="setEditFields(u)"></q-btn
            ></q-item-section>
            <q-item-section
              ><q-btn icon="mdi-delete" @click="setDeleteFields(u)"></q-btn
            ></q-item-section>
          </q-item>
        </q-list>
        <!--Beginning of Edit Dialog-->
        <q-dialog v-model="editUserDialog" persistent>
          <q-card style="min-width: 350px" class="text-info">
            <q-card-section>
              <div class="text-h6">Edit User</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div>{{ memUser.InviteEmail }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-select
                filled
                option-value="UserSubTypeID"
                option-label="UserSubType"
                v-model="editUserSubType"
                :options="subTypes"
                label="Subscription Type"
                emit-value
                map-options
              />
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input filled v-model="editUserSubExpiration">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="editUserSubExpiration" mask="YYYY-MM-DD">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Save Changes"
                @click="editUser(memUser.InviteEmail)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!--end of Edit Dialog -->

        <!--Beginning of delete confirm Dialog-->
        <q-dialog v-model="deleteDialog" persistent>
          <q-card style="min-width: 350px" class="text-info">
            <q-card-section>
              <div class="text-h6">Delete Invitation</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div>
                Are you sure you want to delete the invitation for
                {{ memUser.InviteEmail }}?
              </div>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Delete"
                @click="deleteInvitation(memUser.InvitationID)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!--end of delete confirm Dialog -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import adminActions from "../actions/admin";

export default defineComponent({
  name: "AdminQCPage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const router = useRouter();

    const email = ref(null);
    const firstName = ref(null);
    const lastName = ref(null);
    const userID = ref(null);
    const memUser = ref(null);
    const memList = ref(null);
    const searchBy = ref("email");
    const editUserDialog = ref(false);
    const deleteDialog = ref(false);
    const editUserSubExpiration = ref(null);
    const editUserSubType = ref(null);
    const editEmail = ref(null);
    const noUserMsg = ref(null);
    const displayList = ref(false);
    const subTypes = ref(null);

    onMounted(() => {
      if (Number(userState.user.AdminLevel) !== 100) {
        router.push({ name: "home" });
      }
      getSubTypes();
      getOpenAdminInvitations();
    });

    const getOpenAdminInvitations = async () => {
      noUserMsg.value = null;
      await adminActions.getOpenAdminInvitations().then((result) => {
        memList.value = result.recordsets[0];
        if (result) {
        } else {
          noUserMsg.value = "No open invitations found";
        }
      });
    };

    const openDialog = () => {
      editUserDialog.value = true;
    };

    const setEditFields = async (u) => {
      editUserSubExpiration.value = u.InviteDate;
      editUserSubType.value = u.InvitationType;
      editEmail.value = u.InviteEmail;
      editUserDialog.value = true;
      memUser.value = u;
    };

    const setDeleteFields = async (u) => {
      editEmail.value = u.InviteEmail;
      deleteDialog.value = true;
      memUser.value = u;
    };

    const getSubTypes = async () => {
      adminActions.getSubTypes().then((types) => {
        subTypes.value = types;
      });
    };
    const editUser = async (inviteEmail) => {
      if (!editUserSubExpiration.value) {
        noUserMsg.value = "You must enter a date.";
      }
      if (!editUserSubExpiration.value) {
        noUserMsg.value = "You must enter a subscription type.";
      }
      await adminActions
        .editInvitation(
          editUserSubExpiration.value,
          editUserSubType.value,
          inviteEmail
        )
        .then(() => {
          getOpenAdminInvitations();
          editUserDialog.value = false;
        })
        .then(() => {
          memList.value = null;
          memUser.value = null;
          noUserMsg.value = null;
        });
    };

    const deleteInvitation = async (invitationID) => {
      await adminActions
        .deleteInvitation(invitationID)
        .then(() => {
          getOpenAdminInvitations();
          deleteDialog.value = false;
        })
        .then(() => {
          memList.value = null;
          memUser.value = null;
          noUserMsg.value = null;
        });
    };

    return {
      memUser,
      email,
      editUserDialog,
      deleteDialog,
      editUserSubExpiration,
      editUserSubType,
      noUserMsg,
      getOpenAdminInvitations,
      displayList,
      memList,
      setEditFields,
      setDeleteFields,
      subTypes,
      editUser,
      deleteInvitation,
      openDialog,
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
  background-image: url(../../m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
}
</style>
