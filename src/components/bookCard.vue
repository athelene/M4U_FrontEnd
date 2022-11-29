<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY A SINGLE BOOK - BOOK ID SENT FROM INDEXPAGE-->
  <!--START OF BOOK CARDS-->
  <q-card
    clickable
    vertical
    @click="openBookDispDialog(bookDetails.BookID)"
    :class="bookClass"
  >
    <div class="shadow">
      <div class="topOfBook bookClass bookText" lang="en">
        <p class="text-center">
          {{ bookDetails.BookTitle }}
        </p>
      </div>

      <div class="bottomOfBook shadow" lang="en">
        <p class="text-subtitle1 text-center">
          by {{ bookDetails.UserDisplayName }}
        </p>
      </div>
    </div>

    <!--  START OF BOOK DIALOG -->
    <q-dialog v-model="bookDialog" full-width>
      <q-card>
        <q-toolbar>
          <q-avatar>
            <q-icon name="mdi-book-open-page-variant"></q-icon>
          </q-avatar>

          <q-toolbar-title
            ><span class="text-weight-bold">{{ bookDetails.BookTitle }} </span>
            <span class="q-ma-sm"
              ><q-btn
                v-if="bookDetails.BookOwner === user.UserID"
                flat
                icon="mdi-pencil"
                @click="openEditBookTitleDialog()"
              ></q-btn>
              <q-btn
                v-if="bookDetails.BookOwner === user.UserID"
                flat
                icon="delete"
                @click="bookDeleteConfirmOpen = true"
              ></q-btn>
            </span>
          </q-toolbar-title>

          <q-btn flat round dense icon="close" @click="closeBookDialog()" />
        </q-toolbar>
        <q-card-section>
          <q-avatar rounded>
            <img :src="bookSasKey" />
          </q-avatar>
          <span class="text-weight-bold"
            >by {{ bookDetails.UserDisplayName }}</span
          >
        </q-card-section>
        <!--START EDIT BOOK TITLE DIALOG-->
        <q-dialog v-model="editBookTitleDialog" persistent>
          <q-card style="min-width: 350px">
            <EditBook
              :bookID="bookID"
              @bookEdited="updateBookTitle"
              @bookFont="updateFont"
              @bookColor="updateFont"
            ></EditBook>
          </q-card>
        </q-dialog>
        <!--END EDIT BOOK TITLE DIALOG -->
        <q-card-section class="q-mt-xl">
          <q-carousel
            v-model="bookSlide"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="accent"
            padding
            class="rounded-borders feedCard"
            height="85%"
            ref="carousel"
            infinite
          >
            <q-carousel-slide name="toc" class="column no-wrap flex-center">
              <div v-if="bookContent === false">
                <q-icon
                  name="mdi-book-open-page-variant-outline"
                  color="primary"
                  size="56px"
                />

                <p class="text-h5" text-info>
                  There are no memories saved here yet.
                </p>
              </div>

              <div
                class="q-mt-md text-center feedCard"
                v-if="bookContent === true"
              >
                <p class="text-h5" text-info>Table of Memories</p>
                <q-list bordered separator>
                  <q-item
                    clickable
                    v-ripple
                    v-for="story in bookMemoryList"
                    :key="story.StoryID"
                    @click="bookSlide = story.StoryID"
                  >
                    <q-item-section>
                      <p class="text-subtitle1">
                        <span v-if="story.StoryTypeID === 4">Tradition: </span>
                        {{ story.StoryTitle }}
                      </p>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-carousel-slide>
            <q-carousel-slide
              :name="bookMemory.StoryID"
              class="no-wrap flex-center"
              v-for="bookMemory in bookMemoryList"
              :key="bookMemory.StoryID"
            >
              <div class="q-mt-md feedCard">
                <BookStoryCard
                  :story="bookMemory"
                  @getToc="bookSlide = 'toc'"
                  class="feedCard"
                ></BookStoryCard>
                <div class="flex-center">
                  <q-btn
                    class="q-ml-lg"
                    label="Table of Memories"
                    @click="bookSlide = 'toc'"
                  ></q-btn>
                </div>
              </div>
            </q-carousel-slide>
            <template v-slot:control>
              <!--controls for book carousel-->
              <q-carousel-control
                position="left"
                :offset="[18, 18]"
                class="q-gutter-xs"
              >
                <q-btn
                  push
                  round
                  dense
                  color="accent"
                  text-color="primary"
                  icon="arrow_left"
                  @click="$refs.carousel.previous()"
                />
              </q-carousel-control>
              <q-carousel-control
                position="right"
                :offset="[18, 18]"
                class="q-gutter-xs"
              >
                <q-btn
                  push
                  round
                  dense
                  color="accent"
                  text-color="primary"
                  icon="arrow_right"
                  @click="$refs.carousel.next()"
                />
              </q-carousel-control>
            </template>
          </q-carousel>
        </q-card-section>
        <!--START CONFIRM DELETE BOOK DIALOG-->
        <q-dialog v-model="bookDeleteConfirmOpen" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar
                color="negative"
                text-color="white"
                icon="mdi-alert-circle"
              />
              <span class="q-ml-sm"
                >Are you sure you want to delete
                {{ bookDetails.BookTitle }} permanently?</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                @click="deleteBook(bookDetails.BookID)"
                flat
                label="Delete"
                color="primary"
                v-close-popup
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <!--END CONFIRM DELETE BOOK DIALOG-->
        <q-card-actions>
          <q-btn
            @click="bookDeleteConfirmOpen = true"
            icon="mdi-delete-outline"
            v-if="bookDetails.BookOwnerID === user.UserID"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--END OF BOOK DIALOG -->
  </q-card>

  <!--END OF BOOK CARDS-->
