<template>
  <div class="q-mb-md text-accent">
    <div class="text-center text-h5">
      <router-link v-if="!todaysQuestion" to="/quickconnect"
        >QuickConnect</router-link
      >
    </div>

    <q-card vertical class="cardColor flat q-ma-md feed-card bg-secondary">
      <q-card-section
        class="text-center q-mt-none q-mb-none"
        v-if="todaysQuestion"
        >{{ todaysQuestion }}
      </q-card-section>
      <q-card-section
        v-if="qcIsAnswered === false && todaysQuestionID > 0"
        horizontalclass="q-mt-none q-mb-none"
      >
        <q-input v-model="myAnswer" label="Your answer">
          <template v-slot:append>
            <q-icon
              name="mdi-check-bold"
              @click="saveAnswer()"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section
        v-if="qcIsAnswered === true"
        class="text-center q-mt-none q-mb-none"
      >
        <span class="text-h8">Me: {{ myAnswer }} </span>
        <q-btn
          flat
          size="xs"
          icon="mdi-pencil-outline"
          @click="qcIsAnswered = !qcIsAnswered"
        ></q-btn>
      </q-card-section>
      <q-card-section v-if="qcTotal > 0" class="text-center">
        <q-btn
          v-if="seeAnswersBtnLabel === 'open'"
          flat
          size="sm"
          icon="mdi-arrow-down"
          label="Answers"
          class="accent"
          @click="seeAnswers()"
        >
          <q-badge
            color="positive"
            floating
            text-color="black"
            :label="qcTotal"
            v-if="qcTotal > 0"
          ></q-badge
        ></q-btn>
        <q-btn
          v-if="seeAnswersBtnLabel === 'closed'"
          flat
          size="sm"
          label="Close"
          icon="mdi-arrow-up"
          class="accent"
          @click="seeAnswers()"
        >
        </q-btn>
      </q-card-section>
      <div v-if="seeAnswersFlag === true">
        <q-card-section
          class="text-center"
          v-for="answer in circleAnswers"
          :key="answer.VPAnswerID"
        >
          <span class="text-h8 text-weight-bold"
            >{{ answer.UserDisplayName }}:
          </span>
          <span class="text-h8">{{ answer.VPAnswer }} </span>
        </q-card-section>
      </div>
    </q-card>
    <q-separator horizontal />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted, computed } from "vue";
import qcActions from "../actions/quickConnect";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { Screen } from "quasar";

export default defineComponent({
  name: "QcCard",

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const todayIs = ref("");
    const circleAnswers = reactive([]);
    const qcTotal = ref(0);
    const emptyArray = [];
    const todaysQuestion = ref("");
    const todaysQuestionID = ref(0);
    const myAnswer = ref("");
    const vpAnswerID = ref(0);
    const qcIsAnswered = ref(false);
    const seeAnswersFlag = ref(false);
    const seeAnswersBtnLabel = ref("open");

    onMounted(() => {
      getTodaysDate();
      getTodaysQC();
      getCircleAnswersToday();
      getMyQCAnswerToday();
    });

    const getTodaysDate = async () => {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      todayIs.value = yyyy + "-" + mm + "-" + dd;
    };

    const getTodaysQC = async () => {
      const quickconnects = await qcActions
        .getTodaysQuickConnect(todayIs.value)
        .then((todaysQc) => {
          if (todaysQc.ViewPointID === 0) {
            todaysQuestion.value =
              "There isn't a Quick Connect Question today. Submit a suggestion and get a free month!";
          } else {
            todaysQuestion.value = todaysQc.ViewPointQ;
            todaysQuestionID.value = todaysQc.ViewPointID;
          }
        });
    };

    const getMyQCAnswerToday = async () => {
      await qcActions
        .getMyQCAnswerToday(user.UserID, todayIs.value)
        .then((myAnswerRet) => {
          if (myAnswerRet.length !== 0) {
            myAnswer.value = myAnswerRet[0].VPAnswer;
            vpAnswerID.value = myAnswerRet[0].VPAnswerID;
            qcIsAnswered.value = true;
          }
        });
    };

    const saveAnswer = async (VPAnswerID) => {
      await qcActions
        .saveMyAnswer(todaysQuestionID.value, myAnswer.value, user.UserID)
        .then(async () => {
          await getMyQCAnswerToday();
        });
    };

    const seeAnswers = async () => {
      if (seeAnswersFlag.value === false) {
        getCircleAnswersToday();
        seeAnswersFlag.value = true;
        seeAnswersBtnLabel.value = "closed";
      } else {
        seeAnswersFlag.value = false;
        seeAnswersBtnLabel.value = "open";
      }
    };

    const getCircleAnswersToday = async () => {
      await qcActions
        .getCircleAnswersToday(user.UserID, todayIs.value)
        .then((circleAnswerRet) => {
          qcTotal.value = circleAnswerRet.length;
          Object.assign(circleAnswers, circleAnswerRet);
        });
    };

    return {
      user,
      getCircleAnswersToday,
      todayIs,
      qcTotal,
      todaysQuestion,
      todaysQuestionID,
      myAnswer,
      saveAnswer,
      qcIsAnswered,
      seeAnswers,
      seeAnswersFlag,
      circleAnswers,
      seeAnswersBtnLabel,
    };
  },
});
</script>
<style scoped>
.feed-card {
  width: 85%;
  margin: auto;
}
.qc-card {
  width: 85%;
  margin: auto;
  background-color: #e9f7f4;
}

.video-wrapper {
  position: relative;
  padding-bottom: 20%;
  height: 0;
}

.video {
  display: block;
  max-width: 100%;
}

.cardColor {
  background-color: #fefbee;
}

.mediaBackground {
  background-color: #92b498;
}

.fullScreenImage {
  width: 100%;
}

.scrollArea {
  height: 75px;
}

.feed-card {
  width: 75%;
  margin: auto;
}

.commentDiv {
  width: 85%;
  background-color: #bbb7a9;
  border-radius: 3px;
}

.commentHeader {
  font-weight: bold;
}

.titleInput {
  width: 100%;
}
</style>
