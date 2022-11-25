<template>
  <q-page class="window-height window-width row justify-center">
    <q-card square bordered class="q-pa-lg shadow-1">
      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input square filled v-model="email" type="email" label="email" />
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
          >Not reigistered? Create an Account</q-btn
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import loginAction from "/src/actions/login.js";
import { useRouter } from "vue-router";
import { useUserStore } from "stores/user";
import { useQuasar } from "quasar";
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
      console.log("starting login/registration page", $q.platform);
      if ($q.platform.is.mobile) {
        errorMsg.value =
          "Due to app store restrictions, you must register for Memories For Us on our webpage at memoriesforus.com/register.";
        pageType = "login";
      }
    });

    async function signup() {
      console.log("started signup");

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

      await loginAction
        .dupCheck(email.value)
        .then((dupcheck) => {
          if (dupcheck === "duplicate") {
            errorMsg.value = "This email address is already registered";
            window.scrollTo(0, 0);
            return;
          }
        })
        .then(() => {
          console.log("about to save user info");
          loginAction
            .register(
              userFirst.value,
              userLast.value,
              userDisplayName.value,
              email.value,
              userPassword.value
            )
            .then((regResult) => {
              console.log("regResult is: ", regResult);
              if (regResult !== "") {
                errorMsg.value =
                  "Registration failed. Please try again or contact support.";
              }
            });
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
          console.log("result from login is: ", loginResult);
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
            console.log(
              "userState  after Login on LoginPage is: ",
              userState.user
            );
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
    };
  },
};
</script>

<style scoped>
.inputStyle {
  width: 95%;
}
</style>
