<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY A SINGLE LIST - LIST ID SENT FROM INDEXPAGE-->
  <!--START OF LIST CARDS-->
  <div class="listCardHeight">
    <q-card :class="listClass" clickable @click="openListDispDialog()">
      <q-icon name="checklist" size="md"></q-icon>
      <div class="text-subtitle1 ellipsis-3-lines">
        {{ listName }}
      </div>
    </q-card>

    <!--  START OF LIST DIALOG -->
    <q-dialog v-model="listDialog" full-width full-height>
      <q-card class="bg-primary">
        <!--START EDIT LIST DIALOG-->
        <q-dialog v-model="editListDialog" persistent>
          <q-card style="min-width: 350px">
            <EditList :listID="listID" @listEdited="updateList"></EditList>
          </q-card>
        </q-dialog>
        <!--END EDIT LIST DIALOG -->

        <!--START CONFIRM DELETE LIST DIALOG-->
        <q-dialog v-model="listDeleteConfirmOpen" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar
                color="negative"
                text-color="white"
                icon="mdi-alert-circle"
              />
              <span class="q-ml-sm"
                >Are you sure you want to delete
                {{ listName }} permanently?</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                @click="deleteList(listID)"
                flat
                label="Delete"
                color="primary"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!--END CONFIRM DELETE LIST DIALOG-->

        <!--START CONFIRM COMPLETED ITEM DELETE  DIALOG-->
        <q-dialog v-model="moveDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <span class="q-ml-sm"
                >Select the list you want to move these items to.</span
              >
            </q-card-section>

            <q-card-section>
              <q-list bordered separator>
                <q-item
                  clickable
                  v-ripple
                  v-for="selectList in allListsList"
                  :key="selectList.ListID"
                  @click="setupMove(listID, selectList.ListID)"
                >
                  <q-item-section>
                    <q-btn color="primary" :label="selectList.ListName">
                    </q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
          <!--MOVE CONFIRMATION DIALOG-->
          <q-dialog v-model="confirmMoveDialog" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar
                  color="negative"
                  text-color="white"
                  icon="mdi-alert-circle"
                />
                <span class="q-ml-sm"
                  >Are you sure you want to move these items?</span
                >
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Move Items"
                  color="primary"
                  @click="moveItems()"
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--END MOVE CONFIRMATION DIALOG-->

          <!--END MOVE DIALOG-->
        </q-dialog>

        <!--END CONFIRM DELETE LIST DIALOG-->

        <!--START MOVE TO ANOTHER LIST DIALOG-->
        <q-dialog v-model="completedDeleteConfirmOpen" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar
                color="negative"
                text-color="white"
                icon="mdi-alert-circle"
              />
              <span class="q-ml-sm"
                >Are you sure you want to delete all completed items
                permanently?</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                @click="deleteCompletedItems(listID)"
                flat
                label="Delete Completed Items"
                color="primary"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!--END MOVE TO ANOTHER LIST DIALOG-->

        <!--START ADD ITEM DIALOG-->
        <q-dialog v-model="openAddItem">
          <q-card>
            <AddListItem
              :listID="listID"
              :dueDate="listDueDate"
              :assigned="listAssigned"
              @itemAdded="itemAdded"
              @itemUpdated="itemAdded"
            ></AddListItem>
          </q-card>
        </q-dialog>
        <!--END ADD ITEM DIALOG -->

        <!--START THE LIST OF ITEMS HERE-->
        <q-bar class="bg-accent text-white">
          <q-btn flat round dense @click="closeListDialog">
            <q-icon name="close" />
          </q-btn>
          <div>{{ origListName }}</div>
          <div class="q-ml-lg">
            <q-btn
              v-if="listOwner === user.UserID || listCircleRights === 'W'"
              flat
              round
              dense
              class="q-mr-xs"
              icon="mdi-plus"
              @click="openAddItemDialog()"
            ></q-btn>
          </div>
          <q-space />
          <q-btn
            flat
            round
            dense
            icon="more_vert"
            v-if="listOwner === user.UserID || listCircleRights === 'W'"
          >
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="openEditListDialog()"
                  v-if="listOwner === user.UserID"
                  >Edit List
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="completedDeleteConfirmOpen = true"
                  v-if="listOwner === user.UserID || listCircleRights === 'W'"
                  >Delete Selected Items
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="moveCompletedItems()"
                  v-if="listOwner === user.UserID || listCircleRights === 'W'"
                  >Move Selected Items To Another List
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="listDeleteConfirmOpen = true"
                  v-if="listOwner === user.UserID"
                  >Delete Entire List
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-bar>

        <q-card style="min-width: 350px">
          <ItemList
            :listID="listID"
            :sortID="sortID"
            @closeListDialog="closeListDialog"
            @itemAdded="getListDetails"
            :key="updateKey"
          ></ItemList>
        </q-card>

        <!--END THE LIST OF ITEMS-->
      </q-card>
    </q-dialog>
    <!--END OF DIALOG -->
  </div>
