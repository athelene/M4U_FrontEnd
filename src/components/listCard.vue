<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY A SINGLE LIST - LIST ID SENT FROM INDEXPAGE-->
  <!--START OF LIST CARDS-->
  <q-card
    class="feed-card"
    clickable
    @click="openListDispDialog(listDetails.ListID)"
  >
    {{ listDetails.ListName }}
  </q-card>
  <!--  START OF LIST DIALOG -->
  <q-dialog v-model="listDialog" full-width>
    <q-card class="cardColor flat q-ma-md feed-card bg-secondary">
      <q-toolbar>
        <q-toolbar-title
          ><span class="text-weight-bold">{{ listDetails.ListName }} </span>
          <span class="q-ma-sm"
            ><q-btn
              v-if="listDetails.ListOwner === user.UserID"
              flat
              icon="mdi-pencil"
              @click="openEditListDialog()"
            ></q-btn>
            <q-btn
              v-if="listDetails.ListOwner === user.UserID"
              flat
              icon="delete"
              @click="listDeleteConfirmOpen = true"
            ></q-btn>
          </span>
        </q-toolbar-title>

        <q-btn flat round dense icon="close" @click="closeListDialog()" />
      </q-toolbar>

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
              {{ listDetails.ListName }} permanently?</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              @click="deleteList(listDetails.ListID)"
              flat
              label="Delete"
              color="primary"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!--END CONFIRM DELETE LIST DIALOG-->
      <q-card-actions>
        <q-btn
          @click="listDeleteConfirmOpen = true"
          icon="mdi-delete-outline"
          v-if="listDetails.ListOwner === user.UserID"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!--END OF BOOK DIALOG -->

  <!--END OF BOOK CARDS-->
</template>
<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted, computed } from "vue";
import { useQuasar, openURL } from "quasar";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import listActions from "../actions/lists";
import EditList from "src/components/editList.vue";

export default defineComponent({
  name: "ListCard",
  components: {
    EditList,
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
    const listDetails = reactive([]);
    const listDialog = ref(false);
    const circleList = reactive([]);
    const editListDialog = ref(false);
    const origListName = ref(null);

    onMounted(() => {
      getListDetails();
    });

    const closeListDialog = async () => {
      listDialog.value = false;
      emit("updateFeed");
    };

    const deleteList = async (listID) => {
      await listActions
        .deleteList(listID, user.UserID)
        .then(() => {
          listDeleteConfirmOpen.value = false;
          listDialog.value = false;
        })
        .then(() => {
          closeListDialog();
        });
    };

    const getListDetails = async () => {
      console.log("running getListDetails");
      await listActions
        .getListDetails(props.listID)
        .then((list) => {
          console.log("incoming list is: ", list);
          Object.assign(listDetails, list[0]);
        })
        .then(() => {
          origListName.value = listDetails.ListName;
          if (listDetails.ListColor === null) {
            listClass.value = "listLook color2";
          } else {
            listClass.value = "listLook " + " " + listDetails.ListColor;
          }
        });
    };

    const openListDispDialog = async (bookID) => {
      listDialog.value = true;
      // getListContent(props.listID);
    };

    const openEditListDialog = async () => {
      editListDialog.value = true;
    };

    const updateList = async (event) => {
      listDetails.ListName = event;
      editListDialog.value = false;
      getListDetails();
    };

    return {
      user,
      token,
      isLoggedIn,
      listDeleteConfirmOpen,
      listClass,
      listDetails,
      listDialog,
      closeListDialog,
      deleteList,
      editListDialog,
      openListDispDialog,
      listContent,
      openEditListDialog,
      updateList,
    };
  },
});
</script>
<style scoped>
.listCard {
  cursor: pointer;
  cursor: hand;
  width: 100px;
  margin: auto;
}

.listClass {
  cursor: pointer;
  cursor: hand;
  margin: auto;
  margin: auto;
}

.listLook {
  width: 300px;
  height: 150px;
  margin: auto;
}

.feed-card {
  width: 85%;
  margin: auto;
}
.qc-card {
  width: 85%;
  margin: auto;
}

.cardColor {
  background-color: #fefbee;
}

.scrollArea {
  height: 75px;
}

.feed-card {
  width: 100%;
  margin: auto;
}

.titleInput {
  width: 100%;
}
</style>
