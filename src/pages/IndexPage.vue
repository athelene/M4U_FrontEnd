<template>
  <q-page class="flex-center qpage bg-image">
    <q-pull-to-refresh @refresh="refresh">
      <!--STARTING QUICK CONNECT-->
      <div>
        <qcCard
          class="qcCard q-mt-xl"
          v-if="filterType === 'memory' || filterType === 'group'"
        ></qcCard>
      </div>
      <!--ERROR MSG, BUTTON GROUP SEARCH-->
      <div class="q-pa-md items-start flex-center">
        <q-card class="q-mt-md feed-card transparent bg-secondary" flat>
          <q-card-section v-if="message">
            {{ message }}
          </q-card-section>
          <q-card-section class="q-mt-md feed-card transparent" flat>
            <!--HEADER DETERMINED BY FILTER-->
            <p class="text-h4 text-center text-info text-weight-bolder">
              {{ filterText }}

              <q-btn
                color="accent"
                v-if="filterType === 'book'"
                size="sm"
                @click="newBookDialog = true"
                >New Book</q-btn
              >
            </p>

            <!--END OF HEADER-->

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
          </q-card-section>
          <q-card-section>
            <q-item>
              <q-btn-group rounded class="absolute-center">
                <!--FILTER BUTTONS FOR MEMORIES START-->
                <q-btn-dropdown
                  color="accent"
                  icon="mdi-thought-bubble-outline"
                  rounded
                  glossy
                >
                  <q-list>
                    <q-item clickable v-close-popup @click="setFilter('all')">
                      <q-item-section>
                        <q-item-label>All Memories</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="setFilter('mine')">
                      <q-item-section>
                        <q-item-label>Memories Created by me</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="setFilter('journal')"
                    >
                      <q-item-section>
                        <q-item-label>My Journal</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      v-if="draftLabel > 0"
                      clickable
                      v-close-popup
                      @click="setFilter('drafts')"
                    >
                      <q-item-section>
                        <span v-if="draftLabel > 0"
                          >Drafts ({{ draftLabel }})</span
                        >
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="setSearch()">
                      <q-item-section>
                        <q-btn flat icon="mdi-magnify">Search Memories</q-btn>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="startFilter()">
                      <q-item-section>
                        <q-btn flat icon="mdi-filter-outline"
                          >Filter Memories</q-btn
                        >
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>

                <!--FILTER BUTTONS FOR MEMORIES END-->

                <!--FILTER BUTTONS FOR Share Group START-->
                <q-btn-dropdown
                  color="accent"
                  icon="mdi-account-multiple-outline"
                  rounded
                  glossy
                >
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="setGroup(circle.CircleID, circle.CircleName)"
                      v-for="circle in buttonList"
                      :key="circle.CircleID"
                    >
                      <q-item-section>
                        {{ circle.CircleName }} Memories</q-item-section
                      >
                    </q-item>
                  </q-list>
                </q-btn-dropdown>

                <!--FILTER BUTTONS FOR Share Group END-->

                <!--FILTER BUTTONS FOR BOOKS START-->
                <q-btn-dropdown
                  color="accent"
                  icon="mdi-book-open-page-variant-outline"
                  rounded
                  glossy
                >
                  <q-list>
                    <q-item
                      clickable
                      v-close-popup
                      @click="setFilter('allbooks')"
                    >
                      <q-item-section>
                        <q-item-label>All Books</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="setFilter('mybooks')"
                    >
                      <q-item-section>
                        <q-item-label>My Books</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-close-popup
                      @click="setFilter('timecapsule')"
                    >
                      <q-item-section>
                        <q-item-label>Time Capsules</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>

                <!--FILTER BUTTONS FOR BOOKS END-->
              </q-btn-group>
            </q-item>
            <!--START SEARCH-->
            <q-item>
              <div class="absolute-center"></div>
            </q-item>

            <!--END SEARCH-->
          </q-card-section>
          <!--SEARCH DIALOG-->
          <q-dialog v-model="searchOn" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">What do you want to search for?</div>
                <div class="q-pt-none">
                  <q-input
                    dense
                    v-model="searchTerm"
                    filled
                    type="search"
                    hint="Search"
                    autofocus
                    @keyup.enter="searchMemories()"
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel/Clear" @click="setFilter(filter)" />
                <q-btn flat label="Search" @click="searchMemories()" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--SEARCH DIALOG END-->

          <!--MEMORY TYPE DIALOG-->
          <q-dialog v-model="memoryTypeOn" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Select a type of memory</div>
                <div class="q-pt-none">
                  <q-select
                    filled
                    v-model="selectedMemoryType"
                    :options="memoryTypeOptions"
                    emit-value
                    map-options
                    @click="selectMemoryType()"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Done" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--MEMORY TYPE DIALOG END-->
        </q-card>

        <!--START OF MEMORY FEED-->

        <!--START OF MEMORY CARDS-->
        <q-infinite-scroll
          @load="getMore"
          v-if="filterType === 'memory' || filterType === 'group'"
        >
          <div v-for="story in stories" :key="story.StoryID">
            <StoryCard
              v-if="
                story.StoryTypeID === selectedMemoryType ||
                selectedMemoryType === 0
              "
              :story="story"
              @updateFeed="setFilter(filter)"
            ></StoryCard>
          </div>
          <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="accent"></q-spinner-dots>
            </div>
          </template>
        </q-infinite-scroll>
        <!--END OF MEMORY CARDS-->

        <!--START OF BOOK CARDS-->
        <q-infinite-scroll @load="getMore" v-if="filterType === 'book'">
          <div
            v-for="book in allBookList"
            :key="book.BookID"
            class="relative-center q-mt-md"
          >
            <BookCard
              :bookID="book.BookID"
              @updateFeed="setFilter(filter)"
            ></BookCard>
          </div>

          <template #loading>
            <div class="row justify-center q-my-md">
              <q-spinner-dots color="accent"></q-spinner-dots>
            </div>
          </template>
        </q-infinite-scroll>
        <!--END OF BOOK CARDS-->
      </div>

      <!--START NEW MEMORY DIALOG-->
      <q-dialog
        v-model="newMemoryOpen"
        transition-show="rotate"
        transition-hide="rotate"
      >
        <q-card tyle="min-width: 400px">
          <q-card-section>
            <q-btn icon="mdi-camera-plus" @click="startCameraDialog()"></q-btn>
            <q-dialog v-model="openCameraDialog" persistent>
              <q-card style="min-width: 400px">
                <q-card-section class="q-pt-md">
                  <q-file
                    rounded
                    outlined
                    bottom-slots
                    v-model="qUploadFle"
                    label="Click to add a photo or video"
                  >
                    <template v-slot:append>
                      <q-icon
                        v-if="qUploadFle !== null"
                        name="close"
                        @click.stop.prevent="qUploadFle = null"
                        class="cursor-pointer"
                      />
                      <q-icon name="mdi-image-plus" @click.stop.prevent />
                    </template>
                  </q-file>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                  <q-btn flat label="Cancel" v-close-popup />
                  <q-btn flat label="Save" @click="handleFileUpload()" />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!--END CAMERA DIALOG-->
          </q-card-section>
          <q-card-section width="100%">
            <div class="text-h6">New Memory</div>
            <div>
              <q-btn-group spread>
                <q-btn
                  color="accent"
                  label="Memory"
                  @click="setStoryType(1)"
                  size="sm"
                />
                <q-btn
                  color="accent"
                  label="Recipe"
                  @click="setStoryType(3)"
                  size="sm"
                />
                <q-btn
                  color="accent"
                  label="Interview"
                  @click="setStoryType(2)"
                  size="sm"
                />
                <q-btn
                  color="accent"
                  label="Tradition"
                  @click="setStoryType(4)"
                  size="sm"
                />
              </q-btn-group>
            </div>
          </q-card-section>

          <!--BEGINNING OF MEDIA FOR NEW MEMORY DIALOG-->
          <q-card-section v-if="newSlideList && newSlideCount > 0">
            <div v-for="slide in newSlideList" :key="slide.MediaID">
              <MediaCardEdit
                :media="slide"
                @updateMedia="getNewMedia()"
              ></MediaCardEdit>
            </div>
            <!--END NEW MEDIA SECTION-->

            <!--START FULLSCREEN IMAGE DIALOG-->
            <q-dialog v-model="imageFullScreen">
              <q-card class="fullScreenImage">
                <q-card-section class="row items-center q-pb-none">
                  <div class="text-h6"></div>
                  <q-space />
                  <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-card-section>
                  <q-img
                    :src="storyURL"
                    height="100%"
                    fit="contain"
                    responsive
                    fullscreen
                  >
                    <template v-slot:loading>
                      <div class="accent">
                        <q-spinner-ios />
                        <div class="q-mt-md">Loading...</div>
                      </div>
                    </template>
                  </q-img>
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-card-section>

          <!--END OF MEDIA FOR NEW MEMORY DIALOG-->

          <q-card-section class="q-pt-none">
            <!--BEGINNING OF FORM-->
            <h5 color="negative">{{ badDataMessage }}</h5>
            <q-item v-if="storyTypeID !== 2 && storyTypeID !== 4">
              <q-input
                class="titleInput"
                label="Title"
                color="m4u_text"
                v-model="storyTitle"
                rows="2"
              ></q-input>
            </q-item>

            <q-item v-if="storyTypeID === 2">
              <q-input
                class="titleInput"
                label="Interview Question"
                color="m4u_text"
                v-model="storyTitle"
                rows="2"
              >
                <template v-slot:append>
                  <q-icon
                    name="mdi-head-lightbulb-outline"
                    @click="openInterviews()"
                  />
                </template>
              </q-input>
            </q-item>

            <q-item v-if="storyTypeID === 2">
              <q-input
                class="titleInput"
                label="Interviewee Name"
                color="m4u_text"
                v-model="interviewee"
                rows="2"
              ></q-input>
            </q-item>

            <q-item v-if="storyTypeID === 4">
              <q-input
                class="titleInput"
                label="Name of Tradition"
                color="m4u_text"
                v-model="storyTitle"
                rows="2"
              >
                <template v-slot:append>
                  <q-icon
                    name="mdi-head-lightbulb-outline"
                    @click="openTraditions()"
                  />
                </template>
              </q-input>
            </q-item>

            <div v-if="storyTypeID === 3">
              Ingredients:
              <q-space />
              <q-btn-toggle
                v-model="ingEditorType"
                size="xs"
                push
                glossy
                toggle-color="primary"
                :options="[
                  { label: 'Min', value: 'small' },
                  { label: 'Full', value: 'full' },
                ]"
              />
              <!--small editor for ingredients-->

              <!--small editor for ingredients-->
              <q-editor
                v-if="ingEditorType === 'small'"
                ref="ingredientsRef"
                @paste="onPasteIng"
                v-model="storyIngredients"
                content-class="bg-primary"
                toolbar-text-color="white"
                toolbar-bg="accent"
                :toolbar="[
                  ['bold'],
                  [
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      list: 'only-icons',
                      options: ['left', 'center', 'right', 'justify'],
                    },
                  ],
                  ['unordered', 'ordered', 'outdent', 'indent'],
                ]"
              />
              <!--full editor for ingredients-->
              <q-editor
                v-model="storyIngredients"
                ref="ingredientsRef"
                @paste="onPasteIng"
                v-if="ingEditorType === 'full'"
                content-class="bg-primary"
                toolbar-text-color="white"
                toolbar-toggle-color="yellow-8"
                toolbar-bg="accent"
                :toolbar="[
                  ['bold', 'italic', 'underline'],
                  ['undo', 'redo', 'hr', 'fullscreen', 'removeFormat'],
                  [
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      list: 'only-icons',
                      options: ['left', 'center', 'right', 'justify'],
                    },
                    {
                      label: $q.lang.editor.formatting,
                      icon: $q.iconSet.editor.formatting,
                      list: 'no-icons',
                      options: [
                        'p',
                        'h1',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'h6',
                        'code',
                      ],
                    },
                    {
                      label: $q.lang.editor.defaultFont,
                      icon: $q.iconSet.editor.font,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'default_font',
                        'arial',
                        'arial_black',
                        'comic_sans',
                        'courier_new',
                        'impact',
                        'lucida_grande',
                        'times_new_roman',
                        'verdana',
                      ],
                    },
                  ],
                  ['unordered', 'ordered', 'outdent', 'indent'],
                ]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
              />
            </div>

            <div v-if="storyTypeID === 3">
              Directions:
              <q-space />
              <q-btn-toggle
                v-model="memEditorType"
                size="xs"
                push
                glossy
                toggle-color="primary"
                :options="[
                  { label: 'Min', value: 'small' },
                  { label: 'Full', value: 'full' },
                ]"
              />
            </div>
            <div v-if="storyTypeID !== 3">
              Memory text:
              <q-space />
              <q-btn-toggle
                v-model="memEditorType"
                size="xs"
                push
                glossy
                toggle-color="primary"
                :options="[
                  { label: 'Min', value: 'small' },
                  { label: 'Full', value: 'full' },
                ]"
              />
            </div>
            <div>
              <q-editor
                v-if="memEditorType === 'full'"
                ref="textRef"
                @paste="onPasteText"
                v-model="storyText"
                content-class="bg-primary"
                toolbar-text-color="white"
                toolbar-toggle-color="yellow-8"
                toolbar-bg="accent"
                :toolbar="[
                  ['bold', 'italic', 'underline'],
                  ['undo', 'redo', 'hr', 'fullscreen', 'removeFormat'],
                  [
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      list: 'only-icons',
                      options: ['left', 'center', 'right', 'justify'],
                    },
                    {
                      label: $q.lang.editor.formatting,
                      icon: $q.iconSet.editor.formatting,
                      list: 'no-icons',
                      options: [
                        'p',
                        'h1',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'h6',
                        'code',
                      ],
                    },
                    {
                      label: $q.lang.editor.defaultFont,
                      icon: $q.iconSet.editor.font,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'default_font',
                        'arial',
                        'arial_black',
                        'comic_sans',
                        'courier_new',
                        'impact',
                        'lucida_grande',
                        'times_new_roman',
                        'verdana',
                      ],
                    },
                  ],
                  ['unordered', 'ordered', 'outdent', 'indent'],
                ]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
              />
              <!--beginning of small editor for recipe directions/memory text-->
              <div v-if="memEditorType === 'small'">
                <q-editor
                  v-if="memEditorType === 'small'"
                  ref="textRef"
                  @paste="onPasteText"
                  v-model="storyText"
                  content-class="bg-primary"
                  toolbar-text-color="white"
                  toolbar-toggle-color="yellow-8"
                  toolbar-bg="accent"
                  :toolbar="[
                    ['bold'],
                    [
                      {
                        label: $q.lang.editor.align,
                        icon: $q.iconSet.editor.align,
                        fixedLabel: true,
                        list: 'only-icons',
                        options: ['left', 'center', 'right', 'justify'],
                      },
                    ],
                    ['unordered', 'ordered', 'outdent', 'indent'],
                  ]"
                />
              </div>
            </div>
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
                v-model="hidden"
                label="Share only in time capsules?"
                checked-icon="task_alt"
                color="teal"
              />
            </q-item>

            <q-item>
              <q-btn
                icon="mdi-bookshelf"
                label="Add to Books"
                flat
                class="text-accent"
                @click="openBookDialog()"
              ></q-btn
            ></q-item>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              flat
              label="Cancel"
              color="primary"
              class="q-mb-xl"
              @click="cancelNewMemory()"
            />
            <q-btn
              flat
              label="Save"
              color="primary"
              class="q-mb-xl"
              @click="draftCheck()"
            />
          </q-card-actions>
        </q-card>

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
            <q-item v-for="book in bookList" :key="book.BookID">
              <div>
                <q-checkbox
                  dense
                  color="accent"
                  v-model="book.BookStatus"
                  @click="updateMemoryBooks(book.BookID, book.BookStatus)"
                ></q-checkbox>
              </div>
              <div>
                <q-item-label>{{ book.BookTitle }}</q-item-label>
              </div>
            </q-item>
            <q-card-actions align="right">
              <q-btn flat label="DONE" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!--END ADD BOOKS INSIDE OF EDIT DIALOG-->

        <!--START TRADITIONS DIALOG-->

        <q-dialog v-model="traditionsFlag">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Select a Tradition</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-btn
              v-for="tradition in traditionList"
              :key="tradition.TraditionTypeID"
              class="full-width"
              @click="setTraditions(tradition.TraditionName)"
            >
              {{ tradition.TraditionName }}
            </q-btn>
          </q-card>
        </q-dialog>
        <!--END TRADITIONS DIALOG-->

        <!--START INTERVIEWS DIALOG-->

        <q-dialog v-model="interviewsFlag">
          <q-card>
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Select an Interview Question</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>

            <q-btn
              v-for="interview in interviewList"
              :key="interview.InterviewID"
              class="full-width"
              @click="setInterviews(interview.IntQuestion)"
            >
              {{ interview.IntQuestion }}
            </q-btn>
          </q-card>
        </q-dialog>
        <!--END INTERVIEW DIALOG-->
      </q-dialog>

      <!--END NEW MEMORY DIALOG-->

      <q-dialog v-model="saveDraft" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >You haven't chosen who to share with. Do you want to save this as
              a draft?.</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Save as Draft"
              color="primary"
              @click="addMemory()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-pull-to-refresh>
    <q-page-sticky position="top" :offset="[8, 8]">
      <q-btn
        fab
        icon="add"
        color="accent"
        size="lg"
        @click="addMemoryDialog()"
        style="z-index: 3"
      >
      </q-btn>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[8, 8]">
      <q-btn
        fab
        icon="mdi-arrow-up"
        color="accent"
        size="lg"
        @click="goToTop()"
        style="z-index: 3"
      ></q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
