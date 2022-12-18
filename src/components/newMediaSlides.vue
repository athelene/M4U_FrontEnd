<template>
  <!--NEW MEDIA SECTION-->
  <q-card-section>
    <q-carousel
      v-model="newStartSlide"
      transition-prev="slide-right"
      transition-next="slide-left"
      swipeable
      animated
      control-color="accent"
      navigation
      padding
      arrows
      height="250px"
      class="mediaBackground flat shadow-1 rounded-borders"
    >
      <q-carousel-slide
        :name="slide.MediaID"
        autoplay="true"
        class="column no-wrap flex-center"
        v-for="slide in newSlides"
        :key="slide.MediaID"
      >
        <MediaCard
          :media="slide"
          :editFlag="editFlag"
          :storyID="storyID"
          :refreshMedia="refreshMedia"
        ></MediaCard>
        <div class="absolute-top-right custom-caption transparent">
          <q-btn
            icon="mdi-delete-alert-outline"
            color="blue"
            @click="deleteMedia(slide.MediaLoc)"
          ></q-btn>
        </div>
      </q-carousel-slide>
    </q-carousel>
    slideCount is: {{ slideCount }}
  </q-card-section>
  <!--END NEW MEDIA SECTION-->
</template>

<script>
import { defineComponent, reactive, nextTick } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed, watch } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import MediaCard from "components/mediaCard.vue";
import actions from "../actions/blobs";
import mediaActions from "../actions/blobs";

export default defineComponent({
  name: "NewMediaSlides",
  components: { MediaCard },
  props: {
    feature: {
      type: Number,
    },
    editFlag: {
      type: String,
    },
    storyID: {
      type: Number,
    },
    slideCount: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const newStartSlide = ref(0);
    const newSlides = [];
    const emptySlides = [];
    const newSlideCount = ref(0);

    watch(
      () => props.slideCount,
      (newValue) => {
        refreshMedia();
      }
    );

    onMounted(() => {
      updateMedia();
    });

    const refreshMedia = async () => {
      updateMedia();
    };

    const deleteMedia = async (mediaLoc) => {
      await mediaActions.deleteMedia(mediaLoc);
    };

    const updateMedia = async () => {
      Object.assign(newSlides, emptySlides);
      await actions
        .getMedia(props.storyID)
        .then((newMedia) => {
          Object.assign(newSlides, newMedia);
          newSlideCount.value = newSlides.length;
          newStartSlide.value = newSlides[0].MediaID;

          newMedia.forEach((media) => {
            if (media.FeatureMedia === 1) {
              newStartSlide.value = media.MediaID;
            }
          });
        })
        .then(() => {
          nextTick(() => {
            console.log("ran nextTick");
          });
        });
    };

    return {
      newStartSlide,
      newSlides,
      updateMedia,
      newSlideCount,
      refreshMedia,
      deleteMedia,
    };
  },
});
</script>
<style scoped></style>