</template>
<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import listActions from "../actions/lists";
import EditList from "src/components/editList.vue";
import ItemList from "src/components/listItemCard.vue";
import AddListItem from "src/components/addListItem.vue";

export default defineComponent({
  name: "ListCard",
  components: {
    EditList,
    ItemList,
    AddListItem,
  },
  props: {
    listID: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");
    const $q = useQuasar();

    const listClass = ref(null);
    const listContent = ref(false);
    const listDeleteConfirmOpen = ref(false);
    const lists = reactive([]);
    const listName = ref(null);
    const listID = ref(null);
    const newList = ref(null);
    const listOwner = ref(null);
    const listCircleRights = ref(null);
    const listDueDate = ref(null);
    const listDialog = ref(false);
    const allListsList = ref(null);
    const moveDialog = ref(false);
    const confirmMoveDialog = ref(false);
    const editListDialog = ref(false);
    const origListName = ref(null);
    const listAssigned = ref(null);
    const completedDeleteConfirmOpen = ref(false);
    const openAddItem = ref(false);
    const updateKey = ref(0);
    const itemChanged = ref(0);
    const sortID = ref("Item");

    onMounted(() => {
      getListDetails();
    });

    const closeListDialog = async () => {
      listDialog.value = false;
    };

    const deleteList = async (listID) => {
      await listActions
        .deleteList(listID, user.UserID)
        .then(() => {
          listDeleteConfirmOpen.value = false;
          listDialog.value = false;
          emit("updateFeed");
        })
        .then(() => {
          closeListDialog();
        });
    };

    const deleteCompletedItems = async (listID) => {
      updateKey.value = 0;
      await listActions.deleteCompletedItems(listID).then(() => {
        completedDeleteConfirmOpen.value = false;
        updateKey.value = 99;
      });
    };

    const getListDetails = async () => {
      await listActions.getListDetails(props.listID).then((incomingList) => {
        listName.value = incomingList.ListName;
        listID.value = incomingList.ListID;
        listOwner.value = incomingList.ListOwner;
        listCircleRights.value = incomingList.ListCircleRights;
        listDueDate.value = incomingList.ListDate;
        listAssigned.value = incomingList.ListAssigned;
        origListName.value = incomingList.ListName;
        if (incomingList.ListColor === null) {
          listClass.value = "q-mb-md list-color2 listClass";
        } else {
          listClass.value = "q-mb-md listClass list-" + incomingList.ListColor;
        }
      });
    };

    const openListDispDialog = async () => {
      listDialog.value = true;
    };

    const openEditListDialog = async () => {
      updateKey.value = 0;
      editListDialog.value = true;
    };

    const updateList = async (event) => {
      lists.ListName = event;
      updateKey.value = 99;
      editListDialog.value = false;
      getListDetails();
    };

    const itemAdded = async () => {
      updateKey.value = 99;
      openAddItem.value = false;
      getListDetails();
    };

    const openAddItemDialog = async () => {
      openAddItem.value = true;
      updateKey.value = 0;
    };

    const getLists = async () => {
      await listActions.getLists(user.UserID).then((lists) => {
        allListsList.value = lists;
      });
    };

    const moveCompletedItems = async () => {
      moveDialog.value = true;
      getLists();
    };

    const setupMove = async (currentList, selectedList) => {
      listID.value = currentList;
      newList.value = selectedList;
      confirmMoveDialog.value = true;
    };

    const moveItems = async () => {
      updateKey.value = 1;
      await listActions
        .moveItems(listID.value, newList.value)
        .then((lists) => {
          allListsList.value = lists;
        })
        .then(() => {
          confirmMoveDialog.value = false;
          moveDialog.value = false;
          getListDetails();
          updateKey.value = 99;
        });
    };

    return {
      user,
      token,
      isLoggedIn,
      itemAdded,
      allListsList,
      getLists,
      listDeleteConfirmOpen,
      listClass,
      lists,
      listName,
      listCircleRights,
      listOwner,
      listDialog,
      listDueDate,
      listAssigned,
      moveDialog,
      confirmMoveDialog,
      setupMove,
      moveItems,
      moveCompletedItems,
      closeListDialog,
      deleteList,
      editListDialog,
      getListDetails,
      openListDispDialog,
      openAddItemDialog,
      listContent,
      openEditListDialog,
      openAddItem,
      updateList,
      deleteCompletedItems,
      completedDeleteConfirmOpen,
      updateKey,
      origListName,
      itemChanged,
      sortID,
    };
  },
});
</script>
<style scoped>
.listCard {
  height: 100%;
}

.listClass {
  height: 100%;
  margin-bottom: 10px;
}

.listCardHeight {
  height: 175px;
}
.q-card {
  padding: 0.25em 1em;
}
</style>
