<template>
  <q-page class="flex-center qpage bg-image text-accent">
    <!--STARTING SHARE GROUPS PAGE-->
    <div
      class="text-center text-h4 text-info flex-center cardTitle text-weight-bolder"
    >
      <q-avatar icon="mdi-connection" class="text-info"></q-avatar> Suggest an
      Interview Question
    </div>
    <div class="text-center text-h6 flex-center">
      <q-card class="col rounded-borders q-mb-md text-center feed-card">
        {{ submitMsg }}
        <div>
          <q-input
            v-model="suggestion"
            outlined
            color="secondary"
            label="Enter your suggestion here"
          ></q-input>
        </div>
        <q-card-actions>
          <q-btn @click="submitQuestion()">Submit</q-btn>
        </q-card-actions>
      </q-card>
      <div class="text-info bg-secondary text-subtitle1 feed-card">
        Suggestions for Interview questions will be rewarded to the first user
        to submit a question we use. Suggestions that are substantially similar
        will not count as a new question. Memories For Us reserves the right to
        determine which questions are alike and which questions will be used.
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import inviteActions from "../actions/invite"; //
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import memoryAction from "/src/actions/memories.js";

export default defineComponent({
  name: "SuggestQCPage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const suggestion = ref(null);
    const submitMsg = ref(null);

    onMounted(() => {});

    const submitQuestion = async () => {
      await memoryAction
        .saveInterviewSuggestion(user.UserID, suggestion.value)
        .then(() => {
          submitMsg.value = "Your suggestion has been submitted.";
          suggestion.value = null;
        });
    };

    return {
      suggestion,
      submitMsg,
      submitQuestion,
    };
  },
});
</script>
<style scoped>
.qc-card {
  width: 90%;
  padding-top: 15%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
  display: flex;
}

.cardSection {
  width: 90% !important;
  background-color: #bbb7a9;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 1.5em;
}

.cardEnd {
  width: 80% !important;
  background-color: #bbb7a9;
  margin-right: auto;
  margin-left: auto;
}
.cardTitle {
  width: 80% !important;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 1.5em;
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

.inputWidth {
  width: 90%;
}
</style>
