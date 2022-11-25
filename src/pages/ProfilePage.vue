<template>
  <q-page class="flex-center qpage bg-image">
    <q-pull-to-refresh @refresh="refresh">
      <div class="row justify-center">
        <q-card class="cardWidth">
          <div class="text-h5 q-ml-md">
            {{ newUserDisplayName }}
            <q-btn
              icon="mdi-pencil"
              flat
              @click="editProfileDialog = true"
            ></q-btn>
          </div>
          <div class="text-h5 q-ml-md">{{ newUserEmail }}</div>
          <div class="text-h5 q-ml-md">
            Full name: {{ newUserFirst }} {{ newUserLast }}
          </div>

          <q-dialog v-model="editProfileDialog" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <span class="text-subtitle1">Edit your profile</span>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  v-model="newUserDisplayName"
                  label="Name you want others to see"
                  autofocus
                />
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input dense v-model="newUserFirst" label="Your first name" />
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input dense v-model="newUserLast" label="Your last name" />
              </q-card-section>
              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  @blur="valid()"
                  v-model="newUserEmail"
                  label="Your email"
                  autofocus
                />

                <q-item-label v-if="emailValid === false"
                  >Enter a valid email address</q-item-label
                >
              </q-card-section>
              <q-card-section>
                <q-btn @click="passwordDialog = true"> Change Password </q-btn>

                <!--START CHANGE PASSWORD DIALOG-->
                <q-dialog v-model="passwordDialog" persistent>
                  <q-card style="min-width: 350px">
                    <q-card-section>
                      <div class="text-h6">Change Password</div>
                      {{ passwordChangeMsg }}
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      <q-input
                        dense
                        type="password"
                        label="New password"
                        hint="Maximum 20 characters."
                        v-model="newPassword1"
                        autofocus
                      />
                      <q-item-label>Password Strength: </q-item-label>
                      <q-linear-progress
                        rounded
                        :value="score"
                        color="accent q-mt-lg"
                        size="15px"
                      >
                      </q-linear-progress>
                    </q-card-section>
                    <q-card-section class="q-pt-none">
                      <q-input
                        type="password"
                        label="Retype new password"
                        dense
                        v-model="newPassword2"
                      />
                    </q-card-section>
                    <q-card-section class="q-pt-none">
                      <q-input
                        label="Old Password"
                        dense
                        type="password"
                        v-model="oldPassword"
                      />
                    </q-card-section>
                    <q-card-actions align="right" class="text-primary">
                      <q-btn
                        color="accent"
                        flat
                        label="Cancel"
                        @click="cancelPasswordChange()"
                      />
                      <q-btn
                        color="accent"
                        v-if="score > 0.75 && passMatch === true && oldPassword"
                        flat
                        label="Change Password"
                        @click="passwordChange()"
                      />
                      <q-btn
                        v-if="
                          score <= 0.75 || passMatch === false || !oldPassword
                        "
                        flat
                        disabled="true"
                        label="Change Password"
                        @click="passwordChange()"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
                <!--END CHANGE PASSWORD DIALOG-->
              </q-card-section>
              <q-card-section>
                {{ passwordChangeSuccess }}
              </q-card-section>
              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" @click="cancelProfileChange()" />
                <q-btn flat label="Save" @click="updateProfile()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-card>
      </div>
      <!--NEW MEDIA SECTION-->
      <div class="row justify-center cardColor q-pa-lg">
        <q-img :src="profileSas" style="height: 300px" fit="contain">
          <template v-slot:loading>
            <div class="accent">
              <q-spinner-ios />
              <div class="q-mt-md">Loading...</div>
            </div>
          </template>
        </q-img>
        <q-btn @click="pictureDialog = true">Edit Profile Picture</q-btn>

        <!--START UPDATE PICTURE DIALOG-->
        <q-dialog v-model="pictureDialog" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Update your profile photo</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-card style="min-width: 350px">
                <q-card-section class="q-pt-md">
                  <q-file
                    rounded
                    outlined
                    bottom-slots
                    v-model="qUploadFle"
                    label="Click to add a photo or video"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="qUploadFle !== null"
                        name="close"
                        @click.stop.prevent="qUploadFle = null"
                        class="cursor-pointer"
                      />
                      <q-icon name="mdi-image-plus" @click.stop.prevent />
                    </template>
                  </q-file>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Cancel" v-close-popup />
                  <q-btn flat label="Save" @click="handleFileUpload()" />
                </q-card-actions>
              </q-card>
            </q-card-section>
          </q-card>
        </q-dialog>
        <!--END UPDATE PICTURE DIALOG-->
      </div>
      <div class="row justify-center cardColor"></div>
      <!--END NEW MEDIA SECTION-->
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import mediaActions from "../actions/blobs"; //
import loginActions from "../actions/login";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
const reauthToken = window.localStorage.getItem("rt");

