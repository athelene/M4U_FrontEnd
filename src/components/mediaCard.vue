<template>
  <div class="text-center" style="width: 100%">
    <!-- IMAGE -->
    <div
      class="row justify-center cardColor q-mt-xs"
      v-if="media.MediaType === 2"
    >
      <q-img
        :src="mediaURL"
        oncontextmenu="return false;"
        fit="fill"
        class="image-size"
        @click="imageFullScreen = !imageFullScreen"
      >
        <template v-slot:loading>
          <div class="accent">
            <q-spinner-ios />
            <div class="q-mt-md">Loading...</div>
          </div>
        </template>
      </q-img>
    </div>
    <!--VIDEO-->

    <div class="row justify-center" v-if="media.MediaType === 1">
      <video
        :height="videoHeight"
        controls
        controlsList="nodownload video"
        :src="mediaURL"
        class="video"
      ></video>
    </div>

    <!--START FULLSCREEN IMAGE DIALOG-->
    <q-dialog v-model="imageFullScreen" full-height full-width>
      <q-card class="fullScreenImage">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6"></div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="imageFullScreen = !imageFullScreen"
          />
        </q-card-section>

        <q-card-section>
          <q-img
            :src="mediaURL"
            height="100%"
            fit="contain"
            responsive
            fullscreen
          >
            <template v-slot:loading>
              <div class="accent">
                <q-spinner-ios />
                <div class="q-mt-md">Loading...</div>
              </div>
            </template>
          </q-img>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import mediaActions from "../actions/blobs";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { Screen } from "quasar";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "MediaCard",
  props: {
    media: {
      type: Object,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const mediaURL = ref("");
    const imageFullScreen = ref(false);
    const videoHeight = ref(400);

    onMounted(() => {
      getSasKey();

      // if (Screen.xs === true) {
      //   videoHeight.value = "140";
      // }
      // if (Screen.sm === true) {
      //   videoHeight.value = "400";
      // }
      // if (Screen.md === true) {
      //   videoHeight.value = "350";
      // }
      // if (Screen.lg === true) {
      //   videoHeight.value = "450";
      // }
      // if (Screen.xl === true) {
      //   videoHeight.value = "500";
      // }
    });

    const getSasKey = async () => {
      await mediaActions.getSasKey(props.media.MediaLoc).then((sasKey) => {
        mediaURL.value = sasKey;
      });
    };

    return {
      mediaURL,
      imageFullScreen,
      screen,
      videoHeight,
    };
  },
});
</script>
<style scoped>
.imageBtn {
  background-color: #fefbee;
}

.image-size {
  width: 100%;
  max-width: 400px;
  height: auto;
}
</style>
