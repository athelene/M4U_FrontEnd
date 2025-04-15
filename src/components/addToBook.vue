<template>
  <!--THIS PAGE IS A COMPONENT TO DISPLAY ADD A BOOK-->
  <div class="q-mb-md">
    <!--ADD BOOKS DIALOG INSIDE OF EDIT DIALOG-->
    <q-card style="width: 300px" class="q-px-sm q-pb-md">
      <q-card-section>
        <div class="text-h6">Book List</div>
        <q-btn color="accent" size="sm" @click="newBookDialog = true"
          >New Book</q-btn
        >
      </q-card-section>
      <q-item v-for="book in bookList" :key="book.BookID">
        <div>
          <q-checkbox
            dense
            color="accent"
            v-model="book.BookStatus"
            @click="updateBooks(book.BookID, book.BookStatus)"
          ></q-checkbox>
        </div>
        <div>
          <q-item-label>{{ book.BookTitle }}</q-item-label>
        </div>
      </q-item>
      <q-card-actions align="right">
        <q-btn flat label="DONE" color="primary" v-close-popup />
      </q-card-actions>

      <!--start of new book dialog-->
      <q-dialog v-model="newBookDialog" class="newBookDialog">
        <q-card class="newBookDialog">
          <q-toolbar>
            <q-avatar>
              <q-icon name="mdi-book-open-page-variant-outline"></q-icon>
            </q-avatar>

            <q-toolbar-title>New Book or Time Capsule</q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <AddBook @bookAdded="newBookAdded()"></AddBook>
        </q-card>
      </q-dialog>
      <!--end of new book dialog-->
    </q-card>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { ref, onMounted } from "vue";
import bookActions from "../actions/books";
import AddBook from "components/addBook.vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "AddToBook",
  components: { AddBook },
  props: {
    storyID: {
      type: Number,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");

    const bookList = reactive([]);
    const newBookDialog = ref(false);

    onMounted(() => {
      getMyBooks();
    });

    const getMyBooks = async () => {
      await bookActions
        .getBooksToAddStory(user.UserID, props.storyID)
        .then((books) => {
          Object.assign(bookList, books);
          if (books.length === 0) {
            noBookMsg.value = true;
          }
        });
    };

    const updateBooks = async (bookID, bookStatus) => {
      if (bookStatus === true) {
        await bookActions.addToBooks(bookID, props.storyID).then(async () => {
          await getMyBooks();
        });
      }
      if (bookStatus === null || bookStatus === false) {
        await bookActions
          .removeFromBooks(bookID, props.storyID)
          .then(async () => {
            await getMyBooks();
          });
      }
    };

    const newBookAdded = async () => {
      newBookDialog.value = false;
      getMyBooks();
    };

    return {
      user,
      token,
      isLoggedIn,

      bookList,
      getMyBooks,
      newBookDialog,
      updateBooks,
      newBookAdded,
    };
  },
});
</script>
<style scoped></style>
