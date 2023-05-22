<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg">
        <p class="text-h5 text-info">MEMORIES FOR US NEWS</p>
      </div>
      <div class="text-center relative-center" id="list">
        <q-list bordered separator class="justify-center groupList">
          <div
            v-for="item in news"
            :key="item.NewsID"
            class="text-center justify-center relative-center"
          >
            <q-item-section class="relative-center text-center">
              <q-item
                clickable
                v-ripple
                @click="
                  newsOpen(
                    item.NewsTitle,
                    item.NewsText,
                    item.DispNewsDate,
                    item.NewsID,
                    item.Status
                  )
                "
              >
                <q-item-label
                  class="text-accent"
                  v-if="item.Status === 'unread'"
                >
                  <div>
                    <q-icon name="mdi-email"></q-icon> {{ item.NewsTitle }}
                  </div>
                  <div class="text-info text-caption">
                    {{ item.DispNewsDate }}
                  </div>
                </q-item-label>

                <q-item-label class="text-info" v-if="item.Status === 'read'">
                  <div>
                    <q-icon name="mdi-email-open"></q-icon> {{ item.NewsTitle }}
                  </div>
                  <div class="text-info text-caption">
                    {{ item.DispNewsDate }}
                  </div>
                </q-item-label>
              </q-item>
            </q-item-section>
          </div>
        </q-list>
      </div>

      <!--Beginning of View News -->
      <q-dialog v-model="newsDialog" persistent>
        <q-card style="min-width: 350px" class="text-info">
          <q-card-section>
            <q-card-section class="row items-center q-pb-none">
              <q-space />
              <q-btn icon="close" flat round dense @click="markRead()" />
            </q-card-section>
            <div class="text-h6 text-accent">
              {{ newsTitle }}, <span class="text-caption">{{ newsDate }}</span>
            </div>
            <div class="text-body1 q-pt-sm">
              {{ newsText }}
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
//import shareActions from "../actions/share"; //
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import newsActions from "../actions/news";

export default defineComponent({
  name: "SharePage",
  components: {},
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);

    const newsDialog = ref(false);
    const newsID = ref(null);
    const news = ref(null);
    const newsTitle = ref(null);
    const newsText = ref(null);
    const newsDate = ref(null);
    const newsStatus = ref(null);
    const read = "text-center secondary";
    const unread = "text-center dark";

    onMounted(() => {
      getNews();
    });

    const getNews = async () => {
      await newsActions
        .getNews(userState.user.UserID, userState.user.UserSubType)
        .then((newsArticles) => {
          news.value = newsArticles;
          console.log(news.value);
        });
    };

    const newsOpen = async (title, text, date, id, readStatus) => {
      newsID.value = id;
      newsTitle.value = title;
      newsText.value = text;
      newsDate.value = date;
      console.log("newsStatus is: ", newsStatus);
      newsStatus.value = readStatus;
      newsDialog.value = true;
    };

    const markRead = async () => {
      if (newsStatus.value === "unread") {
        await newsActions
          .markRead(userState.user.UserID, newsID.value)
          .then(() => {
            getNews();
            newsDialog.value = false;
          });
      } else {
        newsDialog.value = false;
      }
    };

    return {
      getNews,
      newsDialog,
      newsID,
      news,
      newsTitle,
      newsText,
      newsDate,
      newsOpen,
      markRead,
    };
  },
});
</script>
<style scoped>
.feed-card {
  width: 75%;
  margin: auto;
}

.qpage {
  width: 100%;
  padding-top: 10%;
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
