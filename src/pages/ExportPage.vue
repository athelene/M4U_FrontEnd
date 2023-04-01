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
        <p class="text-h5 text-info">
          Export Memories
          <q-icon
            name="mdi-information-outline"
            size="xs"
            @click="getInfo = true"
          ></q-icon>
        </p>
        <div v-if="exportStarted === false">
          <h5 v-if="exportEarly === false && exportReady !== true">
            Warning! This could take 5 or 10 minutes to complete. Do not close
            the window while the export is taking place.
          </h5>
          <q-btn
            label="Start Export"
            @click="getExport()"
            v-if="exportEarly === false && exportReady !== true"
          ></q-btn>
          <q-inner-loading :showing="spinner">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>

          <p
            v-if="exportEarly === false && exportReady !== true"
            class="q-pa-lg"
          >
            We will take care of your memories. But it's your data. If you'd
            like to download a copy, please click the button above. Because we
            pay for the uploading and downloading of your data, we only allow
            you to download your data once every 90 days.
          </p>

          <q-dialog v-model="exportDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">Exports</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <p class="text-h6">
                  Your are being created. They will be available in 24 hours.
                  Check back on this page after 24 hours to download them. You
                  will have 3 days to download them after they are available.
                </p>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <p v-if="exportReady === true">
            Your files are ready! Click the button below to start your download.
          </p>
          <p v-if="exportReady === true">
            <q-btn @click="getDownload()">Download Files</q-btn>
          </p>
          <p v-if="exportReady === true">
            To use your files, create a folder on your device, move the
            memories.html file into that folder. Then unzip the media.zip file
            into the folder. Once you have done that, you can open the
            memories.html file to see your information and the picture and
            videos that go with them.
          </p>

          <h6 v-if="exportEarly === true">
            Your last export was on {{ lastExport }}. You can only download your
            data once in 90 days.
          </h6>
          <q-dialog v-model="getInfo">
            <q-card>
              <q-card-section>
                <div class="text-h6">Exports</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <p class="text-h6">
                  You can export the information from your memories with links
                  to the media.
                </p>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <q-dialog v-model="exportErr">
            <q-card>
              <q-card-section>
                <div class="text-h6">Export Request Too Soon</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <p class="text-h6">
                  {{ exportDateErr }}
                </p>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-dialog v-model="exportRequest">
            <q-card>
              <q-card-section>
                <div class="text-h6">Export Request Sent</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <p class="text-h6">
                  Your request for the export has been sent. When it is ready,
                  you will receive an email with instructions on how to download
                  it.
                </p>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <div v-if="exportStarted === true">
          <p>
            Your export files are being created. You requested the export on
            {{ lastExport }}. It can take 24 hours for your files to be
            prepared. Once your files are available, you will have 3 days to
            download them. Please check this page again after the 24 hour
            period.
          </p>
        </div>
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
  name: "ConnectionPage",

  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const $q = useQuasar();
    const lastExport = ref(null);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const getInfo = ref(false);
    const exportRequest = ref(false);
    const stories = ref(false);
    const exportDateErr = ref("");
    const exportErr = ref(false);
    const exportReady = ref(false);
    const exportStarted = ref(false);
    const exportEarly = ref(true);
    const exportDialog = ref(false);
    const spinner = ref(false);
    const mobileMsg = ref(false);

    onMounted(async () => {
      lastExport.value = await exportActions
        .getExportDate(user.UserID)
        .then(async (retDate) => {
          var today = new Date();
          var recordedDate = new Date(retDate.LastExport);
          var compareDate = new Date(retDate.LastExport);
          compareDate.setDate(recordedDate.getDate() + 90);
          var windowDate = new Date(retDate.LastExport);
          windowDate.setDate(recordedDate.getDate() + 3);
          var dd = String(recordedDate.getDate()).padStart(2, "0");
          var mm = String(recordedDate.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = recordedDate.getFullYear();
          var dateReturned = yyyy + "-" + mm + "-" + dd;

          if (today < compareDate) {
            exportEarly.value = true;
            if (retDate.ExportStarted === 1) {
              exportEarly.value = false;
              exportReady.value = true;
            }
          } else {
            exportEarly.value = false;
            exportReady.value = false;
          }

          if (today < windowDate && retDate.ExportStarted === true) {
            exportStarted.value = true;
          } else {
            exportStarted.value = false;
          }

          return dateReturned;
        });

      if ($q.platform.is.mobile) {
        mobileMsg.value = true;
      } else {
        mobileMsg.value = false;
      }
    });

    const getExport = async () => {
      spinner.value = true;
      try {
        await exportActions.getExport(user.UserID).then(async (memories) => {
          console.log("memories is: ", memories);
          if (memories === "invalid date") {
            exportDateErr.value =
              "You may only request a download once every 90 days.";
            exportErr.value = true;
            spinner.value = false;
            exportStarted.value = false;
          } else {
            exportReady.value = false;
            exportStarted.value = true;
            exportDialog.value = true;
            spinner.value = false;
          }
        });
      } catch (error) {}
    };

    const getDownload = async () => {
      try {
        console.log("downloading zip");
        await exportActions
          .getExportHtml(user.UserID)
          .then(async () => {
            await exportActions.getExportZip(user.UserID);
          })
          .then((retStatus) => {
            exportReady.value = true;
            var today = new Date();
            var dd = String(today.getDate() + 1).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
            var yyyy = today.getFullYear();
            lastExport.value = yyyy + "-" + mm + "-" + dd;
            exportDialog.value = false;
          })
          .then(() => {
            exportActions.resetReady();
          });
      } catch (error) {}
    };
    return {
      stories,
      getInfo,
      getDownload,
      getExport,
      exportDateErr,
      exportErr,
      exportRequest,
      exportReady,
      exportStarted,
      exportDialog,
      exportEarly,
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
