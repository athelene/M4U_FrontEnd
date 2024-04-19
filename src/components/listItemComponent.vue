<template>
  <q-item>
    <q-item-section>
      <q-item-label>
        <div class="text-h6">
          <ListItemCheck
            v-if="listOwner === user.UserID || listCircleRights === 'W'"
            :itemID="item.ListItemID"
            :itemStatus="item.ItemStatus"
          ></ListItemCheck>
          {{ item.Item }}
        </div>
      </q-item-label>
      <q-item-label>
        <div
          class="text-subtitle2"
          v-if="item.DueDate !== '' && listDueDate === 1"
        >
          {{ item.DueDate }}
        </div>
        <q-item-section>
          <div class="text-subtitle2">
            <span v-if="item.AssignedTo && listAssigned === 1">
              Assigned to: {{ item.AssignedTo }}</span
            >
          </div>
        </q-item-section>
      </q-item-label>
      <q-item-label>
        {{ item.Notes }}
      </q-item-label>
      <q-item-label>
        <q-btn
          flat
          icon="mdi-pencil"
          size="sm"
          v-if="listOwner === user.UserID || listCircleRights === 'W'"
          @click="editDialog()"
        ></q-btn>
        <q-btn
          flat
          v-if="listOwner === user.UserID || listCircleRights === 'W'"
          icon="delete"
          size="sm"
          @click="confirmItemDeleteDialog()"
        ></q-btn>
      </q-item-label>
    </q-item-section>
    <q-dialog v-model="itemDeleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm"
            >Are you sure you want to delete this item?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="primary"
            @click="deleteItem(item.ListItemID)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="itemEditDialog" persistent>
      <div class="q-mb-md">
        <q-card vertical class="cardColor flat q-ma-md feed-card">
          <!--START LIST ITEM DETAILS SECTION-->
          <q-card-section v-if="newItemErrMsg !== null">
            <h6>{{ newItemErrMsg }}</h6></q-card-section
          >
          <q-card-section>
            <q-form>
              <q-list>
                <q-item>
                  <q-input
                    label="Item Title"
                    class="titleInput"
                    v-model="newItemName"
                  ></q-input>
                </q-item>

                <q-item v-if="listAssigned === 1">
                  <q-input
                    label="Assigned To"
                    class="titleInput"
                    v-model="newAssigned"
                  ></q-input>
                </q-item>
                <q-item>
                  <q-input
                    label="Notes"
                    class="titleInput"
                    v-model="newNotes"
                  ></q-input>
                </q-item>
                <q-item v-if="listDueDate === 1">
                  <q-input filled v-model="newSelectedDate" label="YYYY-MM-DD">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            mask="YYYY-MM-DD"
                            v-model="newSelectedDate"
                            years-in-month-view
                            today-btn
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item>
              </q-list>
            </q-form>
          </q-card-section>

          <q-card-actions>
            <q-btn flat @click="editItemCancel()">Cancel</q-btn>
            <q-btn flat @click="editItemSave()">Save</q-btn>
          </q-card-actions>
        </q-card>
        <q-separator horizontal />
      </div>
    </q-dialog>
  </q-item>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted } from "vue";
import listActions from "../actions/lists";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import ListItemCheck from "src/components/listItemCheck.vue";

export default defineComponent({
  name: "ListItemComponent",
  components: {
    ListItemCheck,
  },
  props: {
    item: {
      type: Object,
    },
    listID: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const isLoading = ref(true);
    //  const setStatus = ref(false);
    const listItems = ref([]);
    const statusDone = ref(true);
    const statusOpen = ref(false);
    const itemDeleteDialog = ref(false);
    const listName = ref(null);
    const listOwner = ref(null);
    const listCircleRights = ref(null);
    //  const openAddItem = ref(false);
    const listAssigned = ref(null);
    const listDueDate = ref(null);
    const SeeNotes = ref(false);
    const newItemName = ref(null);
    const newAssigned = ref(null);
    const newNotes = ref(null);
    const newSelectedDate = ref(null);
    const itemEditDialog = ref(false);
    const newItemErrMsg = ref(null);
    const useAssigned = ref(0);
    const useDueDate = ref(0);

    onMounted(() => {
      getListDetails();
      newSelectedDate.value = props.item.DueDate;
      newItemName.value = props.item.Item;
      newAssigned.value = props.item.AssignedTo;
      newNotes.value = props.item.Notes;
    });

    const confirmItemDeleteDialog = async () => {
      itemDeleteDialog.value = true;
    };
    const editDialog = async () => {
      itemEditDialog.value = true;
    };

    const editItemCancel = async () => {
      itemEditDialog.value = false;
    };

    const getListDetails = async () => {
      await listActions.getListDetails(props.listID).then((incomingList) => {
        listAssigned.value = incomingList.ListAssigned;
        listDueDate.value = incomingList.ListDate;
        listName.value = incomingList.ListName;
        listOwner.value = incomingList.ListOwner;
        listCircleRights.value = incomingList.ListCircleRights;
      });
    };

    const editItemSave = async () => {
      if (!newSelectedDate.value) {
        newSelectedDate.value = "";
      }
      if (!newAssigned.value) {
        newAssigned.value = "";
      }
      if (!newNotes.value) {
        newAssigned.value = "";
      }
      if (newItemName.value === null) {
        newItemErrMsg.value = "You must provide an item name.";
        return;
      }
      if (newItemName.value.length < 1) {
        newItemErrMsg.value = "You must provide an item name.";
        return;
      }

      await listActions
        .editItem(
          newItemName.value,
          newSelectedDate.value,
          newAssigned.value,
          newNotes.value,
          props.listID,
          props.item.ListItemID
        )
        .then(() => {
          newItemErrMsg.value = null;
          itemEditDialog.value = false;
          emit("updateItems");
          //     emit("closedListDialog");
        });
    };

    const markItemOpen = async (itemID) => {
      await listActions.markItemOpen(itemID, user.UserID);
    };

    const markItemDone = async (itemID) => {
      await listActions.markItemDone(itemID, user.UserID);
    };

    const deleteItem = async (itemID) => {
      await listActions.deleteItem(itemID).then(() => {
        itemDeleteDialog.value = false;
        emit("updateItems");
      });
    };
    const closeListDialog = async () => {
      emit("closeListDialog");
    };

    return {
      isLoading,
      listItems,
      statusDone,
      statusOpen,
      markItemOpen,
      markItemDone,
      deleteItem,
      itemDeleteDialog,
      confirmItemDeleteDialog,
      listName,
      listOwner,
      listCircleRights,
      listAssigned,
      listDueDate,
      user,
      closeListDialog,
      SeeNotes,
      newItemName,
      newAssigned,
      newNotes,
      newSelectedDate,
      itemEditDialog,
      editDialog,
      newItemErrMsg,
      editItemCancel,
      useAssigned,
      useDueDate,
      editItemSave,
    };
  },
});
</script>
<style scoped></style>
