<template>
  <q-avatar rounded>
    <img :src="mediaURL" />
  </q-avatar>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import mediaActions from "../actions/blobs";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "AvatarCard",
  props: {
    userMediaLoc: {
      type: String,
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
      await mediaActions.getSasKey(props.userMediaLoc).then((sasKey) => {
        mediaURL.value = sasKey;
      });
    };

    return {
      mediaURL,
    };
  },
});
</script>
<style scoped>
.imageBtn {
  background-color: #fefbee;
}
</style>
