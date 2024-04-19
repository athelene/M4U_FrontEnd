<template>
  <q-checkbox
    v-model="status"
    @click="markItemStatus(itemID)"
    color="accent"
  ></q-checkbox>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted } from "vue";
import listActions from "../actions/lists";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "ListItemCheck",
  props: {
    itemID: {
      type: Number,
    },
    itemStatus: {
      type: Number,
    },
  },

  setup(props) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const status = ref(false);

    onMounted(() => {
      if (props.itemStatus === 0) {
        status.value = false;
      } else {
        status.value = true;
      }
    });

    const markItemStatus = async () => {
      if (status.value === false) {
        await listActions.markItemOpen(props.itemID, user.UserID);
      }
      if (status.value === true) {
        await listActions.markItemDone(props.itemID, user.UserID);
      }
    };

    return {
      status,
      markItemStatus,
    };
  },
});
</script>
<style scoped>
.imageBtn {
  background-color: #fefbee;
}
</style>
