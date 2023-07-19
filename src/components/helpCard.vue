<template>
  <div class="q-mb-md">
    <q-card vertical class="cardColor flat q-ma-md feed-card bg-secondary">
      <!--NEW MEDIA SECTION-->
      <q-card-section class="q-pt-md">
        <MediaCard :media="help" class="media-card"></MediaCard>
      </q-card-section>
      <!--END NEW MEDIA SECTION-->

      <!--START FULLSCREEN IMAGE DIALOG-->
      <q-dialog v-model="imageFullScreen">
        <q-card class="fullScreenImage">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6"></div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md">
            <MediaCard :media="help" class="media-card"></MediaCard>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!--END FULLSCREEN IMAGE DIALOG-->

      <!--START MEMORY DETAILS SECTION-->
      <q-card-section class="text-overline">
        <!-- {{ help.HelpTitle }}, {{ help.HelpDate }} -->
      </q-card-section>
      <!--STARTING THE DETAILS SECTION OF THE STORY CARD-->
      <q-card-section class="col-4 text-h3" @click="fullScreenDialog = true">
        <div class="text-h6 text-info q-mb-sm">
          <div v-html="help.HelpTitle" class="preview-text text-body1"></div>
        </div>
        <div class="preview-text">
          <div class="text-body1">
            <div v-html="help.HelpText" class="text-body1 text-accent"></div>
          </div>
        </div>
        <!--END MEMORY DETAILS SECTION-->
      </q-card-section>
      <!--  ENDING THE DETAILS SECTION OF THE STORY CARD -->
    </q-card>
    <q-separator horizontal />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import actions from "../actions/blobs";
import helpActions from "../actions/help";
import mediaActions from "../actions/blobs";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { Screen } from "quasar";
import MediaCard from "components/mediaCard.vue";

export default defineComponent({
  name: "HelpCard",
  components: { MediaCard },
  props: {
    help: {
      type: Object,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const storyURL = ref("");
    const imageFullScreen = ref(false);
    const imageHeight = ref(200);
    const scrollVisible = ref(true);
    const fullScreenDialog = ref(false);
    const maximizedToggle = ref(true);
    // const helpTypeID = ref(props.help.HelpTypeID);
    const reauthToken = window.localStorage.getItem("rt");
    const helpRecord = ref(props.help);
    const helpSasKey = ref(null);
    const progress = ref(false);

    onMounted(() => {
      //     getHelpSasKey();

      //    getSasKey();

      //   getMedia();

      console.log("props are: ", props);

      if (Screen.xs === true) {
        imageHeight.value = "100px";
      }
      if (Screen.sm === true) {
        imageHeight.value = "200px";
      }
      if (Screen.md === true) {
        imageHeight.value = "200px";
      }
      if (Screen.lg === true) {
        imageHeight.value = "300px";
      }
      if (Screen.xl === true) {
        imageHeight.value = "500px";
      }
    });

    const toggleImage = () => {
      imageFullScreen.value = !imageFullScreen.value;
    };

    const handleFileUpload = async () => {
      progress.value = true;
      openCameraDialog.value = false;
      let formData = new FormData();
      formData.append("file", qUploadFle.value);
      formData.append("userID", user.UserID);
      formData.append("storyID", props.story.StoryID);
      formData.append("reauthToken", reauthToken);
      await mediaActions
        .addNewBlob(formData)
        .then((ret) => {
          progress.value = false;
          qUploadFle.value = null;
        })
        .then(() => {
          getMedia();
        });
    };

    return {
      user,
      token,
      isLoggedIn,
      storyURL,
      helpRecord,
      imageHeight,
      imageFullScreen,
      toggleImage,
      scrollVisible,
      fullScreenDialog,
      maximizedToggle,
      //      setHelpType,
      //    helpTypeID,
      handleFileUpload,
      progress,
    };
  },
});
</script>
<style scoped>
.feed-card {
  width: 90%;
  margin: auto;
}
.qc-card {
  width: 90%;
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
  background-color: #bbb7a9;
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

.media-card {
  height: 25%;
}
.commentDiv {
  width: 85%;
  background-color: #bbb7a9;
  border-radius: 3px;
}

.commentHeader {
  font-weight: bold;
}

.preview-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.titleInput {
  width: 100%;
}
</style>
