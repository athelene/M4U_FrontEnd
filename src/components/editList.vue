<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY ADD A LISt-->
  <div class="q-mb-md">
    <q-card vertical class="cardColor flat q-ma-md dialog-feed-card">
      <!--START LIST DETAILS SECTION-->

      <q-card-section v-if="newListErrMsg !== null">
        <h6>{{ newListErrMsg }}</h6></q-card-section
      >
      <q-card-section>
        <q-form>
          <q-list>
            <q-item>
              <q-input
                label="List title"
                class="titleInput"
                v-model="newListName"
              ></q-input>
            </q-item>

            <q-item>
              <q-checkbox
                left-label
                v-model="makeDate"
                color="teal"
                label="Do you want a due date for items in this list?"
                @click="toggleDate()"
              />
            </q-item>
            {{ makeDate }}
            <q-item>
              <q-select
                filled
                v-model="listColor"
                :options="colorOptions"
                label="Cover Color"
                emit-value
                map-options
                clearable
                style="min-width: 250px; max-width: 70%"
              />

              <q-btn flat :class="listColor"></q-btn>
            </q-item>
            <q-item>
              <q-select
                input-debounce="0"
                filled
                label="Share with..."
                hint="Select the group you want to see this"
                v-model="selectedCircle"
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
              <q-item-section> This share group can:</q-item-section>
              <q-item-section>
                <q-option-group
                  label="What can people who share this do? Note: You will always have full access."
                  :options="rightsList"
                  type="radio"
                  v-model="listCircleRights"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-btn flat @click="closeEditList()">Cancel</q-btn>
        <q-btn flat @click="editList()">Save</q-btn>
      </q-card-actions>
    </q-card>
    <q-separator horizontal />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import memoryActions from "../actions/memories";
import listActions from "../actions/lists";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "EditList",
  components: {},
  props: {
    listID: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const list = ref(null);
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const circleList = reactive([]);
    const reauthToken = window.localStorage.getItem("rt");
    const selectedCircle = ref(null);
    const circleID = ref(null);

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
        label: "Read, change and delete items on the list",
        value: "W",
      },
    ];
    const listColor = ref("color2");
    const listCircleRights = ref("R");
    const makeDate = ref(false);
    const listDate = ref(null);
    const makeAssigned = ref(false);
    const newListName = ref(null);
    const newListErrMsg = ref(null);
    const origName = ref(null);
    const origRights = ref(null);

    onMounted(() => {
      getCircleList();
      getListDetails().then(() => {
        console.log(
          "list, newListName, orgName, selectedCircle, listColor",
          list.value,
          newListName.value,
          origName.value,
          selectedCircle.value,
          listColor.value
        );
      });
    });

    const getCircleList = async () => {
      await memoryActions.getMyCircles(user.UserID).then((circles) => {
        circles.forEach((circle) => {
          circleList.push(circle);
        });
      });
    };

    const getListDetails = async () => {
      await listActions.getListDetails(props.listID).then((listDetails) => {
        list.value = listDetails;
        newListName.value = listDetails[0].ListName;
        origName.value = listDetails[0].ListName;
        selectedCircle.value = listDetails[0].ListCircle;
        listColor.value = listDetails[0].ListColor;
        origRights.value = listDetails[0].ListCircleRights;
        if (listDetails[0].ListDate === 1) {
          makeDate.value = true;
        } else {
          makeDate.value = false;
        }
        listCircleRights.value = listDetails[0].ListCircleRights;
      });
    };

    const closeEditList = async () => {
      newListErrMsg.value = null;
      newListName.value = origName.value;

      emit("listEdited", origName.value);
    };

    const toggleDate = async () => {
      if (makeDate.value === true) {
        listDate.value = 1;
      } else {
        listDate.value = 0;
      }
    };

    const editList = async () => {
      if (newListName.value === null) {
        newListErrMsg.value = "You must give the list a name.";
        return;
      }
      if (newListName.value.length < 1) {
        newBookErrMsg.value = "You must give the list a name.";
        return;
      }
      if (selectedCircle.value === null) {
        newBookErrMsg.value = "You must select a Share Group.";
        return;
      }
      console.log(
        "user, listID, newListName, listDate, selectedCircle, listColor",
        user.UserID,
        props.listID,
        newListName.value,
        listDate.value,
        selectedCircle.value,
        listColor.value
      );

      await listActions
        .editList(
          user.UserID,
          props.listID,
          newListName.value,
          listDate.value,
          selectedCircle.value,
          listColor.value
        )
        .then(() => {
          origName.value = null;
          newListErrMsg.value = null;
          emit("listEdited", newListName.value);
          emit("updateFeed");
        });
    };
    return {
      user,
      token,
      isLoggedIn,
      circleList,
      colorOptions,
      listColor,
      makeDate,
      makeAssigned,
      selectedCircle,
      circleID,
      newListName,
      editList,
      newListErrMsg,
      list,
      listCircleRights,
      closeEditList,
      rightsList,
      origRights,
      toggleDate,
    };
  },
});
</script>
<style scoped>
.feed-card {
  width: 85%;
  margin: auto;
}

.dialog-feed-card {
  width: 95%;
  margin: auto;
}

.cardColor {
  background-color: #fefbee;
}

.titleInput {
  width: 100%;
}
</style>
