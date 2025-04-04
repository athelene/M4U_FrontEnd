<template>
  <q-btn-dropdown flat dense class="q-mr-xs" color="alert" icon="sort">
    <q-list>
      <q-item clickable v-close-popup @click="setSort('Item')">
        <q-item-section>
          <q-item-label>Alphanumeric</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="setSort('DueDate')">
        <q-item-section>
          <q-item-label>Due Date</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="setSort('ListItemID')">
        <q-item-section>
          <q-item-label>Create Date</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="setSort('ItemStatus')">
        <q-item-section>
          <q-item-label>Unchecked/Checked</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
  <q-list bordered separator>
    <q-item v-for="item in listItems" :key="item.ListItemID">
      <ListItemComponent
        :item="item"
        :listID="listID"
        @updateItems="getListItems"
      ></ListItemComponent>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted } from "vue";
import listActions from "../actions/lists";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import ListItemComponent from "src/components/listItemComponent.vue";

export default defineComponent({
  name: "ListItemCard",
  components: {
    // AddListItem,
    ListItemComponent,
  },
  props: {
    listID: {
      type: Number,
    },
    sortID: {
      type: String,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const isLoading = ref(true);
    const setStatus = ref(false);
    const listItems = ref([]);
    const listName = ref(null);
    const listOwner = ref(null);
    const listCircleRights = ref(null);
    const listAssigned = ref(null);
    const listDueDate = ref(null);
    const sort = ref(props.sortID);
    const sortID = ref("Item");

    onMounted(() => {
      getListItems(sort);
      getListDetails();
    });

    const setSort = async (sort) => {
      sortID.value = sort;
      getListItems();
      emit("updateSort");
    };

    const getListDetails = async () => {
      await listActions.getListDetails(props.listID).then((incomingList) => {
        listAssigned.value = incomingList.ListAssigned;
        listDueDate.value = incomingList.DueDate;
        listName.value = incomingList.ListName;
        listOwner.value = incomingList.ListOwner;
        listCircleRights.value = incomingList.ListCircleRights;
      });
    };

    const getListItems = async () => {
      listItems.value = [];
      await listActions
        .getListItems(props.listID, sortID.value)
        .then((items) => {
          items.forEach((item) => {
            listItems.value.push(item);
          });
        });
      emit("updateItems");
    };

    const closeListDialog = async () => {
      emit("closeListDialog");
    };

    return {
      isLoading,
      listItems,
      setStatus,
      getListItems,
      listName,
      listOwner,
      listCircleRights,
      listAssigned,
      listDueDate,
      user,
      closeListDialog,
      setSort,
    };
  },
});
</script>
<style scoped></style>
