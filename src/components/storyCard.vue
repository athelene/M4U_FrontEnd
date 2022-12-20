<template>
  <div class="q-mb-md">
    <q-card vertical class="cardColor flat q-ma-md feed-card">
      <!--NEW MEDIA SECTION-->
      <q-card-section v-if="slideList && slideList.length > 0" class="q-pt-md">
        <q-carousel
          v-model="startSlide"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="accent"
          navigation
          arrows
          class="mediaBackground flat shadow-1 rounded-borders"
        >
          <q-carousel-slide
            :name="slide.MediaID"
            autoplay="true"
            class="column no-wrap flex-center"
            v-for="slide in slideList"
            :key="slide.MediaID"
          >
            <MediaCard :media="slide"></MediaCard>
          </q-carousel-slide>
        </q-carousel>
      </q-card-section>
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

      <!--END FULLSCREEN IMAGE DIALOG-->

      <!--START MEMORY DETAILS SECTION-->
      <q-card-section class="text-overline">
        <q-avatar rounded>
          <img :src="storySasKey" />
        </q-avatar>
        {{ story.UserDisplayName }}, {{ story.date }}
        <q-btn
          class="text-accent"
          flat
          round
          icon="mdi-pencil-outline"
          @click="openEditMemory()"
          v-if="story.Userid === user.UserID"
        ></q-btn>
        <q-btn
          class="text-accent"
          flat
          round
          icon="mdi-delete-forever-outline"
          v-if="story.Userid === user.UserID"
          @click="verifyDelete()"
        ></q-btn>

        <!--DIALOG TO VERIFY DELETING A MEMORY-->
        <q-dialog v-model="verifyDeleteDialog" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <span class="q-ml-sm"
                >CAUTION! Are you sure you want to delete this memory?</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                flat
                label="Permenantly Delete"
                color="primary"
                @click="deleteMemory()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-card-section>
      <!--STARTING THE DETAILS SECTION OF THE STORY CARD-->
      <q-card-section class="col-4 text-h3" @click="fullScreenDialog = true">
        <div class="text-h6 text-accent q-mb-sm">
          <div class="text-h6" v-if="story.StoryTypeID === 2">
            Interview of {{ story.Interviewee }}
          </div>
          <div class="text-h5" v-if="story.StoryTypeID === 4">Tradition</div>
          {{ story.StoryTitle }}
          <span v-if="story.StoryTypeID !== 3">
            <div v-html="story.StoryText" class="preview-text text-body1"></div>
          </span>
        </div>
        <div class="preview-text">
          <div class="text-body1" v-if="story.StoryTypeID === 3">
            <div class="text-body1 preview-text"></div>
            <span
              class="text-subtitle1 text-weight-bold text-accent"
              v-if="story.StoryTypeID === 3"
            >
              <div>Ingredients</div></span
            >
            <div
              v-html="story.StoryIngredients"
              class="text-body1 text-accent"
              v-if="story.StoryTypeID === 3"
            ></div>
            <span
              class="text-subtitle1 text-weight-bold text-accent"
              v-if="story.StoryTypeID === 3"
            >
              <div>Directions:</div></span
            >
            <div v-html="story.StoryText" class="text-body1 text-accent"></div>
          </div>
        </div>
        <!--END MEMORY DETAILS SECTION-->
      </q-card-section>
      <!--  ENDING THE DETAILS SECTION OF THE STORY CARD -->

      <!--STARTING THE COMMENTS SECTION-->
      <q-card-section>
        <div v-if="commentsOpen">
          <q-card style="max-width: 90%">
            <q-card-section class="row items-center q-pb-none">
              <div class="text-h6">Add a comment</div>
              <q-space />
              <q-btn
                icon="close"
                flat
                round
                dense
                @click="commentsOpen = false"
              />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                type="textarea"
                v-model="newComment"
                autofocus
                @keyup.enter="addComment()"
                rows="2"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Clear" @click="newComment = null" />
              <q-btn flat label="Add Comment" @click="addComment()" />
            </q-card-actions>
          </q-card>
          <div
            v-for="comment in comments"
            :key="comment.CommentID"
            class="commentDiv q-ma-md"
          >
            <q-btn
              v-if="comment.UserID === user.UserID"
              size="sm"
              round
              icon="mdi-close-circle"
              @click="deleteComment(comment.CommentID)"
            ></q-btn>
            <span class="commentHeader">
              {{ comment.UserDisplayName }}, {{ comment.CommentDate }} :
            </span>
            {{ comment.CommentText }}
          </div>
        </div>

        <!--START FULLSCREEN DIALOG-->
        <q-dialog
          v-model="fullScreenDialog"
          persistent
          :maximized="maximizedToggle"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card class="bg-primary">
            <q-bar>
              <q-space />

              <q-btn
                dense
                flat
                icon="minimize"
                @click="maximizedToggle = false"
                :disable="!maximizedToggle"
              >
                <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
                  >Minimize</q-tooltip
                >
              </q-btn>
              <q-btn
                dense
                flat
                icon="crop_square"
                @click="maximizedToggle = true"
                :disable="maximizedToggle"
              >
                <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
                  >Maximize</q-tooltip
                >
              </q-btn>
              <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
              </q-btn>
            </q-bar>

            <!--START OF MEDIA SECTION FOR FULLSCREEN DIALOG-->
            <q-card-section v-if="slideList && slideList.length > 0">
              <q-btn dense flat icon="mdi-arrow-left" v-close-popup>
                <q-tooltip class="bg-white text-primary">Close</q-tooltip>
              </q-btn>
              <q-carousel
                v-model="startSlide"
                transition-prev="slide-right"
                transition-next="slide-left"
                swipeable
                animated
                control-color="accent"
                navigation
                padding
                arrows
                height="250px"
                class="mediaBackground flat shadow-1 rounded-borders"
              >
                <q-carousel-slide
                  :name="slide.MediaID"
                  autoplay="true"
                  class="column no-wrap flex-center"
                  v-for="slide in slideList"
                  :key="slide.MediaID"
                >
                  <MediaCard :media="slide"></MediaCard>
                </q-carousel-slide>
              </q-carousel>
            </q-card-section>
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
            <!--END OF MEDIA SECTION FOR FULLSCREEN DIALOG-->

            <q-card-section>
              <div class="text-h6">{{ story.StoryTitle }}</div>
            </q-card-section>
            <q-card-section>
              <div
                class="row justify-center cardColor"
                v-if="story.MediaType === 2"
                @click="toggleImage()"
              >
                <q-img :src="storyURL" height="250px" fit="contain">
                  <template v-slot:loading>
                    <div class="accent">
                      <q-spinner-ios />
                      <div class="q-mt-md">Loading...</div>
                    </div>
                  </template>
                </q-img>
              </div>
              <div
                class="row justify-center videoWrapper"
                v-if="story.MediaType === 1"
              >
                <video
                  height="300"
                  controls
                  controlsList="nodownload video"
                  :src="storyURL"
                  class="video"
                ></video>
              </div>
            </q-card-section>
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
            <q-card-section class="text-overline"
              >{{ story.UserDisplayName }}, {{ story.date }}
              <q-btn
                class="text-accent"
                flat
                round
                icon="mdi-pencil-outline"
                v-if="story.Userid === user.UserID"
              ></q-btn>
              <q-btn
                class="text-accent"
                flat
                round
                icon="mdi-delete-forever-outline"
                v-if="story.Userid === user.UserID"
              ></q-btn>
            </q-card-section>
            <q-card-section class="col-4 text-h3">
              <div class="text-h6 text-accent q-mb-sm">
                <div class="text-h6" v-if="story.StoryTypeID === 2">
                  Interview of {{ story.Interviewee }}
                </div>
                <div class="text-h5" v-if="story.StoryTypeID === 4">
                  Tradition
                </div>
                {{ story.StoryTitle }}
                <q-btn
                  icon="mdi-fullscreen"
                  size="sm"
                  @click="fullScreenDialog = true"
                ></q-btn>
              </div>
              <div class="text-body1" v-if="story.StoryTypeID === 3">
                <q-scroll-area class="scrollArea" :visible="scrollVisible">
                  <div>Ingredients:</div>
                  <div v-html="story.StoryIngredients"></div>
                </q-scroll-area>
              </div>
              <div class="text-body1">
                <div>
                  <span
                    class="text-subtitle1 text-accent"
                    v-if="story.StoryTypeID === 3"
                    >Directions:</span
                  >
                </div>
                <q-scroll-area
                  class="scrollArea"
                  :visible="scrollVisible"
                  v-if="story.StoryText"
                >
                  <div v-html="story.StoryText"></div>
                </q-scroll-area>
              </div>
            </q-card-section>

            <q-card-section>
              <div v-if="commentsOpen">
                <q-card style="max-width: 85%">
                  <q-card-section>
                    <div class="text-h6">Add a comment</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input
                      dense
                      type="textarea"
                      v-model="newComment"
                      autofocus
                      @keyup.enter="addComment()"
                      rows="2"
                    />
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Clear" @click="newComment = null" />
                    <q-btn flat label="Add Comment" @click="addComment()" />
                  </q-card-actions>
                </q-card>
                <div
                  v-for="comment in comments"
                  :key="comment.CommentID"
                  class="commentDiv q-ma-md"
                >
                  <q-btn
                    v-if="comment.UserID === user.UserID"
                    size="sm"
                    round
                    icon="mdi-close-circle"
                    @click="deleteComment(comment.CommentID)"
                  ></q-btn>
                  <span class="commentHeader">
                    {{ comment.UserDisplayName }}, {{ comment.CommentDate }} :
                  </span>
                  {{ comment.CommentText }}
                </div>
              </div>
              <q-dialog
                v-model="fullScreenDialog"
                persistent
                :maximized="maximizedToggle"
                transition-show="slide-up"
                transition-hide="slide-down"
              >
                <q-card class="bg-primary">
                  <q-bar>
                    <q-space />
                    <q-btn dense flat icon="close" v-close-popup>
                      <q-tooltip class="bg-white text-primary">Close</q-tooltip>
                    </q-btn>
                  </q-bar>
                  <q-card-section>
                    <div
                      class="row justify-center cardColor"
                      v-if="story.MediaType === 2"
                      @click="toggleImage()"
                    >
                      <q-img :src="storyURL" height="250px" fit="contain">
                        <template v-slot:loading>
                          <div class="accent">
                            <q-spinner-ios />
                            <div class="q-mt-md">Loading...</div>
                          </div>
                        </template>
                      </q-img>
                    </div>
                    <div
                      class="row justify-center videoWrapper"
                      v-if="story.MediaType === 1"
                    >
                      <video
                        height="300"
                        controls
                        controlsList="nodownload video"
                        :src="storyURL"
                        class="video"
                      ></video>
                    </div>
                  </q-card-section>
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
                  <q-card-section class="q-pt-none">
                    <div class="text-h6 text-accent q-mb-sm">
                      <div class="text-h6" v-if="story.StoryTypeID === 2">
                        Interview of {{ story.Interviewee }}
                      </div>
                      <div class="text-h5" v-if="story.StoryTypeID === 4">
                        Tradition
                      </div>
                      {{ story.StoryTitle }}
                      <span
                        class="text-subtitle1"
                        v-if="story.StoryTypeID === 3"
                      >
                        <div>Ingredients</div></span
                      >
                    </div>
                    <div v-html="story.StoryIngredients"></div>
                    <div class="text-body1">
                      <div>
                        <span
                          class="text-subtitle1 text-accent"
                          v-if="story.StoryTypeID === 3"
                          >Directions:</span
                        >
                      </div>

                      <div v-html="story.StoryText"></div>
                    </div>
                  </q-card-section>
                </q-card>
              </q-dialog>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!--END FULLSCREEN DIALOG-->

        <!--START EDIT DIALOG-->

        <q-dialog
          v-model="editMemoryOpen"
          transition-show="rotate"
          transition-hide="rotate"
        >
          <q-card width="100%">
            <q-card-section>
              <q-btn
                icon="mdi-camera-plus"
                @click="startCameraDialog()"
              ></q-btn>
              <q-dialog v-model="openCameraDialog" persistent>
                <q-card style="min-width: 350px">
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

            <q-card-section>
              <div class="text-h6">Edit Memory</div>
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
            <!--BEGINNING OF MEDIA FOR EDIT MEMORY DIALOG-->
            <q-card-section v-if="newSlideList && newSlideCount > 0">
              <div>
                <MediaCardEdit
                  v-for="slide in newSlideList"
                  :key="slide.MediaID"
                  :media="slide"
                  editFlag="true"
                  @updateMedia="getMedia()"
                ></MediaCardEdit>
              </div>

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

            <!--END OF MEDIA FOR EDIT MEMORY DIALOG-->

            <q-card-section class="q-pt-none">
              <!--BEGINNING OF FORM-->
              <h5 color="negative">{{ badDataMessage }}</h5>

              <q-item v-if="storyTypeID !== 2 && storyTypeID !== 4">
                <q-input
                  class="titleInput"
                  label="Title"
                  color="m4u_text"
                  v-model="newTitle"
                  rows="2"
                ></q-input>
              </q-item>

              <q-item v-if="storyTypeID === 2">
                <q-input
                  class="titleInput"
                  label="Interview Question"
                  color="m4u_text"
                  v-model="newTitle"
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
                  v-model="newInterviewee"
                  rows="2"
                >
                </q-input>
              </q-item>

              <q-item v-if="storyTypeID === 4">
                <q-input
                  class="titleInput"
                  label="Name of Tradition"
                  color="m4u_text"
                  v-model="newTitle"
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

              <div
                class="text-weight-bold text-accent"
                v-if="storyTypeID === 3"
              >
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
                <q-editor
                  v-if="ingEditorType === 'small'"
                  v-model="newIngredients"
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

                <!--FULL EDITOR FOR INGREDIENTS-->
                <q-editor
                  v-if="ingEditorType === 'full'"
                  v-model="newIngredients"
                  content-class="bg-primary"
                  toolbar-text-color="white"
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
              <div
                class="text-weight-bold text-accent"
                v-if="storyTypeID === 3"
              >
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

              <div v-if="memEditorType === 'full'">
                <!--beginning of full editor for recipe directions/memory text-->
                <q-editor
                  v-model="newText"
                  content-class="bg-primary"
                  toolbar-text-color="white"
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
              <!--beginning of small editor for recipe directions/memory text-->
              <div v-if="memEditorType === 'small'">
                <q-editor
                  v-if="memEditorType === 'small'"
                  v-model="newText"
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
              <q-item>
                <q-select
                  input-debounce="0"
                  filled
                  label="Share with..."
                  hint="Select the group you want to seee this"
                  v-model="newCircleID"
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
                  v-model="newHidden"
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

            <q-card-actions align="right">
              <q-btn
                flat
                label="Cancel"
                color="primary"
                @click="cancelEditMemory()"
              />
              <q-btn flat label="Save" color="primary" @click="draftCheck()" />
            </q-card-actions>
          </q-card>

          <!--ADD BOOKS DIALOG INSIDE OF EDIT DIALOG-->
          <q-dialog v-model="booksDialogFlag">
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
                      <q-icon
                        name="mdi-book-open-page-variant-outline"
                      ></q-icon>
                    </q-avatar>

                    <q-toolbar-title>New Book or Time Capsule</q-toolbar-title>

                    <q-btn flat round dense icon="close" v-close-popup />
                  </q-toolbar>

                  <q-card-section>
                    <AddBook @bookAdded="newBookAdded()"></AddBook>
                  </q-card-section>
                </q-card>
              </q-dialog>
              <!--end of new book dialog-->
            </q-card>
          </q-dialog>
          <!--END ADD BOOKS INSIDE OF EDIT DIALOG-->
        </q-dialog>
        <!--END EDIT DIALOG-->

        <!--Save Draft DIALOG-->
        <q-dialog v-model="saveDraft" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <span class="q-ml-sm"
                >You haven't chosen who to share with. Do you want to save this
                as a draft?.</span
              >
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn
                flat
                label="Save as Draft"
                color="primary"
                @click="updateMemory()"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!--end save draft dialog-->
      </q-card-section>

      <q-card-actions class="justify-between">
        <q-btn
          class="glossy"
          round
          color="accent"
          icon="mdi-heart-outline"
          v-if="heartStatus === false"
          @click="changeHeartStatus()"
        >
          <q-badge
            color="positive"
            floating
            text-color="black"
            :label="heartTotal"
            v-if="heartTotal > 0"
          ></q-badge>
        </q-btn>
        <q-btn
          class="glossy"
          round
          color="dark"
          icon="mdi-heart"
          v-if="heartStatus === true"
          @click="changeHeartStatus()"
        >
          <q-badge
            color="positive"
            floating
            text-color="black"
            :label="heartTotal"
            v-if="heartTotal > 0"
          ></q-badge>
        </q-btn>
        <q-btn
          class="glossy"
          v-if="!commentsOpen"
          round
          color="accent"
          icon="mdi-comment-text-multiple-outline"
          @click="openCommentDialog()"
        >
          <q-badge
            color="positive"
            floating
            text-color="black"
            :label="commentTotal"
            v-if="commentTotal > 0"
          ></q-badge>
        </q-btn>
      </q-card-actions>
    </q-card>
    <q-separator horizontal />
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import actions from "../actions/blobs";
import bookActions from "../actions/books";
import memoryActions from "../actions/memories";
import mediaActions from "../actions/blobs";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import { Screen } from "quasar";
import MediaCardEdit from "components/mediaCardEdit.vue";
import MediaCard from "components/mediaCard.vue";
import AddBook from "components/addBook.vue";

