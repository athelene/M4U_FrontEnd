<template>
  <div class="relative-center" id="list">
    <q-list bordered separator class="justify-center groupList">
      <q-item-section>
        <q-item v-ripple>
          <q-item-section> {{ editIntCategory }} </q-item-section>
          <q-item-section>
            <q-btn flat @click="editQuestionDialogOpen()">
              {{ editIntQuestion }}
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
                <div class="text-h6">Edit Interview Question</div>
              </q-card-section>

              <p class="text-h6">{{ errMsg }}</p>
              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  label="Enter question"
                  v-model="editIntQuestion"
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
                  {{ editIntQuestion }}?</span
                >
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Delete"
                  color="primary"
                  @click="deleteQuestion(editInterviewID)"
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
import interviewActions from "../actions/interviews";

export default defineComponent({
  name: "EditInterviewCard",
  props: {
    questionProp: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);

    const categories = ref(null);
    const selectedCategory = ref(props.questionProp.CategoryID);
    const editQuestionDialog = ref(false);
    const editIntCategory = ref(props.questionProp.IntCategory);
    const editIntQuestion = ref(props.questionProp.IntQuestion);
    const editInterviewID = ref(props.questionProp.InterviewID);
    const confirmDelete = ref(false);
    const errMsg = ref(null);

    onMounted(() => {
      getCategories();
    });

    const editQuestion = async () => {
      if (editIntQuestion.value.length < 1) {
        errMsg.value = "You must enter a question.";
        return;
      } else {
        errMsg.value = null;
      }
      await interviewActions
        .editQuestion(
          editInterviewID.value,
          editIntQuestion.value,
          selectedCategory.value
        )
        .then((result) => {
          editQuestionDialog.value = false;
          emit("updateQuestions");
        });
    };

    const editQuestionDialogOpen = async () => {
      editQuestionDialog.value = true;
    };

    const getCategories = async () => {
      await interviewActions.getCategories().then((result) => {
        categories.value = result;
      });
    };

    const deleteQuestion = async (editInterviewID) => {
      await interviewActions.deleteQuestion(editInterviewID).then(() => {
        confirmDelete.value = false;
        editQuestionDialog.value = false;
        emit("updateQuestions");
      });
    };
    return {
      categories,
      selectedCategory,
      editQuestion,
      editQuestionDialog,
      editQuestionDialogOpen,
      deleteQuestion,
      editInterviewID,
      editIntQuestion,
      editIntCategory,
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
