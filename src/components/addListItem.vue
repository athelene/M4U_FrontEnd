<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY ADD A LIST ITEM-->
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
                autofocus
              ></q-input>
            </q-item>
            <q-item v-if="useAssigned === 1">
              <q-input
                label="Assigned To"
                class="titleInput"
                v-model="itemAssigned"
              ></q-input>
            </q-item>
            <q-item>
              <q-input
                label="Notes"
                class="titleInput"
                v-model="newNotes"
              ></q-input>
            </q-item>
            <q-item v-if="useDueDate === 1">
              Due date:
              <q-input filled v-model="selectedDate" label="YYYY-MM-DD">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        mask="YYYY-MM-DD"
                        v-model="selectedDate"
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
        <q-btn flat @click="newItemCancel()">Cancel</q-btn>
        <q-btn flat @click="newItem()">Save</q-btn>
      </q-card-actions>
    </q-card>
    <q-separator horizontal />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted } from "vue";
import listActions from "../actions/lists";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "AddListItem",
  components: {},
  props: {
    listID: {
      type: Number,
    },
    dueDate: {
      type: Number,
    },
    assigned: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");

    const newItemErrMsg = ref(null);
    const newItemName = ref(null);
    const useDueDate = ref(false);
    const useAssigned = ref(false);
    const selectedDate = ref(null);
    const itemAssigned = ref("");
    const newNotes = ref("");
    const tcMonth = ref(0);
    const tcDay = ref(0);
    const tcYear = ref(0);

    onMounted(() => {
      useDueDate.value = props.dueDate;
      useAssigned.value = props.assigned;
      if (props.dueDate === 1) {
        tcStartDate();
      }
    });

    const newItem = async () => {
      if (props.dueDate !== 1) {
        selectedDate.value = "";
      }
      if (props.assigned !== 1) {
        itemAssigned.value = "";
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
        .newItem(
          newItemName.value,
          selectedDate.value,
          itemAssigned.value,
          newNotes.value,
          props.listID
        )
        .then(() => {
          newItemErrMsg.value = null;
          emit("itemAdded");
          emit("closedListDialog");
        });
    };

    const newItemCancel = () => {
      newItemErrMsg.value = null;
      emit("itemAdded", props.listID);
    };

    const tcStartDate = async () => {
      var dateObj = new Date();
      tcMonth.value = dateObj.getUTCMonth() + 1; //months from 1-12
      if (tcMonth.value < 10) {
        tcMonth.value = "0" + tcMonth.value;
      }
      tcDay.value = dateObj.getUTCDate();
      if (tcDay.value < 10) {
        tcDay.value = "0" + tcDay.value;
      }
      tcYear.value = dateObj.getUTCFullYear();
      selectedDate.value =
        tcYear.value + "-" + tcMonth.value + "-" + tcDay.value;
    };

    return {
      user,
      token,
      isLoggedIn,
      useAssigned,
      useDueDate,
      newItem,
      newItemCancel,
      newItemErrMsg,
      newItemName,
      itemAssigned,
      selectedDate,
      newNotes,
    };
  },
});
</script>
<style scoped>
.feed-card {
  width: 85%;
  margin: auto;
}

.cardColor {
  background-color: #fefbee;
}

.titleInput {
  width: 100%;
}
</style>
