<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h5 text-info">MANAGE INTERVIEW QUESTIONS</p>

        <q-btn icon="mdi-plus" @click="newQuestionDialogOpen()">New</q-btn>
      </div>

      <EditInterviewCard
        v-for="question in questions"
        :key="question.InterviewID"
        :questionProp="question"
        @updateQuestions="getQuestions()"
      ></EditInterviewCard>

      <!--Beginning of Add Question-->
      <q-dialog v-model="newQuestionDialog" persistent>
        <q-card style="min-width: 350px" class="text-info">
          <q-card-section>
            <div class="text-h6">New Question</div>
            <p>{{ errMsg }}</p>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              label="Enter question"
              v-model="newIntQuestion"
              autofocus
              value="What did you do to take care of yourself this week?"
            />

            <q-select
              filled
              v-model="selectedCategory"
              :options="categories"
              option-value="InterviewCatID"
              option-label="IntCategory"
              label="Category"
              emit-value
              map-options
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
import interviewActions from "../actions/interviews";
import EditInterviewCard from "../components/EditInterviewCard.vue";

export default defineComponent({
  name: "AdminQCPage",
  components: {
    EditInterviewCard,
  },
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const router = useRouter();

    const confirmDelete = ref(false);
    const errMsg = ref(null);
    const newQuestionDialog = ref(false);
    const newIntQuestion = ref(null);
    const newIntCategory = ref(null);
    const questions = ref(null);
    const categories = ref(null);
    const selectedCategory = ref(null);

    onMounted(() => {
      if (Number(userState.user.AdminLevel) !== 100) {
        router.push({ name: "home" });
      }
      getQuestions();
      getCategories();
    });

    const getQuestions = async () => {
      await interviewActions.getQuestions().then((result) => {
        questions.value = result;
      });
    };

    const getCategories = async () => {
      await interviewActions.getCategories().then((result) => {
        categories.value = result;
      });
    };

    const addQuestion = async () => {
      if (!newIntQuestion.value) {
        errMsg.value = "You must enter a question.";
      }

      await interviewActions
        .addQuestion(newIntQuestion.value, selectedCategory.value)
        .then(() => {
          newQuestionDialog.value = false;
        })
        .then(() => {
          getQuestions();
          newIntQuestion.value = null;
          newIntCategory.value = null;
        });
    };

    const newQuestionDialogOpen = async () => {
      newQuestionDialog.value = true;
    };

    return {
      addQuestion,
      categories,
      confirmDelete,
      errMsg,
      questions,
      getQuestions,
      newQuestionDialogOpen,
      newIntCategory,
      newIntQuestion,
      newQuestionDialog,
      selectedCategory,
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
  background-image: url(../../public/m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
}
</style>
