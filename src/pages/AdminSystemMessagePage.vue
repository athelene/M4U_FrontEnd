<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING ADMIN QC PAGE which allows admin to manage the quick connect questions-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h5 text-info">MANAGE SYSTEM MESSAGES</p>

        <!-- <q-btn icon="mdi-calendar-question" @click="newQuestionDialogOpen()"
          >New</q-btn
        > -->
      </div>

      <EditQCCard
        v-for="question in questions"
        :key="question.ViewPointID"
        :questionProp="question"
        @updateQuestions="getQuestions()"
      ></EditQCCard>

      <!--Beginning of Add Question-->
      <q-dialog v-model="newQuestionDialog" persistent>
        <q-card style="min-width: 350px" class="text-info">
          <q-card-section>
            <div class="text-h6">New Question</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div>
              <q-input
                dense
                label="Display Date"
                v-model="newViewPointDate"
                autofocus
                class="q=mr-sm"
              />
            </div>
          </q-card-section>

          <!--SUNDAY QUESTION-->
          <q-card-section class="q-pt-none" v-if="newViewPointDay === 'Sunday'">
            <q-input
              dense
              label="Enter question"
              v-model="newViewPointQ"
              autofocus
              value="What did you do to take care of yourself this week?"
            />
          </q-card-section>
          <!--MONDAY QUESTION-->
          <q-card-section class="q-pt-none" v-if="newViewPointDay === 'Monday'">
            <q-input
              dense
              v-model="newViewPointQ"
              label="Enter Question"
              hint="What was your best meal last week?"
            />
          </q-card-section>
          <!--TUESDAY QUESTION-->
          <q-card-section
            class="q-pt-none"
            v-if="newViewPointDay === 'Tuesday'"
          >
            <q-input dense v-model="newViewPointQ" label="Tuesday Trivia" />
          </q-card-section>
          <!--WEDNESDAY QUESTION-->
          <q-card-section
            class="q-pt-none"
            v-if="newViewPointDay === 'Wednesday'"
          >
            <q-input dense v-model="newViewPointQ" label="Word Wednesday" />
          </q-card-section>
          <!--THURSDAY QUESTION-->
          <q-card-section
            class="q-pt-none"
            v-if="newViewPointDay === 'Thursday'"
          >
            <q-input
              dense
              v-model="newViewPointQ"
              hint="What are you thankful for today?"
            />
          </q-card-section>
          <!--FRIDAY QUESTION-->
          <q-card-section class="q-pt-none" v-if="newViewPointDay === 'Friday'">
            <q-input dense v-model="newViewPointQ" label="Favorite Friday" />
          </q-card-section>
          <!--SATURDAY QUESTION-->
          <q-card-section
            class="q-pt-none"
            v-if="newViewPointDay === 'Saturday'"
          >
            <q-input
              dense
              v-model="newViewPointQ"
              label="Sports Saturday"
              hint="Sports Saturday"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Add question" @click="addQuestion()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--end of Add Question-->
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import qcActions from "../actions/quickConnect";
import EditQCCard from "../components/EditQCCard.vue";

export default defineComponent({
  name: "AdminQCPage",
  components: {
    EditQCCard,
  },
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const router = useRouter();

    const confirmDelete = ref(false);
    const newQuestionDialog = ref(false);
    const newViewPointDate = ref(null);
    const newViewPointDay = ref(null);
    const newViewPointQ = ref(null);
    const questions = ref(null);
    const retrieveBlock = ref(30);
    const todayIs = ref(null);
    const startDate = ref(todayIs);

    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    onMounted(() => {
      if (Number(userState.user.AdminLevel) !== 100) {
        router.push({ name: "home" });
      }
      getToday().then(() => {
        getAllQuestions();
      });
    });

    watch(newViewPointDate, (val, oldval) => {
      //This watch variable see when the admin has changed the date field and fills in the appropriate question for
      //days where a set question has been established.
      var dd = Number(val.slice(8, 10));
      var mm = Number(val.slice(5, 7)) - 1;
      var yyyy = Number(val.slice(0, 4));
      var d = new Date(yyyy, mm, dd);
      newViewPointDay.value = weekday[d.getDay()];
      if (newViewPointDay.value === "Monday") {
        newViewPointQ.value = "What was your best meal last week?";
        return;
      }
      if (newViewPointDay.value === "Thursday") {
        newViewPointQ.value = "What are you grateful for today?";
        return;
      }
      if (newViewPointDay.value === "Sunday") {
        newViewPointQ.value =
          "What will you do to take care of yourself this week?";
        return;
      }
      newViewPointQ.value = null;
    });

    const getAllQuestions = async () => {
      //gets questions from most recent date in quantity determined in const retrieveBlock above
      await qcActions
        .getQuestions("2999-12-31", retrieveBlock.value)
        .then((result) => {
          questions.value = result;
        });
    };

    const getQuestions = async () => {
      //gets questions from the date given by the user in quantity determined in const
      //retrieveBlock above
      await qcActions
        .getQuestions(startDate.value, retrieveBlock.value)
        .then((result) => {
          questions.value = result;
        });
    };

    const addQuestion = async () => {
      //allows an admin to ad a Quick Connect question
      if (!newViewPointDate.value) {
        errMsg.value = "You must enter a date.";
      }
      if (!newViewPointQ.value) {
        errMsg.value = "You must enter a question.";
      }

      await qcActions
        .addQuestion(
          newViewPointDate.value,
          newViewPointQ.value,
          userState.user.UserID
        )
        .then(() => {
          newQuestionDialog.value = false;
        })
        .then(() => {
          getAllQuestions();
          newViewPointQ.value = null;
          newViewPointDay.value = null;
        });
    };

    const newQuestionDialogOpen = async () => {
      newQuestionDialog.value = true;
      var today = new Date(questions.value[0].ViewPointDate);
      var dd = String(today.getDate() + 1).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      newViewPointDate.value = yyyy + "-" + mm + "-" + dd;
      var d = today.setDate(today.getDate());
      var nextd = new Date(d + 1000 * 60 * 60 * 24);
      newViewPointDay.value = weekday[nextd.getDay()];
      setQuestionValues();
    };

    const getToday = async () => {
      var today = new Date();
      var dd = String(today.getDate() + 1).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      todayIs.value = yyyy + "-" + mm + "-" + dd;
      getQuestions(startDate.value, todayIs.value);
      setQuestionValues();
    };

    const setQuestionValues = async () => {
      if (newViewPointDay.value === "Monday") {
        newViewPointQ.value = "What was your best meal last week?";
      }
      if (
        newViewPointDay.value === "Tuesday" ||
        newViewPointDay.value === "Wednesday" ||
        newViewPointDay.value === "Friday" ||
        newViewPointDay.value === "Saturday"
      ) {
        newViewPointQ.value = null;
      }
      if (newViewPointDay.value === "Thursday") {
        newViewPointQ.value = "What are you grateful for today?";
      }

      if (newViewPointDay.value === "Sunday") {
        newViewPointQ.value =
          "What will you do to take care of yourself this week?";
      }
    };

    return {
      addQuestion,
      confirmDelete,
      questions,
      getQuestions,
      newQuestionDialogOpen,
      newViewPointDate,
      newViewPointDay,
      newViewPointQ,
      newQuestionDialog,
      retrieveBlock,
      startDate,
      todayIs,
    };
  },
});
</script>
<style scoped>
.qc-card {
  width: 85%;
  margin-top: 10%;
  padding-top: 15%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
}

.feed-card {
  width: 75%;
  margin: auto;
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

.groupList {
  width: 100%;
  font-size: 1.25em;
}
</style>
