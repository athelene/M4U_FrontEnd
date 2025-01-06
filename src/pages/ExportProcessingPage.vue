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
      <div class="q-ml-lg" v-if="mobileMsg !== true">
        <p class="text-h5 text-info">Export Memories Processing</p>
        <div>
          <p>
            You requested your export on {{ lastExport }} and the files are
            being processed. This will take at least 24 hours. Please come back
            to this page after that time to access the files.
          </p>
        </div>
      </div>
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
import exportActions from "../actions/exports";

export default defineComponent({
  name: "ExportProcessingPage",

  setup() {
    const router = useRouter();
    const route = useRoute();
    const userState = useUserStore();
    const user = reactive(userState.user);
    const $q = useQuasar();
    const lastExport = ref(null);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const mobileMsg = ref(false);

    onMounted(async () => {
      if ($q.platform.is.mobile) {
        mobileMsg.value = true;
      } else {
        mobileMsg.value = false;
      }

      getLastExported();
    });

    const getLastExported = async () => {
      await exportActions.getExportDate(user.UserID).then((retDate) => {
        var today = new Date();
        var recordedDate = new Date(retDate.LastExport);
        var compareDate = new Date(retDate.LastExport);
        compareDate.setDate(recordedDate.getDate() + 1);

        if (today > compareDate && retDate.ExportStarted === 1) {
          router.push("/exportComplete");
        }
        //         var windowDate = new Date(retDate.LastExport);
        //        windowDate.setDate(recordedDate.getDate() + 3);
        var dd = String(recordedDate.getDate()).padStart(2, "0");
        var mm = String(recordedDate.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = recordedDate.getFullYear();
        lastExport.value = yyyy + "-" + mm + "-" + dd;
      });
    };

    return {
      lastExport,
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
  background-image: url(../../m4u_background.jpg);
  background-size: contain;
  background-repeat: repeat;
}

.groupList {
  width: 100%;
  font-size: 1.25em;
  text-align: center;
}
</style>