</template>
<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import BookStoryCard from "components/bookStoryCard.vue";
import bookActions from "../actions/books";
import EditBook from "src/components/editBook.vue";
import mediaActions from "../actions/blobs";

export default defineComponent({
  name: "BookCard",
  components: {
    BookStoryCard,
    EditBook,
  },
  props: {
    bookID: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");

    const bookClass = ref("bookLook shadow-box  shadow-4");
    const bookContent = ref(false);
    const bookDeleteConfirmOpen = ref(false);
    const bookSasKey = ref(null);
    const bookSlide = ref("toc");
    const bookDetails = reactive([]);
    const bookDialog = ref(false);
    const bookMemoryList = ref(null);
    const circleList = reactive([]);
    const editBookTitleDialog = ref(false);
    const origBookTitle = ref(null);

    onMounted(() => {
      getBookDetails();
    });

    const closeBookDialog = async () => {
      bookDialog.value = false;
      bookMemoryList.value = null;
      emit("updateFeed");
    };

    const deleteBook = async (bookID) => {
      await bookActions
        .deleteBook(bookID, user.UserID)
        .then(() => {
          bookDeleteConfirmOpen.value = false;
          bookDialog.value = false;
        })
        .then(() => {
          closeBookDialog();
        });
    };

    const getBookContent = async () => {
      await bookActions
        .getBookContent(user.UserID, props.bookID)
        .then((retList) => {
          bookMemoryList.value = retList;
          if (retList.length > 0) {
            bookContent.value = true;
          } else {
            bookContent.value = false;
          }
        });
    };

    const getBookDetails = async () => {
      await bookActions
        .getBookDetails(props.bookID)
        .then((book) => {
          Object.assign(bookDetails, book[0]);
        })
        .then(() => {
          getBookSasKey();
          origBookTitle.value = bookDetails.BookTitle;
          if (bookDetails.BookColor === null) {
            bookClass.value = "bookLook color2 " + bookDetails.BookFont;
          } else {
            bookClass.value =
              "bookLook " + bookDetails.BookFont + " " + bookDetails.BookColor;
          }
        });
    };

    const getBookMemoryList = async (bookID) => {
      await bookActions.getBookMemoryList(bookID).then((memoryList) => {
        getBookMemoryList.value = memoryList;
      });
    };

    const getBookSasKey = async () => {
      await mediaActions
        .getSasKey(bookDetails.UserMediaLoc)
        .then((incomingSas) => {
          bookSasKey.value = incomingSas;
          console.log("book SasKey is: ", bookSasKey.value);
        });
    };

    const openBookDispDialog = async (bookID) => {
      bookSlide.value = "toc";
      bookDialog.value = true;
      getBookContent(props.bookID);
    };

    const openEditBookTitleDialog = async () => {
      editBookTitleDialog.value = true;
    };

    const updateBookTitle = async (event) => {
      bookDetails.BookTitle = event;
      editBookTitleDialog.value = false;
      getBookDetails();
    };

    return {
      user,
      token,
      isLoggedIn,
      bookClass,
      bookDeleteConfirmOpen,
      bookDetails,
      bookDialog,
      bookMemoryList,
      bookSlide,
      bookSasKey,
      closeBookDialog,
      deleteBook,
      editBookTitleDialog,
      openBookDispDialog,
      bookContent,
      openEditBookTitleDialog,
      updateBookTitle,
    };
  },
});
</script>
<style scoped>
.bookCard {
  cursor: pointer;
  cursor: hand;
  width: 100px;
  margin: auto;
}

.bookLook {
  width: 300px;
  height: 350px;
  margin: auto;
  filter: drop-shadow(25px, 25px, 15px, #999);
}

.bookText {
  font-size: 5vw;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  white-space: normal;
}
.topOfBook {
  height: 300px;
  margin: auto;
}

.bottomOfBook {
  height: 10px;
}

.shadow {
  filter: drop-shadow(25px, 25px, 15px, #999);
}
.feed-card {
  width: 85%;
  margin: auto;
}
.qc-card {
  width: 85%;
  margin: auto;
}

.video-wrapper {
  position: relative;
  padding-bottom: 20%;
  height: 0;
}

.video {
  display: block;
  max-width: 100%;
}

.cardColor {
  background-color: #fefbee;
}

.mediaBackground {
  background-color: #92b498;
}

.fullScreenImage {
  width: 100%;
}

.scrollArea {
  height: 75px;
}

.feed-card {
  width: 75%;
  margin: auto;
}

.commentDiv {
  width: 85%;
  background-color: #bbb7a9;
  border-radius: 3px;
}

.commentHeader {
  font-weight: bold;
}

.titleInput {
  width: 100%;
}
</style>
