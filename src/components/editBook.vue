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
                label="Book title"
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
            </q-item>
            <q-item>
              <q-btn flat :class="coverFont" :label="newBookTitle"></q-btn>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>

      <q-card-actions>
        <q-btn flat @click="closeEditBook()">Cancel</q-btn>
        <q-btn flat @click="editBook()">Save</q-btn>
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
import bookActions from "../actions/books";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "EditCard",
  components: {},
  props: {
    bookID: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const book = ref(null);
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
    const openTcFields = ref(false);
    const selectedDate = ref(null);
    const newBookTitle = ref(null);
    const tcMonth = ref(0);
    const tcDay = ref(0);
    const tcYear = ref(0);
    const newBookErrMsg = ref(null);
    const origTitle = ref(null);

    onMounted(() => {
      getCircleList();
      getBookDetails();
    });

    const tcStartDate = async () => {
      if (selectedDate.value !== null) {
        return;
      }

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

    const getCircleList = async () => {
      await memoryActions.getMyCircles(user.UserID).then((circles) => {
        circles.forEach((circle) => {
          circleList.push(circle);
        });
      });
    };

    const getBookDetails = async () => {
      await bookActions.getBookDetails(props.bookID).then((bookDetails) => {
        book.value = bookDetails;
        newBookTitle.value = bookDetails[0].BookTitle;
        origTitle.value = bookDetails[0].BookTitle;
        selectedDate.value = bookDetails[0].TimeCapsuleDate;
        selectedCircle.value = bookDetails[0].CircleID;
        coverFont.value = bookDetails[0].BookFont;
        coverColor.value = bookDetails[0].BookColor;
        if (bookDetails[0].TimeCapsuleDate !== null) {
          openTcFields.value = true;
          makeTc.value = true;
          selectedDate.value = bookDetails[0].TimeCapsuleDate.substring(0, 10);
        }
      });
    };

    const toggleTc = async () => {
      if (makeTc.value === true) {
        tcStartDate();
        return;
      }
      if (makeTc.value === false) {
        selectedDate.value = null;
      }
    };

    const closeEditBook = async () => {
      newBookErrMsg.value = null;
      newBookTitle.value = origTitle.value;
      emit("bookEdited", origTitle.value);
    };

    const editBook = async () => {
      if (newBookTitle.value === null) {
        newBookErrMsg.value = "You must give the book a title.";
        return;
      }
      if (newBookTitle.value.length < 1) {
        newBookErrMsg.value = "You must give the book a title.";
        return;
      }
      if (selectedCircle.value === null) {
        newBookErrMsg.value = "You must select a Share Group.";
        return;
      }

      await bookActions
        .editBook(
          user.UserID,
          props.bookID,
          newBookTitle.value,
          selectedDate.value,
          selectedCircle.value,
          coverColor.value,
          coverFont.value
        )
        .then(() => {
          origTitle.value = null;
          newBookErrMsg.value = null;
          emit("bookEdited", newBookTitle.value);
          emit("updateFeed");
        });
    };

    const selectFont = () => {
      coverStyle.value = coverColor.value + " " + coverFont.value;
    };

    return {
      user,
      token,
      isLoggedIn,
      circleList,
      colorOptions,
      coverColor,
      coverFont,
      coverStyle,
      fontOptions,
      makeTc,
      openTcFields,
      toggleTc,
      selectedDate,
      selectedCircle,
      circleID,
      newBookTitle,
      editBook,
      newBookErrMsg,
      book,
      closeEditBook,
      selectFont,
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
