<template>
  <q-page class="window-height window-width row justify-center bg-image">
    <!--STARTING CHARTER REGISTRATION PAGE-->
    <div class="column">
      <q-card
        width="85%"
        style="background: radial-gradient(circle, #bbb7a9 0%, #006666 100%)"
      >
        <div class="text-h4 text-center">Save and Share Your Memories</div>
        <div class="text-h6 text-info text-center">
          You've been invited to join Memories For Us as a charter member.
        </div>
        <div class="text-h6 text-info text-center">
          Accept your invitation and never pay!
        </div>
      </q-card>
      <div class="text-h6">{{ errorMsg }}</div>
      <div class="q-mt-lg">
        <q-card square bordered class="q-pa-lg q-mb-xl shadow-1 formStyle">
          <q-card-section class="text-center q-pa-none">
            <q-btn class="text-grey-6 q-mb-md" @click="pageType = 'login'" flat>
              Already registered? Go to the login page.
            </q-btn>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                v-model="userFirst"
                type="text"
                label="First Name"
              />
              <q-input
                square
                filled
                v-model="userLast"
                type="text"
                label="Last Name"
              />
              <q-input
                square
                filled
                v-model="userDisplayName"
                type="text"
                label="Display Name"
                hint="If blank, we will use your first and last name."
              />
              <q-input square filled v-model="email" type="email" label="Email">
              </q-input>
              <span class="text-weight-bold text-size-caption q-ml-lg">
                You must use the same email that your invitation was sent to.
              </span>

              <q-input
                square
                filled
                v-model="verificationCode"
                type="text"
                label="Invitation Code"
              />
              <span class="text-weight-bold text-size-caption q-ml-lg">
                Enter the invitation code from email you received.
              </span>
              <q-input
                class="q-mb-sm"
                square
                filled
                v-model="userPassword"
                type="password"
                label="Password"
                hint="Maximum 20 characters."
              />
              <q-item-label>Password Strength </q-item-label>
              <q-linear-progress
                rounded
                :value="score"
                color="accent q-mt-lg"
                size="15px"
              >
              </q-linear-progress>
              <q-input
                square
                filled
                v-model="confirmPassword"
                type="password"
                label="Confirm Password"
              />
              <p v-if="passMatch === false">Passwords do not match.</p>
            </q-form>
          </q-card-section>
          <q-card-actions>
            <q-btn
              label="Sign Up"
              color="accent"
              @click="confirm = true"
              :disabled="score <= 0.75 || passMatch === false"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <!--START POLICY CONFIRMATION DIALOG-->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            icon="mdi-alert-circle"
            color="accent"
            text-color="white"
            class="q-mb-md"
          />
          <span class="q-ml-sm"
            >By continuing, you have reviewed and accept the Memories For Us
            Rules, Terms and Conditions and Privacy Policy as of today.
            <div>
              <router-link to="/policies" target="_blank"
                >Review Policies</router-link
              >
            </div></span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />

          <q-btn flat label="Accept" color="accent" @click="signup()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--ENDING POLICY CONFIRMATION DIALOG-->
    <!--ENDING REGISTATION PAGE-->
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import loginAction from "/src/actions/login.js";
import { useRouter } from "vue-router";
import { useUserStore } from "stores/user";
import { useQuasar, openURL } from "quasar";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
//import { propsToAttrMap } from "@vue/shared";

export default {
  components: {},
  setup() {
    const $q = useQuasar();
    const email = ref(null);
    const userFirst = ref(null);
    const userLast = ref(null);
    const userDisplayName = ref(null);
    const userPassword = ref(null);
    const confirmPassword = ref(null);
    const errorMsg = ref(null);
    const router = useRouter();
    const userState = useUserStore();
    const isPasswordStrong = ref(false);
    const scoreStrength = ref(null);
    const emailHint = ref(
      "You must use the same email addess as the one your invitation was sent to."
    );
    const confirm = ref(false);
    //    const playstoreMsg = ref(null);
    //    const myPlatform = ref($q.platform.is.mobile);
    const newUserID = ref(0);
    const verificationCode = ref(null);

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
      if (userPassword.value === null) {
        return 0;
      }

      var retScore = zxcvbn(userPassword.value).score;
      return zxcvbn(userPassword.value).score * 0.25;
    });

    const passMatch = computed(() => {
      if (userPassword.value !== confirmPassword.value) {
        var match = false;
      } else {
        var match = true;
      }
      return match;
    });

    onMounted(() => {});

    async function signup() {
      confirm.value = false;

      if (userFirst.value.length < 2 || userLast.value.length < 2) {
        errorMsg.value =
          "First and last name must be at least 2 characters each.";
        window.scrollTo(0, 0);
        return;
      }

      if (userPassword.value.length > 20) {
        errorMsg.value =
          "Your password must be less than 21 characters in length.";
        window.scrollTo(0, 0);
        return;
      }
      if (userDisplayName.value.length < 1) {
        userDisplayName.value = userFirst.value + " " + userLast.value;
      }

      if (verificationCode.value.length < 1) {
        errorMsg.value =
          "You must provide the invitation code from the email invitation your received.";
        window.scrollTo(0, 0);
        return;
      }

      await loginAction.dupCheck(email.value).then(async (dupcheck) => {
        if (dupcheck === "duplicate") {
          errorMsg.value = "This email address is already registered";
          window.scrollTo(0, 0);
          return;
        } else {
          await saveUser();
        }
      });
    }

    async function saveUser() {
      await loginAction
        .registerCharter(
          userFirst.value,
          userLast.value,
          userDisplayName.value,
          email.value,
          userPassword.value,
          verificationCode.value
        )
        .then((regResult) => {
          if (regResult !== "Success") {
            errorMsg.value =
              "Registration failed. Please try again or contact support.";
          }
          newUserID.value = regResult.UserID;
          router.replace({ path: "/newchartersuccess" });
        });
    }

    return {
      email,
      userFirst,
      userLast,
      userDisplayName,
      userPassword,
      confirmPassword,
      errorMsg,
      newUserID,
      isPasswordStrong,
      score,
      passMatch,
      signup,
      emailHint,
      confirm,
      verificationCode,
    };
  },
};
</script>

<style scoped>
.inputStyle {
  width: 95%;
}

.formStyle {
  width: 100%;
}

.bg-image {
  background-image: url(../../public/m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}
</style>
