<template>
  <q-page class="flex-center qpage bg-image">
    <!--STARTING SHARE GROUPS PAGE-->
    <q-card class="q-mt-md feed-card text-accent" flat>
      <div class="q-ml-lg" v-if="mobileMsg === true">
        <h6 class="text-h5 text-info">
          Exports cannot be done from a mobile device. Please log in to
          www.memoriesforus.com on a PC to download your data.
        </h6>
      </div>

      <div class="q-ml-lg" v-if="mobileMsg === false">
        <p class="text-h5 text-info">Export Memories Ready</p>
        <div>
          <p v-if="exportFinished === true">
            Your files have been downloaded. Check your download folders for
            memories.html and media.zip.
          </p>
          <q-btn
            :disable="buttonOpen"
            color="primary"
            label="Start Download"
            @click="getDownload()"
            v-if="!exportFinished"
          />
          <p v-if="exportFinished === true">
            To use your files, create a folder on your device, move the
            memories.html file into that folder. Then unzip the media.zip file
            into the folder. Once you have done that, you can open the
            memories.html file to see your information and the pictures and
            videos that go with them.
          </p>
        </div>
        <q-inner-loading :showing="spinner">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
        <q-card q-gutter-md> </q-card>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useQuasar } from "quasar";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import exportActions from "../actions/exports";

export default defineComponent({
  name: "ExportCompletedPage",

  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const $q = useQuasar();
    const lastExport = ref(null);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const spinner = ref(false);
    const mobileMsg = ref(false);
    const buttonOpen = ref(false);
    const exportFinished = ref(false);

    onMounted(async () => {});

    const enableButton = () => {
      buttonOpen.value = true;
      spinner.value = false;
    };

    const getDownload = async () => {
      spinner.value = true;
      try {
        await exportActions
          .getExportHtml(user.UserID)
          .then(async () => {
            await exportActions.getExportZip(user.UserID);
          })
          .then((retStatus) => {
            spinner.value = false;
            var today = new Date();
            var dd = String(today.getDate() + 1).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
            var yyyy = today.getFullYear();
            lastExport.value = yyyy + "-" + mm + "-" + dd;
          })
          .then(() => {
            spinner.value = false;
            buttonOpen.value = false;
            exportFinished.value = true;
            exportActions.resetReady(user.UserID);
          });
      } catch (error) {}
    };
    return {
      getDownload,
      enableButton,
      exportFinished,
      buttonOpen,
      lastExport,
      spinner,
      mobileMsg,
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
