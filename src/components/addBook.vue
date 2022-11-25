<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY ADD A BOOK-->
  <div class="q-mb-md">
    <q-card vertical class="cardColor flat q-ma-md feed-card">
      <!--NEW MEDIA SECTION-->

      <!--START BOOK DETAILS SECTION-->
      <q-card-section v-if="newBookErrMsg !== null">
        <h6>{{ newBookErrMsg }}</h6></q-card-section
      >
      <q-card-section>
        <q-form>
          <q-list>
            <q-item>
              <q-input
                label="New book name"
                class="titleInput"
                v-model="newBookTitle"
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
              <q-checkbox
                left-label
                v-model="makeTc"
                label="Make this a time capsule?"
                checked-icon="task_alt"
                color="teal"
                @click="toggleTc()"
              />
            </q-item>
            <q-item v-if="makeTc === true">
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

            <q-item>
              <q-select
                filled
                v-model="coverColor"
                :options="colorOptions"
                label="Cover Color"
                emit-value
                map-options
                clearable
                style="min-width: 250px; max-width: 70%"
              />

              <q-btn flat :class="coverColor"></q-btn>
            </q-item>
            <q-item>
              <q-select
                filled
                v-model="coverFont"
                :options="fontOptions"
                label="Cover font"
                emit-value
                map-options
                clearable
                style="min-width: 250px; max-width: 70%"
                @click="selectFont()"
              />

              <q-btn
                flat
                :class="coverFont"
                :label="newBookTitle ? newBookTitle : 'New book title'"
              ></q-btn>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-btn flat @click="newBookCancel()">Cancel</q-btn>
        <q-btn flat @click="newBook()">Save</q-btn>
      </q-card-actions>
    </q-card>
    <q-separator horizontal />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted } from "vue";
import memoryActions from "../actions/memories";
import bookActions from "../actions/books";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "AddCard",
  components: {},
  props: {},

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");

    const circleID = ref(null);
    const circleList = reactive([]);
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
    const coverColor = ref("color2");
    const coverStyle = ref("book2 color2");
    const coverFont = ref("book2");
    const fontOptions = [
      {
        label: "Font 1",
        value: "book1",
        description: "Font 1",
      },
      {
        label: "Font 2",
        value: "book2",
        description: "Font 2",
      },
      {
        label: "Font 3",
        value: "book3",
        description: "Font 3",
      },
      {
        label: "Font 4",
        value: "book4",
        description: "Font 4",
      },
      {
        label: "Font 5",
        value: "book5",
        description: "Font 5",
      },
    ];
    const makeTc = ref(false);
    const newBookErrMsg = ref(null);
    const newBookFont = ref(null);
    const newBookTitle = ref(null);
    const openTcFields = ref(false);
    const selectedCircle = ref(null);
    const selectedDate = ref(null);
    const tcMonth = ref(0);
    const tcDay = ref(0);
    const tcYear = ref(0);

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

    const newBook = async () => {
      if (newBookTitle.value === null) {
        newBookErrMsg.value = "You must give the book a title.";
        return;
      }
      if (newBookTitle.value.length < 1) {
        newBookErrMsg.value = "You must give the book a title.";
        return;
      }
      if (circleID.value === null) {
        newBookErrMsg.value = "You must select a Share Group.";
        return;
      }
      await bookActions
        .newBook(
          user.UserID,
          newBookTitle.value,
          selectedDate.value,
          circleID.value,
          coverColor.value,
          coverFont.value
        )
        .then(() => {
          newBookErrMsg.value = null;
          emit("bookAdded");
        });
    };

    const newBookCancel = () => {
      newBookErrMsg.value = null;
      emit("bookAdded");
    };

    const selectFont = () => {
      coverStyle.value = coverColor.value + " " + coverFont.value;
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

    const toggleTc = async () => {
      console.log("makeTc is: ", makeTc.value);
      if (makeTc.value === true) {
        tcStartDate();
        return;
      }
      if (makeTc.value === false) {
        selectedDate.value = null;
      }
    };

    return {
      user,
      token,
      isLoggedIn,

      circleID,
      circleList,
      coverColor,
      coverFont,
      coverStyle,
      colorOptions,
      fontOptions,
      makeTc,
      newBook,
      newBookCancel,
      newBookErrMsg,
      newBookFont,
      newBookTitle,
      openTcFields,
      selectedDate,
      selectFont,
      toggleTc,
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