export default defineComponent({
  name: "StoryCard",
  components: { MediaCardEdit, MediaCard, AddBook },
  props: {
    story: {
      type: Object,
    },
  },

  setup(props, { emit }) {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const storyURL = ref("");
    const imageFullScreen = ref(false);
    const imageHeight = ref(200);
    const scrollVisible = ref(true);
    const heartTotal = ref(0);
    const heartStatus = ref(false);
    const commentTotal = ref(0);
    const newComment = ref("");
    const commentDialog = ref(false);
    const commentsOpen = ref(false);
    const comments = ref([]);
    const fullScreenDialog = ref(false);
    const maximizedToggle = ref(true);
    const editMemoryOpen = ref(false);
    const newTitle = ref(props.story.StoryTitle);
    const newInterviewee = ref(props.story.Interviewee);
    const newIngredients = ref(props.story.StoryIngredients);
    const newText = ref(props.story.StoryText);
    const newCircleID = ref(props.story.CircleID);
    const newHidden = ref(false);
    const badDataMessage = ref("");
    const storyTypeID = ref(props.story.StoryTypeID);
    const circleList = reactive([]);
    const saveDraft = ref(false);
    const slideList = reactive([]);
    const startSlide = ref(0);
    const verifyDeleteDialog = ref(false);
    const newSlideList = reactive([]);
    const emptySlideList = [];
    const newStartSlide = ref(0);
    const newSlideCount = ref(0);
    const qUploadFle = ref(null);
    const openCameraDialog = ref(false);
    const reauthToken = window.localStorage.getItem("rt");
    const booksDialogFlag = ref(false);
    const bookList = reactive([]);
    const noBookMsg = ref("");
    const traditionsFlag = ref(false);
    const interviewsFlag = ref(false);
    const traditionList = reactive([]);
    const interviewList = reactive([]);
    const newBookDialog = ref(false);
    const storySasKey = ref(null);
    const ingEditorType = ref("small");
    const memEditorType = ref("small");

    onMounted(() => {
      if (props.story.Hidden === 0) {
        newHidden.value = false;
      } else {
        newHidden.value = true;
      }

      getStorySasKey();

      getSasKey();

      getMedia();

      getHeartStatus();

      getComments();

      getCommentTotal().then(() => {});

      getCircleList();

      if (Screen.xs === true) {
        imageHeight.value = "100px";
      }
      if (Screen.sm === true) {
        imageHeight.value = "200px";
      }
      if (Screen.md === true) {
        imageHeight.value = "200px";
      }
      if (Screen.lg === true) {
        imageHeight.value = "500px";
      }
      if (Screen.xl === true) {
        imageHeight.value = "500px";
      }
    });

    const toggleEditorType = () => {
      if (editorType.value === "small") {
        editorType.value = "full";
      } else {
        editorType.value = "small";
      }
    };

    const toggleImage = () => {
      imageFullScreen.value = !imageFullScreen.value;
    };

    const getSasKey = async () => {
      await actions.getSasKey(props.story.MediaLoc).then((sasKey) => {
        storyURL.value = sasKey;
      });
    };

    const getStorySasKey = async () => {
      await mediaActions
        .getSasKey(props.story.UserMediaLoc)
        .then((incomingSas) => {
          storySasKey.value = incomingSas;
        });
    };

    const getMedia = async () => {
      newSlideList.length = 0;
      await actions.getMedia(props.story.StoryID).then((newMedia) => {
        Object.assign(slideList, newMedia);
        Object.assign(newSlideList, newMedia);
        newSlideCount.value = newMedia.length;
        newSlideCount.value = newMedia.length;
        startSlide.value = newMedia.MediaID;
        newStartSlide.value = newMedia.MediaID;
        newMedia.forEach((media) => {
          if (media.FeatureMedia === 1) {
            startSlide.value = media.MediaID;
            newStartSlide.value = media.MediaID;
          }
        });
      });
    };

    const getHeartStatus = async () => {
      await memoryActions
        .getHeartStatus(props.story.StoryID, user.UserID)
        .then((newHeartStatus) => {
          heartTotal.value = newHeartStatus.output.heartTotal;
          if (newHeartStatus.recordset[0].HeartCount > 0) {
            heartStatus.value = true;
          } else {
            heartStatus.value = false;
          }
        });
    };

    const changeHeartStatus = async () => {
      if (heartStatus.value === false) {
        await memoryActions
          .addHeartStatus(props.story.StoryID, user.UserID)
          .then(() => {
            getHeartStatus();
          });
      } else {
        await memoryActions
          .removeHeartStatus(props.story.StoryID, user.UserID)
          .then(() => {
            getHeartStatus();
          });
      }
    };

    const getCommentTotal = async () => {
      memoryActions
        .getCommentTotal(props.story.StoryID)
        .then((newCommentTotal) => {
          if (newCommentTotal.returnValue > 0) {
            commentTotal.value = newCommentTotal.returnValue;
          }
        });
    };

    const openCommentDialog = async () => {
      newComment.value = null;
      commentsOpen.value = !commentsOpen.value;
    };

    const addComment = async () => {
      //      commentsOpen.value = false;
      await memoryActions
        .addComment(props.story.StoryID, user.UserID, newComment.value)
        .then(() => {
          newComment.value = null;
          getCommentTotal();
          getComments();
          commentsOpen.value = false;
        });
    };

    const deleteComment = async (commentID) => {
      await memoryActions.deleteComment(commentID).then(() => {
        getComments();
      });
    };

    const getComments = async () => {
      comments.value = [];
      await memoryActions
        .getComments(props.story.StoryID)
        .then((apiComments) => {
          comments.value = apiComments.recordset;
        });
    };

    const setStoryType = async (newType) => {
      storyTypeID.value = newType;
    };

    const getCircleList = async () => {
      await memoryActions.getMyCircles(user.UserID).then((circles) => {
        circles.forEach((circle) => {
          circleList.push(circle);
        });
      });
    };

    const openEditMemory = async () => {
      editMemoryOpen.value = !editMemoryOpen.value;
    };

    const cancelEditMemory = async () => {
      storyTypeID.value = props.story.StoryTypeID;
      newTitle.value = props.story.StoryTitle;
      newText.value = props.story.StoryText;
      newInterviewee.value = props.story.Interviewee;
      newIngredients.value = props.story.StoryIngredients;
      newCircleID.value = props.story.CircleID;
      if (props.story.Hidden === 0) {
        newHidden.value = false;
      } else {
        newHidden.value = true;
      }
      editMemoryOpen.value = false;
    };

    const draftCheck = async () => {
      if (newText.value !== null) {
        if (
          newText.value.includes("<script") ||
          newText.value.includes("&lt;script")
        ) {
          badDataMessage.value = "Invalid <script> tag. Remove it to continue.";
          return;
        }
      }
      if (newTitle.value !== null) {
        if (
          newTitle.value.includes("<script") ||
          newTitle.value.includes("&lt;script")
        ) {
          badDataMessage.value = "Invalid <script> tag. Remove it to continue.";
          return;
        }
      }
      if (newIngredients.value !== null) {
        if (
          newIngredients.value.includes("<script") ||
          newIngredients.value.includes("&lt;script")
        ) {
          badDataMessage.value = "Invalid <script> tag. Remove it to continue.";
          return;
        }
      }
      if (newInterviewee.value !== null) {
        if (
          newInterviewee.value.includes("<script") ||
          newInterviewee.value.includes("&lt;script")
        ) {
          badDataMessage.value = "Invalid <script> tag. Remove it to continue.";
          return;
        }
      }

      if (newText.value !== null) {
        if (
          newText.value.includes("<mg") ||
          newText.value.includes("&lt;img")
        ) {
          badDataMessage.value = "Invalid <img> tag. Remove it to continue.";
          return;
        }
      }
      if (newTitle.value !== null) {
        if (
          newTitle.value.includes("<img") ||
          newTitle.value.includes("&lt;img")
        ) {
          badDataMessage.value = "Invalid <img> tag. Remove it to continue.";
          return;
        }
      }
      if (newIngredients.value !== null) {
        if (
          newIngredients.value.includes("<img") ||
          newIngredients.value.includes("&lt;img")
        ) {
          badDataMessage.value = "Invalid <img> tag. Remove it to continue.";
          return;
        }
      }
      if (newInterviewee.value !== null) {
        if (
          newInterviewee.value.includes("<img") ||
          newInterviewee.value.includes("&lt;img")
        ) {
          badDataMessage.value = "Invalid <img> tag. Remove it to continue.";
          return;
        }
      }

      if (newCircleID.value === "" || newCircleID.value === null) {
        saveDraft.value = true;
        return;
      } else {
        updateMemory();
      }
    };

    const updateMemory = async () => {
      saveDraft.value = false;
      if (newCircleID.value === "" || newCircleID.value === null) {
        newCircleID.value = null;
      } else {
        newCircleID.value = Number(newCircleID.value);
      }
      let storyData = {
        StoryID: props.story.StoryID,
        StoryTypeID: storyTypeID.value,
        StoryTitle: newTitle.value,
        StoryText: newText.value,
        Interviewee: newInterviewee.value,
        StoryIngredients: newIngredients.value,
        Hidden: newHidden.value,
      };

      await memoryActions
        .updateMemory(storyData, newCircleID.value, storyTypeID.value)
        .then(() => {
          editMemoryOpen.value = false;
          emit("updateFeed");
        });
    };

    const verifyDelete = async () => {
      verifyDeleteDialog.value = !verifyDeleteDialog.value;
    };

    const deleteMemory = async () => {
      await memoryActions.deleteMemory(props.story.StoryID).then(() => {});
      emit("updateFeed");
    };

    const handleFileUpload = async () => {
      //    var file = this.$refs.file.files[0];
      openCameraDialog.value = false;
      let formData = new FormData();
      formData.append("file", qUploadFle.value);
      formData.append("userID", user.UserID);
      formData.append("storyID", props.story.StoryID);
      formData.append("reauthToken", reauthToken);

      await mediaActions
        .addNewBlob(formData)
        .then((ret) => {
          qUploadFle.value = null;
        })
        .then(() => {
          getMedia();
        });
    };

    const startCameraDialog = async () => {
      openCameraDialog.value = !openCameraDialog.value;
    };

    const openBookDialog = async () => {
      getMyBooks();
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

    const updateBooks = async (bookID, bookStatus) => {
      if (bookStatus === true) {
        await bookActions
          .addToBooks(bookID, props.story.StoryID)
          .then(async () => {
            await getMyBooks();
          });
      }
      if (bookStatus === null || bookStatus === false) {
        await bookActions
          .removeFromBooks(bookID, props.story.StoryID)
          .then(async () => {
            await getMyBooks();
          });
      }
    };

    const getMyBooks = async () => {
      await bookActions
        .getBooksToAddStory(user.UserID, props.story.StoryID)
        .then((books) => {
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

    const getTraditions = async () => {
      await memoryActions.getTraditions().then((traditions) => {
        Object.assign(traditionList, traditions);
      });
    };

    const setTraditions = async (traditionName) => {
      newTitle.value = traditionName;
      traditionsFlag.value = false;
    };

    const getInterviews = async () => {
      await memoryActions.getInterviews().then((interviews) => {
        Object.assign(interviewList, interviews);
      });
    };

    const setInterviews = async (interviewName) => {
      newTitle.value = interviewName;
      interviewsFlag.value = false;
    };

    return {
      user,
      token,
      isLoggedIn,
      storyURL,
      imageHeight,
      imageFullScreen,
      toggleImage,
      scrollVisible,
      heartTotal,
      heartStatus,
      changeHeartStatus,
      commentTotal,
      newComment,
      commentDialog,
      openCommentDialog,
      addComment,
      commentsOpen,
      comments,
      deleteComment,
      fullScreenDialog,
      maximizedToggle,
      newTitle,
      newInterviewee,
      newIngredients,
      newText,
      newCircleID,
      newHidden,
      editMemoryOpen,
      badDataMessage,
      setStoryType,
      storyTypeID,
      circleList,
      cancelEditMemory,
      draftCheck,
      updateMemory,
      saveDraft,
      slideList,
      startSlide,
      verifyDeleteDialog,
      deleteMemory,
      verifyDelete,
      newSlideList,
      newStartSlide,
      newSlideCount,
      openEditMemory,
      handleFileUpload,
      openCameraDialog,
      qUploadFle,
      startCameraDialog,
      getMedia,
      booksDialogFlag,
      openBookDialog,
      bookList,
      noBookMsg,
      updateBooks,
      newBookDialog,
      openTraditions,
      openInterviews,
      traditionsFlag,
      interviewsFlag,
      traditionList,
      interviewList,
      getInterviews,
      setInterviews,
      getTraditions,
      setTraditions,
      newBookAdded,
      storySasKey,
      toggleEditorType,
      ingEditorType,
      memEditorType,
    };
  },
});
</script>
<style scoped>
.feed-card {
  width: 90%;
  margin: auto;
}
.qc-card {
  width: 90%;
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

.preview-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.titleInput {
  width: 100%;
}
</style>
