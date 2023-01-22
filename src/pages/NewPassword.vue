<template>
  <q-page class="window-height window-width row justify-center bg-image">
    <!--STARTING CHARTER REGISTRATION PAGE-->
    <div class="column">
      <q-card
        v-if="success === false"
        width="85%"
        style="background: radial-gradient(circle, #bbb7a9 0%, #006666 100%)"
      >
        <div class="text-h4 text-center">Forgot Password</div>
        <div class="text-h6 text-info text-center" v-if="success === true">
          Enter your new password below.
        </div>
      </q-card>
      <div class="text-h6">{{ errorMsg }}</div>
      <div class="text-h6 text-center" v-if="success !== true">
        "The time period for resetting your password has expired.

        <q-btn flat to="/">Click Here to Try Again</q-btn>.
      </div>
      <div v-if="success === false"></div>
      <div class="q-mt-lg">
        <q-card
          square
          bordered
          class="q-pa-lg q-mb-xl shadow-1 formStyle"
          width="85%"
          v-if="success === true && finished !== true"
        >
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                class="q-mb-sm"
                square
                filled
                v-model="userPassword"
                type="password"
                label="New Password"
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
              label="Change Password"
              color="accent"
              @click="resetPassword()"
              :disabled="score <= 0.75 || passMatch === false"
            />
          </q-card-actions>
        </q-card>

        <q-card
          square
          bordered
          class="q-pa-lg q-mb-xl shadow-1 formStyle"
          v-if="finished === true"
        >
          <q-card-section>
            <div>Your password has been changed.</div>
            <div><q-btn flat to="/">Click here to log in.</q-btn></div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!--ENDING REGISTATION PAGE-->
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import loginAction from "/src/actions/login.js";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "stores/user";
import { useQuasar, openURL } from "quasar";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import zxcvbnEnPackage from "@zxcvbn-ts/language-en";
//import { propsToAttrMap } from "@vue/shared";

export default {
  components: {},
  setup() {
    const route = useRoute();
    const $q = useQuasar();
    const userPassword = ref(null);
    const confirmPassword = ref(null);
    const errorMsg = ref(null);
    const success = ref();
    const finished = ref(false);
    const router = useRouter();
    const userState = useUserStore();
    const isPasswordStrong = ref(false);
    const scoreStrength = ref(null);

    const verificationCode = ref(null);
    const verified = ref(false);
    const email = ref(null);

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

    onMounted(() => {
      if (route.query.verifyCode) {
        verificationCode.value = route.query.verifyCode;
      } else {
        console.log("no verifyCode found");
      }

      if (route.query.email) {
        email.value = route.query.email;
      } else {
        console.log("no email found");
      }
      verify();
    });

    //Verify the code
    async function verify() {
      console.log("incoming email is: ", email.value);
      await loginAction
        .resetCheck(email.value, verificationCode.value)
        .then((result) => {
          console.log("result from check is: ", result);
          if (result === "Valid") {
            success.value = true;
          }
          if (result === "Expired") {
            success.value = false;
          }
        });
    }

    //Save new password
    async function resetPassword() {
      await loginAction
        .resetPassword(email.value, userPassword.value)
        .then((regResult) => {
          console.log("result from resetPasswrd is: ", regResult);
          if (regResult !== "successful") {
            errorMsg.value =
              "Update failed. Please try again or contact support.";
          }
          if (regResult === "successful") {
            finished.value = true;
          }

          //         router.replace({ path: "/newchartersuccess" });
        });
    }

    return {
      email,
      userPassword,
      confirmPassword,
      errorMsg,
      finished,
      isPasswordStrong,
      score,
      passMatch,
      resetPassword,
      success,
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
