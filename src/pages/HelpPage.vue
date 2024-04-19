<template>
  <q-page class="flex-center qpage bg-image">
    <q-pull-to-refresh @refresh="refresh">
      <!--ERROR MSG, BUTTON GROUP SEARCH-->
      <div class="q-pa-md items-start flex-center">
        <q-card class="q-mt-md feed-card transparent bg-secondary" flat>
          <!--MESSAGE SECTION-->
          <q-card-section v-if="message">
            {{ message }}
          </q-card-section>

          <!--HELP INFO SECTION-->
          <q-card-section class="q-mt-md feed-card transparent" flat>
            <!--HEADER DETERMINED BY FILTER-->
            <div
              class="text-h5 text-center text-accent text-weight-bolder filterTitle bg-secondary"
            >
              Help
            </div>

            <!--END OF HEADER-->
          </q-card-section>

          <!-- Help Category Select-->
          <div
            class="text-h5 text-center text-accent text-weight-bolder filterTitle"
          >
            <q-btn
              v-if="selectOn === false"
              label="Choose a category"
              @click="selectOn = true"
              color="accent"
              text-color="secondary"
            ></q-btn>
          </div>

          <!--SELECTDIALOG-->
          <q-dialog v-model="selectOn" persistent>
            <q-card style="min-width: 350px">
              <q-card-section>
                <div class="text-h6">Choose a category</div>
                <div class="q-pt-none">
                  <q-list bordered separator>
                    <q-item clickable v-ripple @click="setHelpType(0)"
                      >All Categories</q-item
                    >

                    <q-item
                      clickable
                      v-ripple
                      @click="setHelpType(type.HelpTypeID)"
                      v-for="type in helpTypes"
                      :key="type.HelpTypeID"
                    >
                      <q-item-section>{{ type.HelpType }}</q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn
                  v-if="selectOn === true"
                  flat
                  label="Cancel/Clear"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <!--Select DIALOG END-->
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
        </q-card>
      </div>
      <!--START OF MEMORY FEED-->

      <!--START OF MEMORY CARDS-->
      <q-infinite-scroll @load="getMoreHelp">
        <div v-for="help in helpArticles" :key="help.StoryID">
          <q-card
            class="q-mt-md feed-card bg-secondary"
            flat
            @click="showHelp = true"
          >
            <q-card-section>
              <span class="text-h6">{{ help.StoryTitle }}</span>
            </q-card-section>
          </q-card>

          <q-dialog v-model="showHelp">
            <q-card>
              <q-card-section class="row items-center q-pb-none">
                <div class="text-h6">{{ help.StoryTitle }}</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>

              <q-card-section>
                <HelpCard
                  :help="help"
                  @updateFeed="setFilter(filter)"
                  v-if="selectOn === false"
                ></HelpCard>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
        <template #loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="accent"></q-spinner-dots>
          </div>
        </template>
      </q-infinite-scroll>
      <!--END OF MEMORY CARDS-->
    </q-pull-to-refresh>

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
import actions from "../actions/help";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
//import { useRouter } from "vue-router";
import HelpCard from "components/helpCard.vue";
//import MediaCard from "components/mediaCard.vue";
//mport { createIfStatement } from "@vue/compiler-core";

