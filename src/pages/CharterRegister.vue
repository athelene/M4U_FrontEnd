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
      <div class="text-h6 text-negative">{{ errorMsg }}</div>
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
                :type="isPwd ? 'password' : 'text'"
                label="Password"
                hint="Use upper and lowercase, numbers, symbols or make it
                longer. Fewer common words. Maximum 30 characters."
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  /> </template
              ></q-input>
              <q-linear-progress
                rounded
                :value="score"
                :color="scoreColor"
                size="15px"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="accent"
                    :label="scoreLabel"
                  />
                </div>
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
            <div class="text-h6 text-negative">{{ errorMsg }}</div>
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
          <q-inner-loading
            :showing="spinner"
            label="Please wait..."
            label-class="text-teal"
            label-style="font-size: 1.1em"
          />
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

export default {
  components: {},
  setup() {
    const $q = useQuasar();
    const email = ref(null);
    const userFirst = ref(null);
    const userLast = ref(null);
    const userDisplayName = ref(null);
    const userPassword = ref(null);
    const isPwd = ref(true);
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
    const spinner = ref(false);
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
      //Checks that the user has added a password. Then uses zxcvbn to evaluate and return the strength
      //of the password
      if (userPassword.value === null) {
        return 0;
      }

      var retScore = zxcvbn(userPassword.value).score;
      return zxcvbn(userPassword.value).score * 0.25;
    });

    const scoreLabel = computed(() => {
      //Sets the text of the error message if the password is too week
      if (score.value <= 0.25) {
        var secScore = "Weak password.";
      } else if (score.value > 0.025 && score.value <= 0.5) {
        var secScore = "Better, not there yet.";
      } else if (score.value > 0.5 && score.value < 1) {
        var secScore = "Almost!";
      } else if (score.value >= 1) {
        var secScore = "Great password!";
      }
      return secScore;
    });

    const scoreColor = computed(() => {
      // Sets the color of the error text based on the strength of the password
      if (score.value === 0) {
        var secColor = "red-10";
      } else if (score.value > 0 && score.value <= 0.25) {
        var secColor = "orange-10";
      } else if (score.value > 0.025 && score.value <= 0.5) {
        var secColor = "orange-5";
      } else if (score.value > 0.5 && score.value < 1) {
        var secColor = "yellow-3";
      } else if (score.value === 1) {
        var secColor = "light-green-5";
      }
      return secColor;
    });

    const passMatch = computed(() => {
      //confirms the user has typed the password consistently two times
      if (userPassword.value !== confirmPassword.value) {
        var match = false;
      } else {
        var match = true;
      }
      return match;
    });

    onMounted(() => {});

    async function signup() {
      spinner.value = true;
      errorMsg.value = null;
      if (userFirst.value.length < 2 || userLast.value.length < 2) {
        errorMsg.value =
          "First and last name must be at least 2 characters each.";
        window.scrollTo(0, 0);
        spinner.value = false;
        confirm.value = false;
        return;
      }

      if (userPassword.value.length > 30) {
        errorMsg.value =
          "Your password must be less than 31 characters in length.";
        window.scrollTo(0, 0);
        spinner.value = false;
        confirm.value = false;
        return;
      }
      if (userDisplayName.value.length < 1) {
        userDisplayName.value = userFirst.value + " " + userLast.value;
      }

      if (verificationCode.value.length < 1) {
        errorMsg.value =
          "You must provide the invitation code from the email invitation your received.";
        window.scrollTo(0, 0);
        spinner.value = false;
        confirm.value = false;
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
      //if dupcheck succeeds, saves user into database with fields user provided
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
          if (regResult === "Success") {
            spinner.value = false;
            router.replace({ path: "/newchartersuccess" });
          } else {
            errorMsg.value =
              "Registration failed. Please try again or contact support.";
            spinner.value = false;
            confirm.value = false;
            return;
          }
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
      isPasswordStrong,
      isPwd,
      score,
      passMatch,
      signup,
      spinner,
      scoreLabel,
      scoreColor,
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
  background-image: url(../../m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}
</style>
