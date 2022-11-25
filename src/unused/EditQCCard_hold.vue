<template>
  <div class="relative-center" id="list">
    <q-list bordered separator class="justify-center groupList">
      <q-item-section>
        <q-item
          clickable
          v-ripple
          @click="
            editQuestionDialogOpen(
              question.ViewPointDate,
              question.ViewPointQ,
              question.ViewPointID
            )
          "
        >
          <q-item-section v-if="question.ViewPointDay === 1">
            Sun, {{ question.ViewPointDate }}
          </q-item-section>
          <q-item-section v-if="question.ViewPointDay === 2">
            Mon, {{ question.ViewPointDate }}
          </q-item-section>
          <q-item-section v-if="question.ViewPointDay === 3">
            Tue, {{ question.ViewPointDate }}
          </q-item-section>
          <q-item-section v-if="question.ViewPointDay === 4">
            Wed, {{ question.ViewPointDate }}
          </q-item-section>
          <q-item-section v-if="question.ViewPointDay === 5">
            Thu, {{ question.ViewPointDate }}
          </q-item-section>
          <q-item-section v-if="question.ViewPointDay === 6">
            Fri, {{ question.ViewPointDate }}
          </q-item-section>
          <q-item-section v-if="question.ViewPointDay === 7">
            Sat, {{ question.ViewPointDate }}
          </q-item-section>
          <q-item-section>
            {{ question.ViewPointQ }}
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

              <!--SUNDAY QUESTION-->
              <q-card-section
                class="q-pt-none"
                v-if="editViewPointDay === 'Sunday'"
              >
                <q-input
                  dense
                  label="Enter question"
                  v-model="editViewPointQ"
                  autofocus
                  value="What did you do to take care of yourself this week?"
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
                <q-btn flat label="Edit question" @click="editQuestion()" />
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
                  {{ question.ViewPointQ }}?</span
                >
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Delete"
                  color="primary"
                  @click="deleteQuestion(question.ViewPointID)"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--end of delete confirmation Dialog-->
        </q-item>
      </q-item-section>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

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

    const editQuestionDialog = ref(false);
    const editViewPointDate = ref(props.questionProp.ViewPointDate);
    const editViewPointDay = ref(null);
    const editViewPointQ = ref(props.questionProp.ViewPointQ);
    const editViewPointID = ref(props.questionProp.ViewPointID);

    onMounted(() => {
      console.log("question is: ", props);
    });

    watch(editViewPointDate, (val1, oldval) => {
      console.log("starting edit watch value is: ", val1, oldval);
      var dd = Number(val1.slice(8, 10));
      var mm = Number(val1.slice(5, 7)) - 1;
      var yyyy = Number(val1.slice(6, 11));
      var d = new Date(yyyy, mm, dd);
      editViewPointDay.value = weekday[d.getDay()];
      console.log("editViewPointDay.value = ", d, editViewPointDay.value);
    });

    const editQuestion = async () => {
      if (editGroupName.value.length < 1) {
        groupNameErrrMsg.value = "You must enter a name for the group.";
        return;
      }
      await groupActions
        .editGroup(editGroupID.value, editGroupName.value)
        .then(() => {
          editGroupDialog.value = false;
          getGroups();
        });
    };

    const editQuestionDialogOpen = async (
      ViewPointDate,
      ViewPointQ,
      ViewPointID
    ) => {
      console.log("dialog will open", ViewPointDate, ViewPointQ, ViewPointID);
      editQuestionDialog.value = true;
      var editday = new Date(ViewPointDate);
      var dd = String(editday.getDate() + 1).padStart(2, "0");
      var mm = String(editday.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = editday.getFullYear();
      editViewPointDate.value = yyyy + "-" + mm + "-" + dd;
      editViewPointDay.value = weekday[editday.getDay()];
      editQuestionDialog.value = true;
      editViewPointDate.value = ref(ViewPointDate);
      editViewPointQ.value = ref(ViewPointQ);
      editViewPointID.value = ref(ViewPointID);
    };

    const deleteQuestion = async (vpID) => {
      await qcActions.deleteQuestion(vpID).then(() => {
        confirmDelete.value = false;
        editQuestionDialog.value = false;
        getAllQuestions();
      });
    };

    return {
      deleteQuestion,
      editQuestion,
      editQuestionDialog,
      editQuestionDialogOpen,
      editViewPointDate,
      editViewPointDay,
      editViewPointQ,
      editViewPointID,
    };
  },
});
</script>
<style scoped>
.imageBtn {
  background-color: #fefbee;
}
</style>
