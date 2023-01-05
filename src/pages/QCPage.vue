<template>
  <q-page class="flex-center qpage bg-image">
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h5 text-info">
          QUICK CONNECT QUESTIONS
          <q-icon
            name="mdi-information-outline"
            size="xs"
            @click="getInfo = true"
          ></q-icon>
        </p>
        <q-btn label="Suggest a Question" flat to="suggestqc"></q-btn>

        <q-dialog v-model="getInfo">
          <q-card>
            <q-card-section>
              <!-- <div class="text-h6">Quick Connect</div> -->
            </q-card-section>

            <q-card-section class="q-pt-none">
              <p class="text-h6">
                Quick Connect questions are designed to keep you in touch with
                the people you care about everyday. They are fun and positive
                and take just seconds to answer. You can visit this page to see
                older questions and answers from your connections. You can also
                edit your previous answers here.
              </p>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <p class="text-h5">{{ errMsg }}</p>
      </div>

      <q-list bordered separator class="groupList">
        <div
          v-for="q in questionList"
          :key="q.VPID"
          class="text-center relative-center"
        >
          <q-expansion-item
            style="width: 90%"
            switch-toggle-side
            expand-separator
            :label="q.ViewPointQ"
            @show="getAnswers(q.ViewPointID)"
            group="groupA"
            dense
            :caption="q.ViewPointDate"
            id="expansionItem"
          >
            <q-card-section id="cardsection">
              <q-list bordered style="width: 100%">
                <q-item>
                  <span id="theSpanForMe" style="width: 100%">
                    <q-item>
                      <q-input
                        type="textarea"
                        dense
                        hint="Answer"
                        v-model="editAnswerInput"
                        autofocus
                        autogrow
                        prefix="Me:"
                        style="width: 100%"
                      >
                        <template v-slot:append>
                          <q-btn
                            flat
                            icon="mdi-check"
                            @click="saveMyAnswer('s', q.ViewPointID)"
                          ></q-btn>
                        </template>
                      </q-input>
                    </q-item>
                  </span>
                </q-item>
                <q-item
                  v-for="a in answerList"
                  :key="a.VPAnswerID"
                  class="text-info"
                  id="qItem"
                >
                  <span
                    v-if="a.UserID !== user.UserID"
                    style="width: 100%"
                    id="theSpanForOther"
                  >
                    <q-item>
                      <q-item-section>
                        <q-item-label dense
                          >{{ a.UserDisplayName }} :

                          <span class="text-black"> {{ a.VPAnswer }}</span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </span>
                </q-item>
              </q-list>
            </q-card-section>
          </q-expansion-item>
        </div>
      </q-list>

      <div class="q-pa-lg flex flex-center">
        <q-pagination
          v-model="current"
          :max="maxPages"
          direction-links
        ></q-pagination>
      </div>
      <!--Beginning of Edit Answer Dialog-->
      <q-dialog v-model="editAnswerDialog" persistent> stuff </q-dialog>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import qcActions from "../actions/quickConnect";

export default defineComponent({
  name: "QCPage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const editAnswerDialog = ref(false);
    const editVPID = ref(null);
    const editAnswerInput = ref(null);
    const editAnswerID = ref(null);
    const errMsg = ref(null);
    const getInfo = ref(false);
    const questionList = ref(null);
    const questionCount = ref(null);
    const questionStart = ref(0);
    const answerList = ref(null);
    const current = ref(1);
    const maxPages = ref(0);
    const questionLength = ref(20);
    const editSection = ref(false);

    onMounted(() => {
      getQuestionCount();
      getQuestionChunk();
    });

    watch(current, (val, oldval) => {
      newChunk();
    });

    const getQuestionCount = async () => {
      await qcActions.getQuestionCount().then((count) => {
        questionCount.value = count.QuestionCount;
        maxPages.value = Math.ceil(count.QuestionCount / questionLength.value);
      });
    };

    const getQuestionChunk = async () => {
      await qcActions
        .getQuestionChunk(questionStart.value, questionLength.value)
        .then((questions) => {
          questionList.value = questions;
        });
    };

    const newChunk = async () => {
      questionStart.value = (current.value - 1) * questionLength.value;
      getQuestionChunk();
    };

    const getAnswers = async (questionID) => {
      editAnswerInput.value = null;
      answerList.value = null;
      await qcActions
        .getAnswers(user.UserID, questionID)
        .then((answers) => {
          answerList.value = answers;
        })
        .then(() => {
          qcActions.getMyAnswer(user.UserID, questionID).then((myanswer) => {
            myanswer.forEach((element) => {
              if (element.UserID === user.UserID) {
                editAnswerInput.value = myanswer[0].VPAnswer;
                editAnswerID.value = myanswer[0].VPAnswerID;
              } else {
                editAnswerInput.value = null;
                editAnswerID.value = null;
              }
            });
          });
        });
    };

    const getMyAnswer = async (vpID) => {
      await qcActions.getMyAnswer(vpID, user.UserID).then((myanswer) => {
        editAnswerInput.value = myanswer;
      });
    };

    const saveMyAnswer = async (type, answerID) => {
      if (editAnswerID.value) {
        await qcActions.updateMyAnswer(
          editAnswerID.value,
          editAnswerInput.value,
          user.UserID
        );
      }
      if (!editAnswerID.value) {
        await qcActions.saveMyAnswer(
          answerID,
          editAnswerInput.value,
          user.UserID
        );
      }
    };

    const editAnswerOpen = async (viewPointID) => {
      getAnswers();
    };

    return {
      answerList,
      current,
      getInfo,
      getQuestionChunk,
      getAnswers,
      getMyAnswer,
      questionList,
      editAnswerInput,
      maxPages,
      saveMyAnswer,
      editAnswerOpen,
      editAnswerDialog,
      editSection,
      errMsg,
      newChunk,
      user,
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

.inputClass {
  width: 85%;
}

.bg-image {
  background-image: url(../../public/m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
  text-align: center;
}

.textInfo {
  width: 95%;
}
</style>
