<template>
  <q-page class="window-height window-width row justify-center">
    <div class="column">
      {{ errorMsg }}
      <div class="row q-mt-lg">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            Sign up for your 30 day free trial. Then pay just $3.50 per month to
            stay connected.

            <div>
              <q-btn flat @click="submitPayment">Order Now</q-btn>
            </div>
          </q-card-section>
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
import { StripeCheckout } from "@vue-stripe/vue-stripe";

export default {
  name: "NewUser",

  setup() {
    const user = ref("");
    const userPassword = ref(null);
    const errorMsg = ref(null);
    const router = useRouter();
    const userState = useUserStore();
    const publishablekey = process.env.STRIPEPUBKEY;
    const loading = ref(false);
    const lineItems = [
      {
        price: "price_1LO359HFAFg3qnZAq9DcqhCg",
        quantity: 1,
      },
    ];
    const successURL = "www.memoriesforus.com/#/newsubscribersuccess";
    const cancelURL = "www.memoriesforus.com/#/newsubscribercancel";

    onMounted(() => {});

    async function submitPayment() {
      ref(checkoutRef.redirectToCheckout());
    }

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
      publishablekey,
      lineItems,
      successURL,
      cancelURL,
      user,
      userPassword,
      errorMsg,
      submitPayment,
    };
  },
};
</script>

<style scoped>
.inputStyle {
  width: 95%;
}
</style>
