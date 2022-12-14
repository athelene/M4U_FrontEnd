<template>
  <q-page class="window-height window-width row justify-center bg-image">
    <!--STARTING LOGIN PAGE-->
    <div class="column" v-if="pageType === 'login'">
      {{ errorMsg }}
      <div class="row q-mt-lg">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                v-model="email"
                type="email"
                label="email"
              />
              <q-input
                square
                filled
                v-model="userPassword"
                type="password"
                label="password"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="accent"
              size="lg"
              class="full-width"
              label="Login"
              @click="login()"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <q-btn class="text-grey-6" @click="pageType = 'register'" flat
              >Not registered? Create an Account</q-btn
            >
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!--ENDING LOGIN PAGE-->

    <!--STARTING REGISTRATION PAGE-->
    <div class="column" v-if="pageType === 'register'">
      <q-card
        width="85%"
        style="background: radial-gradient(circle, #bbb7a9 0%, #006666 100%)"
      >
        <div class="text-h4 text-center">Save and Share Your Memories</div>
        <div class="text-h6 text-info text-center">
          Get your first 30 days free!
        </div>
        <div class="text-h6 text-info text-center">
          Just $3.50 per month after 30 days.
        </div>
        <div class="text-h6 text-info text-center">Cancel any time.</div>
      </q-card>
      <div class="text-h6" v-if="myPlatform === true">
        <q-card width="85%" class="q-pa-lg">
          <q-card-section>
            {{ playstoreMsg }}
            <a href="https://memoriesforus.com/register" target="blank"
              >https://memoriesforus.com/register</a
            >
          </q-card-section>
          <q-card-section>
            <q-btn class="text-grey-6 q-mb-md" @click="pageType = 'login'" flat>
              Already registered? Click here.
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
      <div class="text-h6">{{ errorMsg }}</div>
      <div class="row q-mt-lg" v-if="myPlatform !== true">
        <q-card square bordered class="q-pa-lg shadow-1" width="100%">
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
                label="Nickname"
                hint="If blank, we will use your first and last name."
              />
              <q-input
                square
                filled
                v-model="email"
                type="email"
                label="Email"
                :hint="emailHint"
              />
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
          <q-card-actions class="q-px-md">
            <q-btn
              label="Sign Up"
              color="primary"
              @click="confirm = true"
              v-if="score > 0.75 && passMatch === true"
            />
            <q-btn
              label="Sign Up"
              color="primary"
              @click="confirm = true"
              v-if="score <= 0.75 && passMatch === false"
              disabled="true"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <q-btn class="text-grey-6 q-mb-md" @click="pageType = 'login'" flat>
              Already registered? Go to the login page.
            </q-btn>
          </q-card-section>

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
                  >By continuing, you agree to pay $3.50 per month after 30 days
                  for our service until you cancel. You also confirm you have
                  reviewed and accept the Memories For Us Rules, Terms and
                  Conditions and Privacy Policy as of today.
                  <div>
                    <router-link to="/policies" target="_blank"
                      >Review Policies</router-link
                    >
                  </div></span
                >
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />

                <q-btn
                  flat
                  label="Continue to Payment"
                  color="accent"
                  @click="signup()"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <!--ENDING POLICY CONFIRMATION DIALOG-->
        </q-card>
      </div>
    </div>
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
    const pageType = ref("login");
    const isPasswordStrong = ref(false);
    const scoreStrength = ref(null);
    const emailHint = ref("E.g.: me@mydomain.com");
    const confirm = ref(false);
    const playstoreMsg = ref(null);
    const myPlatform = ref($q.platform.is.mobile);

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
      const hasValue = userPassword.value && userPassword.value.length > 0;

      if (!hasValue) {
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

    onMounted(() => {
      //     userState.userLogout();
      if ($q.platform.is.mobile) {
        playstoreMsg.value =
          "Due to app store restrictions, you must register for Memories For Us on our webpage at : ";

        pageType.value = "login";
      } else {
        playstoreMsg.value = null;
      }
    });

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
        .register(
          userFirst.value,
          userLast.value,
          userDisplayName.value,
          email.value,
          userPassword.value
        )
        .then((regResult) => {
          if (regResult !== "") {
            errorMsg.value =
              "Registration failed. Please try again or contact support.";
          }
          //   loginAction.checkoutPage(email.value);
        })
        .then(async () => {
          const sessionURL = await loginAction.checkoutPage(email.value);
          openURL(sessionURL);
        });
    }

    async function login() {
      if (email.value === null || userPassword.value === null) {
        errorMsg.value = "You must include a user name and password.";
        window.scrollTo(0, 0);
        return;
      }
      await loginAction
        .login(email.value, userPassword.value)
        .then((loginResult) => {
          if (loginResult === false) {
            errorMsg.value = "Invalid email or password";
            window.scrollTo(0, 0);
            return;
          }
          if (loginResult === "invalid usertype") {
            errorMsg.value =
              "Invalid Subscription Type. Please contact support.";
            window.scrollTo(0, 0);
            return;
          }
          if (loginResult === "user terminated") {
            errorMsg.value =
              "This account has been suspended. Please contact support.";
            window.scrollTo(0, 0);
            return;
          }
          if (loginResult === "payment problem") {
            errorMsg.value =
              "There is a problem with your subscription payment. Please contact support.";
            window.scrollTo(0, 0);
            return;
          }
          if (loginResult !== "false") {
            userState.userLogin(loginResult.user);
            userState.userToken(loginResult.token);
            window.localStorage.setItem("rt", loginResult.reauthToken);

            router.push({ path: "/home" });
          } else {
            errorMsg.value = "Invalid Login";
            window.scrollTo(0, 0);
          }
        });
    }

    return {
      login,
      email,
      userFirst,
      userLast,
      userDisplayName,
      userPassword,
      confirmPassword,
      errorMsg,
      pageType,
      isPasswordStrong,
      score,
      passMatch,
      signup,
      emailHint,
      confirm,
      playstoreMsg,
      myPlatform,
    };
  },
};
</script>

<style scoped>
.inputStyle {
  width: 95%;
}

.bg-image {
  background-image: url(../../public/m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}
</style>