export default defineComponent({
  name: "ProfiePage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);

    const changeEmail = ref(false);
    const editProfileDialog = ref(false);
    const emailChangeMsg = ref(null);
    const emailValid = ref(true);
    const newPassword1 = ref(null);
    const newPassword2 = ref(null);
    const newUserDisplayName = ref(user.UserDisplayName);
    const newUserFirst = ref(user.UserFirst);
    const newUserLast = ref(user.UserLast);
    const newUserEmail = ref(user.UserEmail);
    const oldPassword = ref(null);
    const passwordChangeMsg = ref(null);
    const passwordChangeSuccess = ref(null);
    const passwordDialog = ref(false);
    const pictureDialog = ref(false);
    const profileSas = ref(null);
    const qUploadFle = ref(null);

    //EMAIL VALIDATION
    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;

    const valid = async () => {
      reg.test(newUserEmail.value);

      if (reg.test === true) {
        validEmail.value = true;
        return;
      } else {
        emailValie.value = false;
        return;
      }
    };

    //END EMAIL VALIDATION

    //PASSWORD VALIDATION
    const isPasswordStrong = ref(false);
    const options = {
      dictionary: {
        ...zxcvbnCommonPackage.dictionary,
        ...zxcvbnEnPackage.dictionary,
      },
      graphs: zxcvbnCommonPackage.adjacencyGraphs,
      translations: zxcvbnEnPackage.translations,
    };
    zxcvbnOptions.setOptions(options);

    const score = computed(() => {
      const hasValue = newPassword1.value && newPassword1.value.length > 0;

      if (!hasValue) {
        return 0;
      }
      var retScore = zxcvbn(newPassword1.value).score;
      return zxcvbn(newPassword1.value).score * 0.25;
    });

    const passMatch = computed(() => {
      if (newPassword1.value !== newPassword2.value) {
        var match = false;
      } else {
        var match = true;
      }
      return match;
    });
    //END PASSWORD VALIDATION
    onMounted(() => {
      getSasKey();
    });

    const cancelPasswordChange = async () => {
      newPassword1.value = null;
      newPassword2.value = null;
      oldPassword.value = null;
      passwordDialog.value = false;
    };

    const cancelProfileChange = async () => {
      editProfileDialog.value = false;
      newUserEmail.value = user.UserEmail;
      newUserFirst.value = user.UserFirst;
      newUserLast.value = user.UserLast;
      newUserDisplayName.value = user.UserDisplayName;
    };

    const passwordChange = async () => {
      if (newPassword1.value === newPassword2.value) {
        if (newPassword1.value.length > 20) {
          errorMsg.value =
            "Your password must be less than 21 characters in length.";
          window.scrollTo(0, 0);
          return;
        }
        await loginActions
          .updatePassword(user.UserID, oldPassword.value, newPassword1.value)
          .then((result) => {
            if (result === false) {
              passwordChangeMsg.value =
                "Something went wrong. Please try again or contact support.";
              return;
            }

            if (result !== false) {
              newPassword1.value = null;
              newPassword2.value = null;
              oldPassword.value = null;
              passwordDialog.value = false;
              passwordChangeSuccess.value = "Your password has been changed.";
            }
          });
      } else {
        passwordChangeMsg.value = "New passwords do not match.";
        return;
      }
    };

    const getSasKey = async () => {
      await mediaActions
        .getSasKey(userState.user.UserMediaLoc)
        .then((incomingSas) => {
          profileSas.value = incomingSas;
        });
    };

    const handleFileUpload = async () => {
      pictureDialog.value = false;
      let formData = new FormData();
      formData.append("file", qUploadFle.value);
      formData.append("userID", user.UserID);
      formData.append("reauthToken", reauthToken);

      await mediaActions
        .addNewProfileBlob(formData)
        .then((ret) => {
          qUploadFle.value = null;
        })
        .then(() => {
          updateState();
        });
      // .then(() => {
      //   getSasKey();
      // });
    };

    const updateState = async () => {
      await loginActions
        .getUserInfo(user.UserID)
        .then((loginResult) => {
          userState.userLogin(loginResult);
        })
        .then(() => {
          getSasKey();
        });
    };

    const refresh = (done) => {};

    const updateProfile = async () => {
      editProfileDialog.value = false;

      if (newUserEmail.value !== user.UserEmail) {
        changeEmail.value = true;
        emailChangeMsg.value = true;
        loginActions.changeEmail(newUserEmail.value, user.UserID);
      } else {
        changeEmail.value = false;
      }
      await loginActions
        .updateUser(
          user.UserID,
          newUserFirst.value,
          newUserLast.value,
          newUserDisplayName.value,
          newUserEmail.value
        )
        .then((loginResult) => {
          userState.userLogin(loginResult);
        });
    };

    return {
      cancelProfileChange,
      cancelPasswordChange,
      isLoggedIn,
      emailChangeMsg,
      editProfileDialog,
      emailValid,
      handleFileUpload,
      newPassword1,
      newPassword2,
      newUserDisplayName,
      newUserFirst,
      newUserLast,
      newUserEmail,
      oldPassword,
      options,
      passMatch,
      passwordChange,
      passwordChangeMsg,
      passwordChangeSuccess,
      passwordDialog,
      pictureDialog,
      profileSas,
      qUploadFle,
      refresh,
      score,
      updateProfile,
      user,
      valid,
    };
  },
});
</script>
<style scoped>
.cardWidth {
  width: 85%;
}
.qc-card {
  width: 85%;
  margin-top: 10%;
  padding-top: 15%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
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
</style>
