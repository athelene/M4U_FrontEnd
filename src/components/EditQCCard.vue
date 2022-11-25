<template>
  <div class="relative-center" id="list">
    <q-list bordered separator class="justify-center groupList">
      <q-item-section>
        <q-item v-ripple>
          <q-item-section v-if="editViewPointDay === 'Sunday'">
            Sun, {{ editViewPointDate }}
          </q-item-section>
          <q-item-section v-if="editViewPointDay === 'Monday'">
            Mon, {{ editViewPointDate }}
          </q-item-section>
          <q-item-section v-if="editViewPointDay === 'Tuesday'">
            Tue, {{ editViewPointDate }}
          </q-item-section>
          <q-item-section v-if="editViewPointDay === 'Wednesday'">
            Wed, {{ editViewPointDate }}
          </q-item-section>
          <q-item-section v-if="editViewPointDay === 'Thursday'">
            Thu, {{ editViewPointDate }}
          </q-item-section>
          <q-item-section v-if="editViewPointDay === 'Friday'">
            Fri, {{ editViewPointDate }}
          </q-item-section>
          <q-item-section v-if="editViewPointDay === 'Saturday'">
            Sat, {{ editViewPointDate }}
          </q-item-section>
          <q-item-section>
            <q-btn flat @click="editQuestionDialogOpen()">
              {{ editViewPointQ }}
            </q-btn>
          </q-item-section>
          <q-item-section>
            <q-btn flat @click="confirmDelete = true">
              <q-icon name="mdi-delete"></q-icon>
            </q-btn>
          </q-item-section>
          <q-separator />

          <!--Beginning of Edit Question-->
          <q-dialog v-model="editQuestionDialog" persistent>
            <q-card style="min-width: 350px" class="text-info">
              <q-card-section>
                <div class="text-h6">Edit Question</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div>
                  <q-input
                    dense
                    label="Display Date"
                    v-model="editViewPointDate"
                    autofocus
                    class="q=mr-sm"
                  />
                </div>
              </q-card-section>
              <p class="text-h6">{{ errMsg }}</p>
              <!--SUNDAY QUESTION-->
              <q-card-section
                class="q-pt-none"
                v-if="editViewPointDay === 'Sunday'"
              >
                <q-input
                  dense
                  label="Enter question"
                  v-model="editViewPointQ"
                  hint="What did you do to take care of yourself this week?"
                />
              </q-card-section>
              <!--MONDAY QUESTION-->
              <q-card-section
                class="q-pt-none"
                v-if="editViewPointDay === 'Monday'"
              >
                <q-input
                  dense
                  v-model="editViewPointQ"
                  label="Enter Question"
                  hint="What was your best meal last week?"
                />
              </q-card-section>
              <!--TUESDAY QUESTION-->
              <q-card-section
                class="q-pt-none"
                v-if="editViewPointDay === 'Tuesday'"
              >
                <q-input
                  dense
                  v-model="editViewPointQ"
                  label="Tuesday Trivia"
                  hint="Tuesday Trivia"
                />
              </q-card-section>
              <!--WEDNESDAY QUESTION-->
              <q-card-section
                class="q-pt-none"
                v-if="editViewPointDay === 'Wednesday'"
              >
                <q-input
                  dense
                  v-model="editViewPointQ"
                  label="Word Wednesday"
                  hint="Word Wednesday"
                />
              </q-card-section>
              <!--THURSDAY QUESTION-->
              <q-card-section
                class="q-pt-none"
                v-if="editViewPointDay === 'Thursday'"
              >
                <q-input
                  dense
                  v-model="editViewPointQ"
                  hint="What are you thankful for today?"
                />
              </q-card-section>
              <!--FRIDAY QUESTION-->
              <q-card-section
                class="q-pt-none"
                v-if="editViewPointDay === 'Friday'"
              >
                <q-input
                  dense
                  v-model="editViewPointQ"
                  label="Favorite Friday"
                  hint="Favorite Friday"
                />
              </q-card-section>
              <!--SATURDAY QUESTION-->
              <q-card-section
                class="q-pt-none"
                v-if="editViewPointDay === 'Saturday'"
              >
                <q-input
                  dense
                  v-model="editViewPointQ"
                  label="Sports Saturday"
                  hint="Sports Saturday"
                />
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Save Changes" @click="editQuestion()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--end of Edit Dialog -->
          <!--Beginning of delete confirmation Dialog-->
          <q-dialog v-model="confirmDelete" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar
                  icon="mdi-delete-alert-outline"
                  color="negative"
                  text-color="white"
                />
                <span class="q-ml-sm"
                  ><div>
                    Are you sure you want to permenantly delete the question:
                  </div>
                  {{ editViewPointQ }}?</span
                >
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Delete"
                  color="primary"
                  @click="deleteQuestion(editViewPointID)"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--end of delete confirmation Dialog-->

          <q-separator />
        </q-item>
      </q-item-section>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import qcActions from "../actions/quickConnect";

export default defineComponent({
  name: "EditQCCard",
  props: {
    questionProp: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);

    const weekday = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const editQuestionDialog = ref(false);
    const editViewPointDate = ref(null);
    const editViewPointDay = ref(null);
    const editViewPointQ = ref(props.questionProp.ViewPointQ);
    const editViewPointID = ref(props.questionProp.ViewPointID);
    const confirmDelete = ref(false);
    const errMsg = ref(null);

    onMounted(() => {
      var dd = Number(props.questionProp.ViewPointDate.slice(3, 5));
      if (dd < 10) {
        dd = "0" + dd;
      }
      var mm = Number(props.questionProp.ViewPointDate.slice(0, 2));
      if (mm < 10) {
        mm = "0" + mm;
      }
      var yyyy = props.questionProp.ViewPointDate.slice(6, 10);
      var d = new Date(yyyy, mm, dd);
      editViewPointDate.value = yyyy + "-" + mm + "-" + dd;
      editViewPointDay.value = weekday[d.getDay()];
    });

    watch(editViewPointDate, (val, oldval) => {
      var dd = Number(val.slice(8, 10));
      var mm = Number(val.slice(5, 7));
      var yyyy = Number(val.slice(0, 4));
      var d = new Date(yyyy, mm, dd);
      editViewPointDay.value = weekday[d.getDay()];
    });

    const editQuestion = async () => {
      if (editViewPointQ.value.length < 1) {
        errMsg.value = "You must enter a question.";
        return;
      } else {
        errMsg.value = null;
      }
      await qcActions
        .editQuestion(
          editViewPointID.value,
          editViewPointQ.value,
          editViewPointDate.value,
          userState.user.UserID
        )
        .then((result) => {
          console.log("done running edit quetions: ", result);
          editQuestionDialog.value = false;
          emit("updateQuestions");
        });
    };

    const editQuestionDialogOpen = async () => {
      editQuestionDialog.value = true;
    };

    const deleteQuestion = async (vpID) => {
      await qcActions.deleteQuestion(vpID).then(() => {
        confirmDelete.value = false;
        editQuestionDialog.value = false;
        emit("updateQuestions");
      });
    };
    return {
      editQuestion,
      editQuestionDialog,
      editQuestionDialogOpen,
      deleteQuestion,
      editViewPointID,
      editViewPointDate,
      editViewPointQ,
      editViewPointDay,
      confirmDelete,
      errMsg,
    };
  },
});
</script>
<style scoped>
.imageBtn {
  background-color: #fefbee;
}
</style>
