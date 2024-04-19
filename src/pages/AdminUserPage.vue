<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING Admin Users PAGE for admins to manage users' sub expiration date or sub type-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h5 text-info">MANAGE USERS</p>
        <q-btn-group push>
          <q-btn
            v-if="searchBy === 'email'"
            color="info"
            glossy
            text-color="white"
            push
            label="User Email"
            @click="setSearchBy('email')"
          />
          <q-btn
            v-if="searchBy !== 'email'"
            color="primary"
            glossy
            text-color="black"
            push
            label="User Email"
            @click="setSearchBy('email')"
          />
          <q-btn
            v-if="searchBy === 'name'"
            color="info"
            glossy
            text-color="white"
            push
            label="User Name"
            @click="setSearchBy('name')"
          />
          <q-btn
            v-if="searchBy !== 'name'"
            color="primary"
            glossy
            text-color="black"
            push
            label="User Name"
            @click="setSearchBy('name')"
          />
          <q-btn
            v-if="searchBy === 'userID'"
            color="info"
            glossy
            text-color="white"
            push
            label="User ID"
            @click="setSearchBy('userID')"
          />
          <q-btn
            v-if="searchBy !== 'userID'"
            color="primary"
            glossy
            text-color="black"
            push
            label="User ID"
            @click="setSearchBy('userID')"
          />
        </q-btn-group>
      </div>
      <div v-if="searchBy === 'email'" class="q-ml-md q-mr-md">
        <q-input v-model="email" label="Email"></q-input>
        <q-btn @click="getUserByEmail()">Retrieve</q-btn>
      </div>
      <div v-if="searchBy === 'userID'" class="q-ml-md q-mr-md">
        <q-input v-model="userID" label="User ID"></q-input>
        <q-btn @click="getUserByID()">Retrieve</q-btn>
      </div>
      <div v-if="searchBy === 'name'" class="q-ml-md q-mr-md">
        <q-input v-model="firstName" label="First Name"></q-input>
        <q-input v-model="lastName" label="Last Name"></q-input>
        <q-btn @click="getUserByName()">Retrieve</q-btn>
      </div>
      <p class="text-h6">{{ noUserMsg }}</p>
      <q-card-section v-if="displayList === true">
        <q-list separator bordered>
          <q-item
            v-for="u in memList"
            :key="u.UserID"
            clickable
            @click="setEditFields(u)"
          >
            <div>
              <div>
                {{ u.UserFirst }} {{ u.UserLast }}, {{ u.UserDisplayName }},
              </div>
              <div>{{ u.UserEmail }}</div>
            </div>
          </q-item>
        </q-list>
        <!--Beginning of Edit Dialog-->
        <q-dialog v-model="editUserDialog" persistent>
          <q-card style="min-width: 350px" class="text-info">
            <q-card-section>
              <div class="text-h6">Edit User</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div>{{ memUser.UserFirst }} {{ memUser.UserLast }}</div>
              <div>{{ memUser.UserEmail }}</div>
              <div>UserID: {{ memUser.UserID }}</div>
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
              <q-btn flat label="Save Changes" @click="editUser()" />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!--end of Edit Dialog -->
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, watch } from "vue";
//import { useRoute } from "vue-router";
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
    const editUserSubExpiration = ref(null);
    const editUserSubType = ref(null);
    const editUserID = ref(null);
    const noUserMsg = ref(null);
    const displayList = ref(false);
    const subTypes = ref(null);

    onMounted(() => {
      if (Number(userState.user.AdminLevel) !== 100) {
        router.push({ name: "home" });
      }
      getSubTypes();
    });

    const setSearchBy = async (search) => {
      noUserMsg.value = null;
      searchBy.value = search;
    };

    const setEditFields = async (u) => {
      editUserSubExpiration.value = u.UserSubExpiration.substring(0, 10);
      editUserSubType.value = u.UserSubType;
      editUserID.value = u.UserID;
      editUserDialog.value = true;
      memUser.value = u;
    };

    const getUserByEmail = async () => {
      noUserMsg.value = null;
      await adminActions.getUserByEmail(email.value).then((result) => {
        memUser.value = result;
        if (result) {
          editUserDialog.value = true;
        } else {
          editUserDialog.value = false;
          noUserMsg.value = "No user found";
        }
      });
    };

    const getUserByName = async () => {
      noUserMsg.value = null;
      await adminActions
        .getUserByName(firstName.value, lastName.value)
        .then((result) => {
          memList.value = result;
          if (result) {
            displayList.value = true;
          } else {
            editUserDialog.value = false;
            noUserMsg.value = "No user found";
          }
        });
    };

    const getUserByID = async () => {
      noUserMsg.value = null;
      await adminActions.getUserByID(userID.value).then((result) => {
        memUser.value = result;
        if (result) {
          editUserDialog.value = true;
        } else {
          editUserDialog.value = false;
          noUserMsg.value = "No user found";
        }
      });
    };

    const getSubTypes = async () => {
      adminActions.getSubTypes().then((types) => {
        subTypes.value = types;
      });
    };
    const editUser = async () => {
      if (!editUserSubExpiration.value) {
        noUserMsg.value = "You must enter a date.";
      }
      if (!editUserSubExpiration.value) {
        noUserMsg.value = "You must enter a subscription type.";
      }
      await adminActions
        .editUser(
          editUserSubExpiration.value,
          editUserSubType.value,
          editUserID.value
        )
        .then(() => {
          editUserDialog.value = false;
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
      firstName,
      lastName,
      userID,
      searchBy,
      editUserDialog,
      editUserSubExpiration,
      editUserSubType,
      getUserByEmail,
      getUserByName,
      getUserByID,
      noUserMsg,
      setSearchBy,
      displayList,
      memList,
      setEditFields,
      subTypes,
      editUser,
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