export default defineComponent({
  name: "IndexPage",
  components: {
    HelpCard,
  },
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");

    const badDataMessage = ref("");
    const showHelp = ref(false);
    const buttonList = reactive([]);
    const filter = ref("all");
    const filterIcon = ref("mdi-filter-outline");
    const filterType = ref("memory");
    const hidden = ref(false);
    const imageFullScreen = ref(false);
    const imageHeight = ref(200);
    const helpTypes = ref(null);
    const textRef = ref(null);
    const message = ref("");
    const memoryTypeOn = ref(false);
    const openCameraDialog = ref(false);
    const progress = ref(false);
    const qUploadFle = ref(null);
    const recordLast = ref(0);
    const recordStart = ref(0);
    const resetPage = ref(false);
    const searchOn = ref(false);
    const searchTerm = ref("");
    const selectOn = ref(false);
    const selectedCategory = ref(3);
    const stories = ref(null);
    const help = ref([
      {
        HelpID: 0,
        HelpTitle: "Welcome to Memories for Us!",
        HelpText: "Help text.",
        HelpTypeID: 9,
        HelpDate: "2023-06-01",
      },
    ]);
    const helpID = ref(0);
    const helpArticles = ref(null);
    const helpText = ref("");
    const helpTitle = ref(null);
    const helpTypeID = ref(1);
    const filterText = ref("Memories");

    onMounted(() => {
      recordLast.value = pageLength.value;
      getAllHelp();
      getHelpTypes();
      getMessage();
    });

    const refresh = (done) => {
      getAllHelp();
      getMessage();
      done();
    };

    const goToTop = () => {
      window.scrollTo(0, 0);
    };

    const setHelpType = async (newType) => {
      helpTypeID.value = newType;
      if (newType === 0) {
        getAllHelp();
      } else {
        getTypeHelp();
      }
      selectOn.value = false;
    };

    const setFilter = async (newfilter) => {
      searchOn.value = false;

      if (newfilter !== filter.value) {
        filter.value = newfilter;
      }

      //Start memory filters
      if (filter.value === "all") {
        filterType.value = "memory";
        filterText.value = "All Help";
        getAllHelp();
        filterIcon.value = "mdi-filter-outline";
        return;
      }
    };

    const getMessage = async () => {
      await actions.getMessage().then((incomingMessage) => {});
    };

    const setSearch = () => {
      searchOn.value = !searchOn.value;
    };

    const getAllHelp = async () => {
      filter.value = "all";
      searchOn.value = false;
      searchTerm.value = "";
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .getAllHelp(recordStart.value, pageLength.value)
        .then((newHelp) => {
          recordLast.value = newHelp.output.recordCount;
          helpArticles.value = newHelp.recordset;
          recordStart.value = recordStart.value + pageLength.value;
        });
    };

    const getMoreHelp = async (index, done) => {
      filter.value = "all";
      recordStart.value = recordStart.value + pageLength.value;
      if (recordStart.value < recordLast.value || !recordLast.value) {
        await actions
          .getAllHelp(recordStart.value, pageLength.value)
          .then((newHelp) => {
            help.value.push(...newHelp.recordset);
          });
      }
    };

    const searchHelp = async () => {
      filter.value = "search";
      filterType.value = "memory";
      searchOn.value = false;
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .searchHelp(
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

    const searchMoreHelp = async () => {
      filter.value = "search";
      filterType.value = "memory";
      if (recordStart.value < recordLast.value || !recordLast.value) {
        recordStart.value = recordStart.value + pageLength.value;
        await actions
          .searchHelp(
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

    const getHelpTypes = async () => {
      await actions.getHelpTypes().then((types) => {
        helpTypes.value = types;
      });
    };

    const getTypeHelp = async () => {
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await actions
        .getTypeHelp(recordStart.value, pageLength.value, helpTypeID.value)
        .then((newHelp) => {
          recordLast.value = newHelp.output.recordCount;
          helpArticles.value = newHelp.recordset;
          recordStart.value = recordStart.value + pageLength.value;
        });
    };

    return {
      refresh,
      user,
      token,
      isLoggedIn,
      badDataMessage,
      buttonList,
      filter,
      filterIcon,
      filterText,
      filterType,
      getAllHelp,
      getMoreHelp,
      goToTop,
      helpArticles,
      helpTypes,
      hidden,
      imageFullScreen,
      imageHeight,
      memoryTypeOn,
      message,
      progress,
      searchOn,
      searchHelp,
      searchMoreHelp,
      searchTerm,
      selectedCategory,
      selectOn,
      setFilter,
      setSearch,
      setHelpType,
      showHelp,
      stories,
      helpID,
      helpText,
      helpTitle,
      helpTypeID,
      textRef,
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

.cardColor {
  background-color: #ffffff;
}

.qpage {
  width: 100%;
  padding-top: 10%;
}

.imageBtnBackground {
  background-color: #fefbee;
}

.bg-image {
  background-image: url(../../m4u_background.jpg);
  background-size: cover;
  background-repeat: none;
  background-attachment: fixed;
}

.filterTitle {
  border-radius: 40%;
  padding: 10px;
  margin: auto;
}
.titleInput {
  width: 100%;
}
</style>