//import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import actions from "../actions/memories"; //
import mediaActions from "../actions/blobs";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
//import { useRouter } from "vue-router";
import QcCard from "components/QuickConnectCard.vue";
import StoryCard from "components/storyCard.vue";
import BookCard from "components/bookCard.vue";
//mport BookStoryCard from "components/bookStoryCard.vue";
import AddBook from "components/addBook.vue";
import MediaCardEdit from "components/mediaCardEdit.vue";
import bookActions from "../actions/books";
//import EditBook from "src/components/editBook.vue";

export default defineComponent({
  name: "IndexPage",
  components: {
    StoryCard,
    MediaCardEdit,
    QcCard,
    BookCard,
    AddBook,
  },
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");

    const allBookList = ref(null);
    const badDataMessage = ref("");
    const bookList = reactive([]);
    const buttonList = reactive([]);
    const circleID = ref(null);
    const circleTitle = ref(null);
    const circleList = reactive([]);
    const draftLabel = ref(0);
    const drafts = ref(false);
    const emptySlideList = [];
    const filter = ref("all");
    const filterIcon = ref("mdi-filter-outline");
    const filterType = ref("memory");
    const hidden = ref(false);
    const imageFullScreen = ref(false);
    const imageHeight = ref(200);
    const interviewee = ref(null);
    const interviewList = reactive([]);
    const interviewsFlag = ref(false);
    const memoryTypeOptions = ref([
      {
        label: "All",
        value: 0,
        description: "All",
      },
      {
        label: "Memories",
        value: 1,
      },
      {
        label: "Recipes",
        value: 3,
      },
      {
        label: "Interviews",
        value: 2,
      },
      {
        label: "Traditions",
        value: 4,
      },
    ]);

    const ingredientsRef = ref(null);
    const textRef = ref(null);
    const message = ref("");
    const memoryTypeOn = ref(false);
    const newBookDialog = ref(false);
    const newBookTitle = ref(null);
    const newMemoryOpen = ref(false);
    const newSlideCount = ref(0);
    const newSlideList = reactive([]);
    const newStartSlide = ref(0);
    const noBookMsg = ref("");
    const openCameraDialog = ref(false);
    const qUploadFle = ref(null);
    const recordLast = ref(null);
    const recordStart = ref(0);
    const resetPage = ref(false);
    const saveDraft = ref(false);
    const searchOn = ref(false);
    const searchTerm = ref("");
    const selectedMemoryType = ref(0);
    const stories = ref(null);
    const story = ref(null);
    const newStoryID = ref(null);
    const storyID = ref(0);
    const storyData = ref(null);
    const storyIngredients = ref("");
    const storyText = ref("");
    const storyTitle = ref(null);
    const storyTypeID = ref(1);
    const traditionsFlag = ref(false);
    const tcDate = ref(null);
    const traditionList = reactive([]);
    const ingEditorType = ref("small");
    const memEditorType = ref("small");
    const filterText = ref("Memories");

    const booksDialogFlag = ref(false);

    onMounted(() => {
      recordLast.value = pageLength.value;
      getAllStories(user.UserID.value);
      draftCount(user.UserID.value);
      getMessage();
      getCircleList();
      setDate();
    });

    const refresh = (done) => {
      getAllStories(user.UserID.value);
      draftCount(user.UserID.value);
      getMessage();
      done();
    };

    const goToTop = () => {
      window.scrollTo(0, 0);
    };

    const setDate = () => {
      var dateObj = new Date();
      var tcMonth = dateObj.getUTCMonth() + 1; //months from 1-12
      if (tcMonth < 10) {
        tcMonth = "0" + tcMonth;
      }
      var tcDay = dateObj.getUTCDate();
      if (tcDay < 10) {
        tcDay = "0" + tcDay;
      }
      var tcYear = dateObj.getUTCFullYear();
      tcDate.value = tcYear + "-" + tcMonth + "-" + tcDay;
    };
    const setStoryType = async (newType) => {
      storyTypeID.value = newType;
    };

    const startFilter = async () => {
      filterType.value = "memory";
      memoryTypeOn.value = !memoryTypeOn.value;
      setFilter("all");
    };

    const setFilter = async (newfilter) => {
      searchOn.value = false;
      if (newfilter !== filter.value) {
        filter.value = newfilter;
      }

      if (filterType.value === "group") {
        filter.value = "all";
        filterText.value = circleTitle.value + " Memories";
        getGroupMemories(newfilter);
      }

      //Start memory filters
      if (filter.value === "all") {
        filterType.value = "memory";
        filterText.value = "All Memories";
        getAllStories();
        draftCount();
        filterIcon.value = "mdi-filter-outline";
        return;
      }
      if (filter.value === "mine") {
        filterType.value = "memory";
        filterText.value = "My Memories";
        getMyStories();
        draftCount();
        filterIcon.value = "mdi-filter";
        return;
      }
      if (filter.value === "drafts") {
        filterType.value = "memory";
        filterText.value = "Drafts";
        getDrafts();
        draftCount();
        filterIcon.value = "mdi-filter";
        return;
      }
      if (filter.value === "journal") {
        filterType.value = "memory";
        filterText.value = "My Journal";
        getMyJournal();
        draftCount();
        filterIcon.value = "mdi-filter";
        return;
      }

      //Start book filters

      if (filter.value === "allbooks") {
        filterType.value = "book";
        filterText.value = "All Books";
        getAllBooks();
        draftCount();
        filterIcon.value = "mdi-filter";
        return;
      }

      if (filter.value === "mybooks") {
        filterType.value = "book";
        filterText.value = "My Books";
        getAllMyBooks();
        draftCount();
        filterIcon.value = "mdi-filter";
        return;
      }

      if (filter.value === "timecapsule") {
        filterType.value = "book";
        filterText.value = "Time Capsules";
        getTimeCapsules();
        draftCount();
        filterIcon.value = "mdi-filter";
        return;
      }
    };

    const getNewMedia = async () => {
      newSlideList.length = 0;
      await mediaActions.getMedia(storyID.value).then((newMedia) => {
        Object.assign(newSlideList, newMedia);
        newSlideCount.value = newMedia.length;
        newStartSlide.value = newMedia[0].MediaID;
        newMedia.forEach((media) => {
          if (media.FeatureMedia === 1) {
            newStartSlide.value = media.MediaID;
          }
        });
      });
    };

    const getMessage = async () => {
      await actions.getMessage().then((incomingMessage) => {});
    };

    const getMore = async (index, done) => {
      if (recordStart.value < recordLast.value || !recordLast.value) {
        if (filter.value === "all") {
          await getMoreAllStories();
        }
        if (filter.value === "mine") {
          await getMoreMyStories();
        }
        if (filter.value === "journal") {
          await getMoreJournal();
        }
        if (filter.value === "drafts") {
          await getMoreDrafts(index, done);
        }
        if (filter.value === "search") {
          await searchMoreMemories();
        }
      }
      done();
    };

    const getCircleList = async () => {
      await actions.getMyCircles(user.UserID).then((circles) => {
        circles.forEach((circle) => {
          circleList.push(circle);

          if (
            circle.CircleName !== "Everyone" &&
            circle.CircleName !== "Journal"
          ) {
            buttonList.push(circle);
          }
        });
      });
    };

    const setSearch = () => {
      searchOn.value = !searchOn.value;
    };

    const setMemoryType = () => {
      memoryTypeOn.value = !memoryTypeOn.value;
    };

    const draftCount = async () => {
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .getDrafts(user.UserID, recordStart.value, pageLength.value)
        .then((draftCount) => {
          drafts.value = true;
          draftLabel.value = draftCount.output.recordCount;
        });
    };

    const getDrafts = async () => {
      filter.value = "drafts";
      searchOn.value = false;
      searchTerm.value = "";
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .getDrafts(user.UserID, recordStart.value, pageLength.value)
        .then((newStories) => {
          recordLast.value = newStories.output.recordCount;
          if (newStories.output.recordCount === 0) {
            setFilter("all");
          }
          stories.value = newStories.recordsets[0];
        });
    };

    const getMoreDrafts = async (index, done) => {
      filter.value = "drafts";
      if (recordStart.value < recordLast.value || !recordLast.value) {
        recordStart.value = recordStart.value + pageLength.value;
        await actions
          .getDrafts(user.UserID, recordStart.value, pageLength.value)
          .then((newStories) => {
            stories.value.push(...newStories.recordset);
          });
      }
    };

    const getAllStories = async () => {
      filter.value = "all";
      searchOn.value = false;
      searchTerm.value = "";
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .getAllStories(user.UserID, recordStart.value, pageLength.value)
        .then((newStories) => {
          recordLast.value = newStories.output.recordCount;
          stories.value = newStories.recordsets[0];
        });
    };

    const getMoreAllStories = async (index, done) => {
      filter.value = "all";
      if (recordStart.value < recordLast.value || !recordLast.value) {
        recordStart.value = recordStart.value + pageLength.value;
        await actions
          .getAllStories(user.UserID, recordStart.value, pageLength.value)
          .then((newStories) => {
            stories.value.push(...newStories.recordset);
          });
      }
    };

    const getGroupMemories = async (circleID) => {
      filter.value = circleID;
      searchOn.value = false;
      searchTerm.value = "";
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .getGroupMemories(
          user.UserID,
          recordStart.value,
          pageLength.value,
          circleID
        )
        .then((newStories) => {
          if (typeof newStories !== "undefined") {
            recordLast.value = newStories.output.recordCount;
            stories.value = newStories.recordsets[0];
          }
        });
    };

    const getMoreGroupMemories = async (circleID, index, done) => {
      filter.value = "all";
      if (recordStart.value < recordLast.value || !recordLast.value) {
        recordStart.value = recordStart.value + pageLength.value;
        await actions
          .getGroupMemories(
            user.UserID,
            recordStart.value,
            pageLength.value,
            circleID
          )
          .then((newStories) => {
            stories.value.push(...newStories.recordset);
          });
      }
    };

    const searchMemories = async () => {
      filter.value = "all";
      filterType.value = "memory";
      searchOn.value = false;
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .searchMemories(
          user.UserID,
          recordStart.value,
          pageLength.value,
          searchTerm.value
        )
        .then((newStories) => {
          recordLast.value = newStories.output.recordCount;
          stories.value = newStories.recordsets[0];
        });
    };

    const searchMoreMemories = async () => {
      filter.value = "search";
      filterType.value = "memory";
      if (recordStart.value < recordLast.value || !recordLast.value) {
        recordStart.value = recordStart.value + pageLength.value;
        await actions
          .searchMemories(
            user.UserID,
            recordStart.value,
            pageLength.value,
            searchTerm.value
          )
          .then((newStories) => {
            stories.value.push(...newStories.recordset);
          });
      }
    };

    const getMyJournal = async () => {
      filter.value = "journal";
      searchOn.value = false;
      searchTerm.value = "";
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .getMyJournal(user.UserID, recordStart.value, pageLength.value)
        .then((newStories) => {
          recordLast.value = newStories.output.recordCount;
          stories.value = newStories.recordset;
        });
    };

    const getMoreJournal = async () => {
      filter.value = "journal";
      if (recordStart.value < recordLast.value || !recordLast.value) {
        recordStart.value = recordStart.value + pageLength.value;
        await actions
          .getMyJournal(user.UserID, recordStart.value, pageLength.value)
          .then((newStories) => {
            stories.value.push(...newStories.recordset);
          });
      }
    };

    const getMyStories = async () => {
      filter.value = "mine";
      searchOn.value = false;
      searchTerm.value = "";
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .getMyStories(user.UserID, recordStart.value, pageLength.value)
        .then((newStories) => {
          recordLast.value = newStories.output.recordCount;
          stories.value = newStories.recordset;
        });
    };

    const getMoreMyStories = async () => {
      filter.value = "mine";
      if (recordStart.value < recordLast.value || !recordLast.value) {
        recordStart.value = recordStart.value + pageLength.value;
        await actions
          .getMyStories(user.UserID, recordStart.value, pageLength.value)
          .then((newStories) => {
            stories.value.push(...newStories.recordset);
          });
      }
    };

    const setGroup = async (circleID, circleName) => {
      filterType.value = "group";
      circleTitle.value = circleName;
      setFilter(circleID);
    };

    const onPasteIng = async (evt) => {
      // Let inputs do their thing, so we don't break pasting of links.
      if (evt.target.nodeName === "INPUT") return;
      let text, onPasteStripFormattingIEPaste;
      evt.preventDefault();
      evt.stopPropagation();
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData("text/plain");
        ingredients.value.runCmd("insertText", text);
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData("text/plain");
        ingredientsRef.value.runCmd("insertText", text);
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          ingredients.value.runCmd("ms-pasteTextOnly", text);
        }
        onPasteStripFormattingIEPaste = false;
      }
    };

    const onPasteText = async (evt) => {
      // Let inputs do their thing, so we don't break pasting of links.
      if (evt.target.nodeName === "INPUT") return;
      let text, onPasteStripFormattingIEPaste;
      evt.preventDefault();
      evt.stopPropagation();
      if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
        text = evt.originalEvent.clipboardData.getData("text/plain");
        textRef.value.runCmd("insertText", text);
      } else if (evt.clipboardData && evt.clipboardData.getData) {
        text = evt.clipboardData.getData("text/plain");
        textRef.value.runCmd("insertText", text);
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          textRef.value.runCmd("ms-pasteTextOnly", text);
        }
        onPasteStripFormattingIEPaste = false;
      }
    };

    const addMemoryDialog = async () => {
      await cancelNewMemory()
        .then(async () => {
          Object.assign(newSlideList, emptySlideList);
          newStartSlide.value = 0;
          newMemoryOpen.value = true;
        })
        .then(async () => {
          await addMemory();
        });
    };

    const cancelNewMemory = async () => {
      await actions.deleteMemory(storyID.value).then(() => {
        storyTypeID.value = 1;
        storyTitle.value = "";
        storyText.value = "";
        interviewee.value = "";
        storyIngredients.value = "";
        circleID.value = null;
        hidden.value = false;
        newMemoryOpen.value = false;
        newSlideCount.value = 0;

        Object.assign(newSlideList, emptySlideList);
        newStartSlide.value = 0;
      });
    };

    const draftCheck = async () => {
      if (storyText.value !== null) {
        if (
          storyText.value.includes("<script") ||
          storyText.value.includes("&lt;script")
        ) {
          badDataMessage.value = "Invalid <script> tag. Remove it to continue.";
          return;
        }
      }
      if (storyTitle.value !== null) {
        if (
          storyTitle.value.includes("<script") ||
          storyTitle.value.includes("&lt;script")
        ) {
          badDataMessage.value = "Invalid <script> tag. Remove it to continue.";
          return;
        }
      }
      if (storyIngredients.value !== null) {
        if (
          storyIngredients.value.includes("<script") ||
          storyIngredients.value.includes("&lt;script")
        ) {
          badDataMessage.value = "Invalid <script> tag. Remove it to continue.";
          return;
        }
      }
      if (interviewee.value !== null) {
        if (
          interviewee.value.includes("<script") ||
          interviewee.value.includes("&lt;script")
        ) {
          badDataMessage.value = "Invalid <script> tag. Remove it to continue.";
          return;
        }
      }

      if (storyText.value !== null) {
        if (
          storyText.value.includes("<mg") ||
          storyText.value.includes("&lt;img")
        ) {
          badDataMessage.value = "Invalid <img> tag. Remove it to continue.";
          return;
        }
      }
      if (storyTitle.value !== null) {
        if (
          storyTitle.value.includes("<img") ||
          storyTitle.value.includes("&lt;img")
        ) {
          badDataMessage.value = "Invalid <img> tag. Remove it to continue.";
          return;
        }
      }
      if (storyIngredients.value !== null) {
        if (
          storyIngredients.value.includes("<img") ||
          storyIngredients.value.includes("&lt;img")
        ) {
          badDataMessage.value = "Invalid <img> tag. Remove it to continue.";
          return;
        }
      }
      if (interviewee.value !== null) {
        if (
          interviewee.value.includes("<img") ||
          interviewee.value.includes("&lt;img")
        ) {
          badDataMessage.value = "Invalid <img> tag. Remove it to continue.";
          return;
        }
      }

      if (circleID.value === "" || circleID.value === null) {
        saveDraft.value = true;
      }
      if (newMemoryOpen.value === true) {
        await updateNewMemory();
      } else {
        await updateMemory();
      }
    };

    const addMemory = async () => {
      saveDraft.value = false;
      var newCircleID = null;
      if (circleID.value === "") {
        newCircleID = null;
      } else {
        newCircleID = circleID.value;
      }
      storyData.value = {
        StoryTypeID: 1,
        StoryTitle: "",
        StoryText: "",
        Interviewee: "",
        StoryIngredients: "",
        Hidden: 0,
      };
      await actions
        .newMemory(user.UserID, storyData.value, newCircleID)
        .then((newID) => {
          newStoryID.value = newID[0].InsertedId;
          storyID.value = newID[0].InsertedId;
        });
    };

    const handleFileUpload = async () => {
      openCameraDialog.value = false;
      let formData = new FormData();
      formData.append("file", qUploadFle.value);
      formData.append("userID", user.UserID);
      formData.append("storyID", storyID.value);
      formData.append("reauthToken", reauthToken);

      await mediaActions
        .addNewBlob(formData)
        .then((ret) => {
          qUploadFle.value = null;
        })
        .then(() => {
          getNewMedia();
        });
    };

    const updateMemory = async () => {
      saveDraft.value = false;
      if (circleID.value === "" || circleID.value === null) {
        circleID.value = null;
      } else {
        circleID.value = Number(circleID.value);
      }
      if (newMemoryOpen.value === true) {
        storyData.value = {
          StoryID: storyID.value,
          StoryTypeID: storyTypeID.value,
          StoryTitle: storyTitle.value,
          StoryText: storyText.value,
          Interviewee: interviewee.value,
          StoryIngredients: storyIngredients.value,
          Hidden: hidden.value,
        };
      } else {
        storyData.value = {
          StoryID: newStoryID.value,
          StoryTypeID: storyTypeID.value,
          StoryTitle: storyTitle.value,
          StoryText: storyText.value,
          Interviewee: interviewee.value,
          StoryIngredients: storyIngredients.value,
          Hidden: hidden.value,
        };
      }

      await actions
        .updateMemory(storyData.value, circleID.value, storyTypeID.value)
        .then(() => {
          setFilter(filter.value);
        })
        .then(() => {
          newMemoryOpen.value = false;
          storyTypeID.value = 1;
          storyTitle.value = "";
          storyText.value = "";
          interviewee.value = "";
          storyIngredients.value = "";
          circleID.value = null;
          hidden.value = false;
          newMemoryOpen.value = false;
          newSlideCount.value = 0;

          Object.assign(newSlideList, emptySlideList);
          newStartSlide.value = 0;
        });
    };

    const updateNewMemory = async () => {
      saveDraft.value = false;
      if (circleID.value === "" || circleID.value === null) {
        circleID.value = null;
      } else {
        circleID.value = Number(circleID.value);
      }
      if (newMemoryOpen.value === true) {
        storyData.value = {
          StoryID: newStoryID.value,
          StoryTypeID: storyTypeID.value,
          StoryTitle: storyTitle.value,
          StoryText: storyText.value,
          Interviewee: interviewee.value,
          StoryIngredients: storyIngredients.value,
          Hidden: hidden.value,
        };
      }

      await actions
        .updateMemory(storyData.value, circleID.value, storyTypeID.value)
        .then(() => {
          setFilter(filter.value);
        })
        .then(() => {
          newMemoryOpen.value = false;
          storyTypeID.value = 1;
          storyTitle.value = "";
          storyText.value = "";
          interviewee.value = "";
          storyIngredients.value = "";
          circleID.value = null;
          hidden.value = false;
          newMemoryOpen.value = false;
          newSlideCount.value = 0;

          Object.assign(newSlideList, emptySlideList);
          newStartSlide.value = 0;
        });
    };
    const startCameraDialog = async () => {
      openCameraDialog.value = !openCameraDialog.value;
    };

    const openBookDialog = async () => {
      getMyBooksToAdd();
      booksDialogFlag.value = true;
    };

    const openTraditions = async () => {
      traditionsFlag.value = true;
      getTraditions();
    };

    const openInterviews = async () => {
      interviewsFlag.value = true;
      getInterviews();
    };

    const updateMemoryBooks = async (bookID, bookStatus) => {
      if (bookStatus === true) {
        await bookActions.addToBooks(bookID, storyID.value).then(async () => {
          await getMyBooksToAdd();
        });
      }
      if (bookStatus === null || bookStatus === false) {
        await bookActions
          .removeFromBooks(bookID, props.story.StoryID)
          .then(async () => {
            await getMyBooksToAdd();
          });
      }
    };

    const getMyBooksToAdd = async () => {
      await bookActions
        .getBooksToAddStory(user.UserID, storyID.value)
        .then((books) => {
          Object.assign(bookList, books);
          if (books.length === 0) {
            noBookMsg.value = true;
          }
        });
    };

    const getTraditions = async () => {
      await actions.getTraditions().then((traditions) => {
        Object.assign(traditionList, traditions);
      });
    };

    const setTraditions = async (traditionName) => {
      storyTitle.value = traditionName;
      traditionsFlag.value = false;
    };

    const getInterviews = async () => {
      await actions.getInterviews().then((interviews) => {
        Object.assign(interviewList, interviews);
      });
    };

    const setInterviews = async (interviewName) => {
      storyTitle.value = interviewName;
      interviewsFlag.value = false;
    };

    const getAllBooks = async () => {
      await bookActions.getAllBooks(user.UserID).then((books) => {
        allBookList.value = books;
      });
    };

    const getAllMyBooks = async () => {
      await bookActions.getAllMyBooks(user.UserID).then((books) => {
        allBookList.value = books;
      });
    };

    const getTimeCapsules = async () => {
      await bookActions.getTimeCapsules(user.UserID).then((books) => {
        allBookList.value = books;
      });
    };

    const newBookAdded = async () => {
      newBookDialog.value = false;
      getMyBooksToAdd();
      setFilter(filter.value);
    };

    const getBookMemoryList = async (bookID) => {
      await bookActions.getBookMemoryList(bookID).then((memoryList) => {
        getBookMemoryList.value = memoryList;
      });
    };

    const openBookDispDialog = async (
      bookID,
      bookOwner,
      bookTitle,
      bookUserDisplayName
    ) => {
      bookSlide.value = "toc";
      bookDialog.value = true;
      openBookID.value = bookID;
      openBookOwnerID.value = bookOwner;
      openBookTitle.value = bookTitle;
      openBookUserDisplayName.value = bookUserDisplayName;
      getBookContent(openBookID.value);
    };

    const updateBookTitle = async (event) => {
      openBookTitle.value = event;
      editBookTitleDialog.value = false;
    };

    const getBookContent = async (bookID) => {
      await bookActions.getBookContent(user.UserID, bookID).then((retList) => {
        bookMemoryList.value = retList;
        if (retList.length > 0) {
          bookContent.value = true;
        } else {
          bookContent.value = false;
        }
      });
    };

    return {
      refresh,
      user,
      token,
      isLoggedIn,

      addMemory,
      addMemoryDialog,
      allBookList,
      badDataMessage,
      bookList,
      booksDialogFlag,
      buttonList,
      cancelNewMemory,
      circleID,
      circleList,
      circleTitle,
      draftCheck,
      draftLabel,
      ingredientsRef,
      filter,
      filterIcon,
      filterText,
      filterType,
      getGroupMemories,
      getMoreGroupMemories,
      getInterviews,
      getMore,
      getMoreAllStories,
      getNewMedia,
      getTraditions,
      goToTop,
      handleFileUpload,
      hidden,
      imageFullScreen,
      imageHeight,
      ingEditorType,
      interviewee,
      interviewsFlag,
      interviewList,
      memEditorType,
      memoryTypeOn,
      memoryTypeOptions,
      message,
      newBookAdded,
      newBookDialog,
      newBookTitle,
      newMemoryOpen,
      newSlideList,
      newSlideCount,
      noBookMsg,
      onPasteIng,
      onPasteText,
      openBookDialog,
      openBookDispDialog,
      openCameraDialog,
      openTraditions,
      openInterviews,
      qUploadFle,
      saveDraft,
      searchOn,
      searchMemories,
      searchTerm,
      startFilter,
      selectedMemoryType,
      setFilter,
      setGroup,
      setInterviews,
      setMemoryType,
      setSearch,
      setStoryType,
      setTraditions,
      startCameraDialog,
      stories,
      storyID,
      storyIngredients,
      storyText,
      storyTitle,
      storyTypeID,
      tcDate,
      textRef,
      traditionsFlag,
      traditionList,
      updateBookTitle,
      updateMemory,
      updateMemoryBooks,
    };
  },
});
</script>
<style scoped>
.editorStyle {
  width: 50%;
}
.feed-card {
  width: 75%;
  margin: auto;
}

.newBookDialog {
  width: 85%;
  margin: auto;
}

.bookCard {
  cursor: pointer;
  cursor: hand;
  width: 100px;
}

.cardColor {
  background-color: #ffffff;
}
.qc-card {
  width: 85%;
  margin-top: 10%;
  padding-top: 15%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: auto;
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

.titleInput {
  width: 100%;
}
</style>
