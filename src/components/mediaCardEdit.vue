<template>
  <q-card class="q-mt-md text-center">
    <div
      class="row justify-center cardColor q-pa-lg"
      v-if="media.MediaType === 2"
    >
      <q-img :src="mediaURL" style="height: 75px" fit="contain">
        <template v-slot:loading>
          <div class="accent">
            <q-spinner-ios />
            <div class="q-mt-md">Loading...</div>
          </div>
        </template>
      </q-img>
    </div>
    <!--VIDEO-->
    <div class="row justify-center videoWrapper" v-if="media.MediaType === 1">
      <video
        height="300"
        controls
        controlsList="nodownload video"
        :src="mediaURL"
        class="video"
      ></video>
    </div>
    <q-card-actions>
      <q-btn
        flat
        label="Delete"
        color="accent"
        @click="deleteMedia(media.MediaLoc)"
      ></q-btn>
      <q-space></q-space>
      <q-btn
        v-if="media.FeatureMedia !== 1"
        flat
        label="Make Feature"
        color="accent"
        @click="featureMedia(media.MediaLoc)"
      ></q-btn>
      <span class="text-accent" v-if="media.FeatureMedia === 1">FEATURED</span>
    </q-card-actions>
  </q-card>
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

    onMounted(() => {
      getSasKey();
    });

    const getSasKey = async () => {
      await mediaActions.getSasKey(props.media.MediaLoc).then((sasKey) => {
        mediaURL.value = sasKey;
      });
    };

    const deleteMedia = async (mediaLoc) => {
      await mediaActions.deleteMedia(mediaLoc).then(() => {
        emit("updateMedia");
      });
    };

    const featureMedia = async (mediaLoc) => {
      await mediaActions.makeFeature(mediaLoc).then(() => {
        emit("updateMedia");
      });
    };

    return {
      mediaURL,
      deleteMedia,
      featureMedia,
    };
  },
});
</script>
<style scoped>
.imageBtn {
  background-color: #fefbee;
}
</style>
