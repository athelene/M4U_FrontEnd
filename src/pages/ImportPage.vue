<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg" v-if="mobileMsg === true">
        <h6 class="text-h5 text-info">
          Imports cannot be done from a mobile device. Please log in to
          www.memoriesforus.com on a PC to download your data.
        </h6>
      </div>

      <div class="q-ml-lg" v-if="mobileMsg === false">
        <p class="text-h5 text-info">Import Memories</p>
        <p>
          You can import multiple photos at once. Each photo will create a
          separate memory. All of those memories will be saved into a new book.
          Select a book for your memories then select and upload the photos.
          This can be useful if you have a large number of photos you want to
          save to browse through like a photo album.
        </p>
        <q-btn
          icon="mdi-bookshelf"
          label="Select a Book"
          flat
          class="text-accent"
          @click="openBookDialog()"
        ></q-btn>

        <p v-if="importBookTitle !== null">
          Importing to {{ importBookTitle }}
        </p>
      </div>

      <!--ADD BOOKS DIALOG INSIDE OF EDIT DIALOG-->
      <q-dialog v-model="booksDialogFlag">
        <q-card style="width: 300px" class="q-px-sm q-pb-md">
          <q-card-section>
            <div class="text-h6">
              Book List
              <q-btn color="accent" size="sm" @click="newBookDialog = true"
                >New Book</q-btn
              >
            </div>
          </q-card-section>
          <q-list bordered separator>
            <q-item
              v-for="book in bookList"
              :key="book.BookID"
              clickable
              separator
              bordered
              v-ripple
              @click="setBook(book.BookID, book.BookTitle, book.CircleID)"
            >
              {{ book.BookTitle }}
            </q-item>
          </q-list>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!--END ADD BOOKS INSIDE OF EDIT DIALOG-->

      <!--start of new book dialog-->
      <q-dialog v-model="newBookDialog" class="newBookDialog">
        <q-card class="newBookDialog">
          <q-toolbar>
            <q-avatar>
              <q-icon name="mdi-book-open-page-variant-outline"></q-icon>
            </q-avatar>

            <q-toolbar-title>New Book or Time Capsule</q-toolbar-title>
          </q-toolbar>

          <q-card-section>
            <AddBook @bookAdded="newBookAdded()"></AddBook>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!--end of new book dialog-->

      <!-- Dialog to select files-->

      <q-dialog v-model="selectFilesDialog" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Select Your Photos</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-uploader
              :url="servername"
              label="Individual upload"
              multiple
              style="max-width: 300px"
              accept=".jpg, image/*"
              @uploaded="doneUpload()"
              :form-fields="[
                {
                  name: 'UserID',
                  value: user.UserID,
                },
                {
                  name: 'BookID',
                  value: importBook,
                },
                {
                  name: 'CircleID',
                  value: circleID,
                },
                {
                  name: 'token',
                  value: token,
                },
                {
                  name: 'reauthToken',
                  value: reauthToken,
                },
              ]"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End Dialog to select files-->

      <!-- Uploading Done Dialog-->
      <q-dialog v-model="doneUploadDialog">
        <q-card>
          <q-card-section>
            <div class="text-h6">Uploading Complete</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Your files are saved into your book.
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- End of Uploading Done Dialog-->
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useQuasar } from "quasar";
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import bookActions from "../actions/books";
import circleActions from "../actions/memories";
import AddBook from "components/addBook.vue";

export default defineComponent({
  name: "ImportPage",

  components: {
    AddBook,
  },
  setup() {
    const reauthToken = window.localStorage.getItem("rt");
    const router = useRouter();
    const route = useRoute();

    //ESTABLISH SERVER NAME TO SET UP PROPER API CALL
    const serverHost = "https://" + window.location.hostname;
    const userState = useUserStore();
    const user = reactive(userState.user);
    const $q = useQuasar();
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const getInfo = ref(false);
    const badDataMessage = ref("");
    const bookList = reactive([]);
    const circleID = ref(null);
    const circleTitle = ref(null);
    const circleList = reactive([]);
    const mobileMsg = ref(false);
    const booksDialogFlag = ref(false);
    const newBookDialog = ref(false);
    const importBook = ref(null);
    const importBookTitle = ref(null);
    const selectFilesDialog = ref(false);
    const doneUploadDialog = ref(false);
    const servername = ref("");

    onMounted(async () => {
      if ($q.platform.is.mobile) {
        mobileMsg.value = true;
      } else {
        mobileMsg.value = false;
      }

      console.log("serverHost is: ", serverHost);

      if (serverHost === "https://localhost") {
        servername.value = "http://localhost:8700/importBlobs";
      } else {
        servername.value =
          "https://memoriesforusbe.azurewebsites.net/importBlobs";
      }
    });

    const openBookDialog = async () => {
      getMyBooks();
      booksDialogFlag.value = true;
    };

    const getMyBooks = async () => {
      await bookActions.getMyBookList(user.UserID).then((books) => {
        Object.assign(bookList, books);
        if (books.length === 0) {
          noBookMsg.value = true;
        }
      });
    };

    const newBookAdded = async () => {
      newBookDialog.value = false;
      getMyBooks();
    };

    const setBook = async (bookID, bookTitle, selectedCircle) => {
      booksDialogFlag.value = false;
      importBook.value = bookID;
      importBookTitle.value = bookTitle;
      circleID.value = selectedCircle;
      selectFilesDialog.value = true;
    };

    const doneUpload = async () => {
      selectFilesDialog.value = false;
      doneUploadDialog.value = true;
    };

    return {
      openBookDialog,
      bookList,
      booksDialogFlag,
      importBookTitle,
      circleID,
      circleTitle,
      circleList,
      getInfo,
      importBook,
      mobileMsg,
      user,
      token,
      newBookDialog,
      newBookAdded,
      setBook,
      selectFilesDialog,
      doneUpload,
      doneUploadDialog,
      reauthToken,
      servername,
    };
  },
});
</script>
<style scoped>
.qc-card {
  width: 85%;
  margin-top: 10%;
  padding-top: 15%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
}

.feed-card {
  width: 75%;
  margin: auto;
}

.qpage {
  width: 100%;
  padding-top: 10%;
}

.imageBtnBackground {
  background-color: #fefbee;
}

.bg-image {
  background-image: url(../../public/m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
  text-align: center;
}
</style>
