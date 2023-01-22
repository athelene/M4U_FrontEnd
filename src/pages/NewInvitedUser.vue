<template>
  <q-page class="window-height window-width row justify-center">
    <div class="column">
      {{ errorMsg }}
      <div class="row q-mt-lg">
        <q-card square bordered class="q-pa-lg shadow-1">
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
                v-model="email"
                type="email"
                label="Email"
              />
              <q-input
                square
                filled
                v-model="userPassword"
                type="password"
                label="Password"
              />
              <q-input
                square
                filled
                v-model="confirmPassword"
                type="password"
                label="Confirm Password"
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
            <p class="text-grey-6">
              Already reigistered? Go to the login page.
            </p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import loginAction from "/src/actions/login.js";
import { useRouter } from "vue-router";
import { useUserStore } from "stores/user";

export default {
  setup() {
    const user = ref("");
    const userPassword = ref(null);
    const errorMsg = ref(null);
    const router = useRouter();
    const userState = useUserStore();

    onMounted(() => {});

    async function login() {
      if (user.value === null || userPassword.value === null) {
        errorMsg.value = "You must include a user name and password.";
        return;
      }
      await loginAction
        .login(user.value, userPassword.value)
        .then((loginResult) => {
          if (loginResult === false) {
            errorMsg.value = "Invalid email or password";
            return;
          }
          if (loginResult === "invalid usertype") {
            errorMsg.value =
              "Invalid Subscription Type. Please contact support.";
            return;
          }
          if (loginResult === "user terminated") {
            errorMsg.value =
              "This account has been suspended. Please contact support.";
            return;
          }
          if (loginResult === "payment problem") {
            errorMsg.value =
              "There is a problem with your subscription payment. Please contact support.";
            return;
          }
          if (loginResult !== "false") {
            userState.userLogin(loginResult.user);
            userState.userToken(loginResult.token);
            window.localStorage.setItem("rt", loginResult.reauthToken);
            router.push({ path: "/home" });
          } else {
            errorMsg.value = "Invalid Login";
          }
        });
    }

    return {
      login,
      user,
      userPassword,
      errorMsg,
    };
  },
};
</script>

<style scoped>
.inputStyle {
  width: 95%;
}
</style>
