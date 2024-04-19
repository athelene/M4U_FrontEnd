<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY ADD A LIST-->
  <div class="q-mb-md">
    <q-card vertical class="cardColor flat q-ma-md feed-card">
      <!--START List DETAILS SECTION-->
      <q-card-section v-if="newListErrMsg !== null">
        <h6>{{ newListErrMsg }}</h6></q-card-section
      >
      <q-card-section>
        <q-form>
          <q-list>
            <q-item>
              <q-input
                label="New list name"
                class="titleInput"
                v-model="newListName"
              ></q-input>
            </q-item>
            <q-item>
              <q-select
                input-debounce="0"
                filled
                label="Share with..."
                hint="Select the group you want to seee this"
                v-model="circleID"
                :options="circleList"
                option-value="CircleID"
                option-label="CircleName"
                emit-value
                map-options
                clearable
                style="min-width: 250px; max-width: 70%"
              />
            </q-item>
            <q-item>
              <q-option-group
                :options="rightsList"
                type="radio"
                v-model="listCircleRights"
              />
            </q-item>
            <q-item>
              <q-checkbox
                left-label
                v-model="makeDueDate"
                label="Will items have a due date?"
                checked-icon="task_alt"
                color="teal"
                @click="toggleDueDate()"
              />
            </q-item>
            <q-item>
              <q-checkbox
                left-label
                v-model="makeAssigned"
                label="Do you want to assign these items to people?"
                checked-icon="task_alt"
                color="teal"
                @click="toggleAssigned()"
              />
            </q-item>
            <q-item>
              <div style="min-width: 150px">
                <q-select
                  filled
                  v-model="listColor"
                  :options="colorOptions"
                  label="Color"
                  emit-value
                  map-options
                  clearable
                />
                <q-btn flat :class="listColor"></q-btn>
              </div>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-btn flat @click="newListCancel()">Cancel</q-btn>
        <q-btn flat @click="newList()">Save</q-btn>
      </q-card-actions>
    </q-card>
    <q-separator horizontal />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted } from "vue";
import memoryActions from "../actions/memories";
import listActions from "../actions/lists";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "AddListCard",
  components: {},
  props: {},

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");

    const circleID = ref(null);
    const dateFlag = ref(null);
    const assignedFlag = ref(null);
    const circleList = reactive([]);
    const selectedDueDate = ref(0);
    const colorOptions = [
      {
        label: "Red",
        value: "color1",
        description: "Red",
      },
      {
        label: "Teal",
        value: "color2",
      },
      {
        label: "Blue",
        value: "color3",
      },
      {
        label: "Gold",
        value: "color4",
      },
      {
        label: "Cream",
        value: "color5",
      },
      {
        label: "Green",
        value: "color6",
      },
    ];

    const rightsList = [
      {
        label: "Read items on the list",
        value: "R",
      },
      {
        label: "Read, change or delete items on the list",
        value: "W",
      },
    ];
    const listColor = ref("color2");
    const listCircleRights = ref("R");
    const makeDueDate = ref(false);
    const newListErrMsg = ref(null);
    const newListName = ref(null);
    //    const selectedCircle = ref(null);
    const makeAssigned = ref(false);
    const selectedAssigned = ref(0);

    onMounted(() => {
      getCircleList();
    });

    const getCircleList = async () => {
      await memoryActions.getMyCircles(user.UserID).then((circles) => {
        circles.forEach((circle) => {
          circleList.push(circle);
        });
      });
    };

    const newList = async () => {
      if (newListName.value === null) {
        newListErrMsg.value = "You must give the list a name.";
        return;
      }
      if (newListName.value.length < 1) {
        newListErrMsg.value = "You must give the list a name.";
        return;
      }
      if (circleID.value === null) {
        newListErrMsg.value = "You must select a Share Group.";
        return;
      }

      await listActions
        .newList(
          user.UserID,
          newListName.value,
          selectedDueDate.value,
          circleID.value,
          listColor.value,
          listCircleRights.value,
          selectedAssigned.value
        )
        .then(() => {
          newListErrMsg.value = null;
          emit("listAdded");
        });
    };

    const newListCancel = () => {
      newListErrMsg.value = null;
      emit("listAdded");
    };

    const toggleDueDate = async () => {
      if (makeDueDate.value === true) {
        selectedDueDate.value === 1;
      } else {
        selectedDueDate.value === 0;
      }
    };

    const toggleAssigned = async () => {
      if (makeAssigned.value === true) {
        selectedAssigned.value = 1;
      } else {
        selectedAssigned.value = 0;
      }
    };

    return {
      user,
      token,
      isLoggedIn,

      circleID,
      circleList,
      listCircleRights,
      listColor,
      colorOptions,
      makeDueDate,
      newList,
      newListCancel,
      newListErrMsg,
      newListName,
      rightsList,
      selectedDueDate,
      toggleDueDate,
      selectedAssigned,
      makeAssigned,
      toggleAssigned,
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
