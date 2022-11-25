<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY A SINGLE BOOK - BOOK ID SENT FROM INDEXPAGE-->
  <div class="q-mb-md">
    <q-card vertical class="cardColor flat q-ma-md feed-card">
      <!--NEW MEDIA SECTION-->

      <!--START BOOK DETAILS SECTION-->
      <q-card-section class="text-overline"
        >{{ book.BookTitle }}, {{ book.UserDisplayName }}
        <q-btn
          class="text-accent"
          flat
          round
          icon="mdi-pencil-outline"
          @click="openEditMemory()"
          v-if="story.Userid === user.UserID"
        ></q-btn>
        <q-btn
          class="text-accent"
          flat
          round
          icon="mdi-delete-forever-outline"
          v-if="story.Userid === user.UserID"
          @click="verifyDelete()"
        ></q-btn>

        <!--DIALOG TO VERIFY DELETING A MEMORY-->
        <q-dialog v-model="verifyDeleteDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <span class="q-ml-sm"
                >CAUTION! Are you sure you want to delete this memory?</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                flat
                label="Permenantly Delete"
                color="primary"
                @click="deleteMemory()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-section>

      <q-card-actions class="justify-between"> </q-card-actions>
    </q-card>
    <q-separator horizontal />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import actions from "../actions/blobs";
import bookActions from "../actions/books";
import memoryActions from "../actions/memories";
import mediaActions from "../actions/blobs";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { Screen } from "quasar";
import MediaCardEdit from "components/mediaCardEdit.vue";
import MediaCard from "components/mediaCard.vue";

export default defineComponent({
  name: "BookCard",
  components: {},
  props: {
    book: {
      type: Object,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);

    const circleList = reactive([]);
    const verifyDeleteDialog = ref(false);
    const reauthToken = window.localStorage.getItem("rt");

    onMounted(() => {
      getCircleList();
    });

    const getCircleList = async () => {
      await memoryActions.getMyCircles(user.UserID).then((circles) => {
        circles.forEach((circle) => {
          circleList.push(circle);
        });
      });
    };

    const verifyDelete = async () => {
      verifyDeleteDialog.value = !verifyDeleteDialog.value;
    };

    return {
      user,
      token,
      isLoggedIn,
      storyURL,
      imageHeight,
      imageFullScreen,
      toggleImage,
      scrollVisible,
      heartTotal,
      heartStatus,
      changeHeartStatus,
      commentTotal,
      newComment,
      commentDialog,
      openCommentDialog,
      addComment,
      commentsOpen,
      comments,
      deleteComment,
      fullScreenDialog,
      maximizedToggle,
      newTitle,
      newInterviewee,
      newIngredients,
      newText,
      newCircleID,
      newHidden,
      editMemoryOpen,
      badDataMessage,
      setStoryType,
      storyTypeID,
      circleList,
      cancelEditMemory,
      draftCheck,
      updateMemory,
      saveDraft,
      slideList,
      startSlide,
      verifyDeleteDialog,
      deleteMemory,
      verifyDelete,
      newSlideList,
      newStartSlide,
      newSlideCount,
      openEditMemory,
      handleFileUpload,
      openCameraDialog,
      qUploadFle,
      startCameraDialog,
      getMedia,
      booksDialogFlag,
      openBookDialog,
      bookList,
      noBookMsg,
      updateBooks,
      openTraditions,
      openInterviews,
      traditionsFlag,
      interviewsFlag,
      traditionList,
      interviewList,
      getInterviews,
      setInterviews,
      getTraditions,
      setTraditions,
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
