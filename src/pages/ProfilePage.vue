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
          <div>
            <q-btn v-if="user.StripeCustomer" flat @click="stripePortal()"
              >Payment Information</q-btn
            >
          </div>
          <div>
            <!--THE FOLLOWING BTN ONLY SHOWS FOR CHARTER MEMBERS-->
            <q-btn
              flat
              @click="cancelAccountDialog = true"
              v-if="
                user.UserSubType > 1 &&
                user.UserSubType < 5 &&
                user.CancelID === null
              "
              >Cancel Account</q-btn
            >
          </div>
          <div
            class="q-ml-md q-mt-md"
            v-if="
              user.UserSubType > 1 &&
              user.UserSubType < 5 &&
              user.CancelID !== null
            "
          >
            <!--THE FOLLOWING BTN ONLY SHOWS FOR CHARTER MEMBERS-->
            You cancelled your account. Have you changed your mind?
            <div>
              <q-btn
                @click="reinstateAccount()"
                v-if="
                  user.UserSubType > 1 &&
                  user.UserSubType < 5 &&
                  user.CancelID !== null
                "
                >Yes! Reinstate My Charter Account</q-btn
              >
            </div>
          </div>
          <!--FIRST DIALOG TO CANCEL ACCOUNT-->
          <q-dialog v-model="cancelAccountDialog" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar
                  icon="mdi-alert-outline"
                  color="negative"
                  text-color="white"
                />
                <span class="q-ml-sm q-mb-xl text-h5"
                  >By canceling your account, you will lose all of your
                  memories, books and all other data in 10 days.
                </span>
                <div class="text-h5">Are you sure you want to do this?</div>
              </q-card-section>

              <q-card-actions align="right">
                <div class="text-caption q-mt-xl">
                  *Refunds are not available when accounts are canceled prior to
                  the end of the billing period.
                </div>
                <q-btn flat label="Cancel" color="accent" v-close-popup />
                <q-btn
                  flat
                  label="Cancel My Account"
                  color="accent"
                  @click="startCancel()"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--END OF FIRST DIALOG TO CANCEL ACCOUNT-->
          <!--SECOND DIALOG TO CANCEL ACCOUNT (GET REASON)-->
          <q-dialog v-model="cancelReasonDialog" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <span class="q-ml-sm text-h5"
                  >Can you please tell us why you are canceling your account?
                </span>
              </q-card-section>
              <q-card-section>
                <q-list>
                  <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                      <q-radio
                        v-model="reason"
                        val="Not using it anymore"
                        color="accent"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Not using it anymore</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item tag="label" v-ripple>
                    <q-item-section avatar>
                      <q-radio
                        v-model="reason"
                        val="Too expensive"
                        color="accent"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Too expensive</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item tag="label" v-ripple>
                    <q-item-section avatar top>
                      <q-radio
                        v-model="reason"
                        val="Technical Problem"
                        color="accent"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Technical Problem</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item tag="label" v-ripple>
                    <q-item-section avatar top>
                      <q-radio v-model="reason" val="Other" color="accent" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Other</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="accent" v-close-popup />
                <q-btn
                  flat
                  label="Cancel My Account"
                  color="accent"
                  @click="completeCancel()"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--END OF SECOND DIALOG TO CANCEL ACCOUNT-->
          <!--BEGIN THIRD DIALOG TO CANCEL ACCOUNT-->
          <q-dialog v-model="logOutNotice" persistent>
            <q-card>
              <q-card-section>
                <div class="text-h6">Alert</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                You will need to log out and back in for this change to take
                effect.
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--END THIRD DIALOG TO CANCEL ACCOUNT-->
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
                  v-model="newUserEmail"
                  label="Your email"
                  autofocus
                />
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
        <q-btn @click="pictureDialog = true" color="primary"
          >Edit Profile Picture</q-btn
        >

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
                  <q-inner-loading
                    :showing="progress"
                    label="Uploading media..."
                    label-class="info"
                    label-style="font-size: 1.1em"
                  />
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

    const cancelAccountDialog = ref(false);
    const cancelReasonDialog = ref(false);
    const changeEmail = ref(false);
    const editProfileDialog = ref(false);
    const emailChangeMsg = ref(null);
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
    const progress = ref(false);
    const qUploadFle = ref(null);
    const reason = ref(null);
    const logOutNotice = ref(false);

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
      progress.value = true;
      pictureDialog.value = false;
      let formData = new FormData();
      formData.append("file", qUploadFle.value);
      formData.append("userID", user.UserID);
      formData.append("reauthToken", reauthToken);

      await mediaActions
        .addNewProfileBlob(formData)
        .then((ret) => {
          progress.value = false;
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

    const stripePortal = async () => {
      await loginActions
        .getStripePortal(user.StripeCustomer)
        .then((stripeUrl) => {
          window.open(stripeUrl.url);
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

    const startCancel = async () => {
      cancelAccountDialog.value = false;
      cancelReasonDialog.value = true;
    };

    const completeCancel = async () => {
      cancelAccountDialog.value = false;
      cancelReasonDialog.value = false;
      //logic to change usersubtypeid to 9002
      loginActions.cancelAccount(reason.value, user.UserID, user.UserSubTypeID);
    };

    const reinstateAccount = async () => {
      await loginActions.reinstateAccount(user.UserID).then(() => {
        logOutNotice.value = true;
      });
    };

    return {
      cancelAccountDialog,
      cancelReasonDialog,
      cancelProfileChange,
      cancelPasswordChange,
      completeCancel,
      isLoggedIn,
      emailChangeMsg,
      editProfileDialog,
      handleFileUpload,
      logOutNotice,
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
      progress,
      qUploadFle,
      reason,
      refresh,
      reinstateAccount,
      score,
      startCancel,
      stripePortal,
      updateProfile,
      user,
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
  background-image: url(../../m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}
</style>
