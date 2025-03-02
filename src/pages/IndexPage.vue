<template>
  <q-page class="flex-center qpage bg-image">
    <q-pull-to-refresh @refresh="refresh">
      <!--STARTING QUICK CONNECT-->
      <div :class="screenSize">
        <qcCard></qcCard>
      </div>

      <div class="q-pa-md items-start flex-center">
        <q-card class="q-mt-md feed-card transparent bg-secondary" flat>
          <q-card-section v-if="message">
            {{ message }}
          </q-card-section>
          <q-card-section
            class="q-mt-md feed-card transparent flex-cemter"
            flat
          >
            <!--Dialog for book info-->

            <q-dialog v-model="bookInfo">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Books</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <p class="text-h6">
                    You can create books to group your memories. For example,
                    you can have a book for each child, for special events, or
                    for groups and clubs you share with. You can even create
                    special books called "Time Capsules" that won't be shared
                    until the date you set. A memory can be saved into multiple
                    books.
                  </p>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="OK" color="primary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

            <!--Dialog for list info-->

            <q-dialog v-model="listInfo">
              <q-card>
                <q-card-section>
                  <div class="text-h6">Lists</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <p class="text-h6">
                    Create lists for your self or to share with others. Keep
                    track of projects, keep a list of movies you want to watch,
                    share a grocery list or share a list for everyone to sign up
                    for a potluck dinner!
                  </p>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="OK" color="primary" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>

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

            <!--start of new list dialog-->
            <q-dialog v-model="newListDialog" class="newListDialog">
              <q-card class="newListDialog">
                <q-toolbar>
                  <q-avatar>
                    <q-icon name="mdi-playlist-plus"></q-icon>
                  </q-avatar>

                  <q-toolbar-title>New List</q-toolbar-title>
                </q-toolbar>

                <q-card-section>
                  <AddList @listAdded="listAdded()"></AddList>
                </q-card-section>
              </q-card>
            </q-dialog>
            <!--end of new book dialog-->
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

          <!--MEMORY TYPE DIALOG USED FOR FILTER-->
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
                    @update:model-value="selectMemoryType()"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
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

        <div v-if="filterType === 'book'" class="row justify-center">
          <div
            v-for="book in allBookList"
            :key="book.BookID"
            class="relative-center q-mt-md bookWrap"
          >
            <BookCard
              :bookID="book.BookID"
              @updateFeed="setFilter(filter)"
            ></BookCard>
          </div>
        </div>
        <!--END OF BOOK CARDS-->

        <!--START OF LIST CARDS-->
        <div v-if="filterType === 'lists'" class="row justify-center">
          <div
            v-for="list in allListsList"
            :key="list.ListID"
            class="relative-center q-mt-md list-card listClass"
          >
            <q-card class="text-center relative-center q-mb-md">
              <ListCard
                :listID="list.ListID"
                @updateFeed="setFilter(filter)"
              ></ListCard>
            </q-card>
          </div>
        </div>
        <!--END OF LIST CARDS-->
      </div>

      <!--START NEW MEMORY DIALOG-->
      <q-dialog
        v-model="newMemoryOpen"
        transition-show="rotate"
        transition-hide="rotate"
        persistent
      >
        <q-card style="min-width: 75%">
          <q-card-section>
            <q-btn
              icon="mdi-camera-plus"
              @click="startCameraDialog()"
              v-if="progress === false"
            ></q-btn>
            <q-inner-loading
              :showing="progress"
              label="Uploading media..."
              label-class="info"
              label-style="font-size: 1.1em"
            />
            <q-dialog v-model="openCameraDialog" persistent>
              <q-card style="min-width: 400px">
                <q-card-section class="q-pt-md">
                  <q-file
                    rounded
                    outlined
                    bottom-slots
                    v-model="qUploadFle"
                    max-files="30"
                    label="Click to add a photo or video"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
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
            <div class="text-h6">New {{ memoryTitle }}</div>
            <div></div>
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
                tabindex="1"
              ></q-input>
            </q-item>

            <q-item v-if="storyTypeID === 5 && user.AdminLevel >= 100">
              <q-select
                input-debounce="0"
                filled
                label="Help Type"
                hint="Select the help type"
                v-model="helpTypeID"
                :options="helpList"
                option-value="HelpTypeID"
                option-label="HelpType"
                emit-value
                map-options
                clearable
                style="min-width: 250px; max-width: 70%"
                tabindex="2"
              />
            </q-item>

            <q-item v-if="storyTypeID === 2">
              <q-input
                class="titleInput"
                label="Interview Question"
                color="m4u_text"
                v-model="storyTitle"
                rows="2"
                tabindex="2"
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
                tabindex="3"
              ></q-input>
            </q-item>

            <q-item v-if="storyTypeID === 4">
              <q-input
                class="titleInput"
                label="Name of Tradition"
                color="m4u_text"
                v-model="storyTitle"
                rows="2"
                tabindex="3"
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
              <q-btn-dropdown size="xs" color="primary" label="Templates">
                <q-list bordered separator>
                  <q-item
                    v-for="template in myTemplates"
                    :key="template.MemoryTemplateID"
                    clickable
                    v-close-popup
                    @click="
                      setTemplate(
                        template.MemoryText,
                        template.MemoryIngredients,
                        template.MemoryCircle
                      )
                    "
                  >
                    <q-item-section>
                      <q-item-label>{{
                        template.MemoryTemplateName
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        <q-btn
                          flat
                          icon="mdi-delete"
                          @click="deleteTemplate(template.MemoryTemplateID)"
                        ></q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
              <!--small editor for ingredients-->
              <q-editor
                v-if="ingEditorType === 'small'"
                ref="ingredientsRef"
                v-model="storyIngredients"
                tabindex="5"
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
                  ['unordered', 'ordered', 'outdent', 'indent', 'fullscreen'],
                ]"
              />
              <!--full editor for ingredients-->
              <q-editor
                v-model="storyIngredients"
                ref="ingredientsRef"
                v-if="ingEditorType === 'full'"
                content-class="bg-primary"
                tabindex="6"
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
                ref="textRef"
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
              <q-btn-dropdown size="xs" color="primary" label="Templates">
                <q-list bordered separator>
                  <q-item
                    v-for="template in myTemplates"
                    :key="template.MemoryTemplateID"
                    clickable
                    tabindex="6"
                    v-close-popup
                    @click="
                      setTemplate(template.MemoryText, template.MemoryCircle)
                    "
                  >
                    <q-item-section>
                      <q-item-label>{{
                        template.MemoryTemplateName
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        <q-btn
                          flat
                          icon="mdi-delete"
                          @click="deleteTemplate(template.MemoryTemplateID)"
                        ></q-btn>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div>
              <q-editor
                v-if="memEditorType === 'full'"
                ref="textRef"
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
                  ['unordered', 'ordered', 'outdent', 'indent', 'fullscreen'],
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
                  v-model="storyText"
                  tabindex="6"
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
                tabindex="7"
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
                tabindex="8"
              />
            </q-item>
          </q-card-section>

          <q-card-actions align="around">
            <div>
              <q-btn
                icon="mdi-bookshelf"
                flat
                stack
                label="Books"
                color="accent"
                class="q-mb-sm"
                @click="openBookDialog()"
              ></q-btn>
              <q-btn
                icon="mdi-content-save"
                flat
                stack
                label="Draft"
                color="accent"
                class="q-mb-sm"
                @click="draftCheck('userSelected')"
              ></q-btn>
              <q-btn
                icon="mdi-content-duplicate"
                flat
                stack
                label="Template"
                color="accent"
                class="q-mb-sm"
                @click="saveTemplateDialog = true"
              ></q-btn>
            </div>
            <div>
              <q-btn
                icon="mdi-close"
                flat
                stack
                label="Cancel"
                color="dark"
                class="q-mb-sm"
                @click="cancelNewMemory()"
              />
              <q-btn
                flat
                stack
                label="Save"
                icon="mdi-check-bold"
                color="dark"
                class="q-mb-sm"
                @click="draftCheck('unknown')"
              />
            </div>
          </q-card-actions>
        </q-card>

        <!--DIALOG TO GET NEW TEMPLATE NAME-->
        <q-dialog v-model="saveTemplateDialog" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Name your template</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="newTemplateName"
                autofocus
                @keyup.enter="prompt = false"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Add template"
                @click="saveTemplate(storyTypeID)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <!--END OF DIALOG TO GET NEW TEMPLATE NAME-->

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
            <span class="q-ml-sm" v-if="circleID === null"
              >You haven't chosen who to share with.
            </span>
            <span class="q-ml-sm" v-if="circleID === null">
              Do you want to save this as a draft?.</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="accent" v-close-popup />
            <q-btn
              flat
              label="Save as Draft"
              color="accent"
              @click="validationCheck()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-pull-to-refresh>

    <q-page-sticky expand position="top">
      <div class="toolbarSize">
        <div class="q-pa-md q-gutter-y-sm">
          <div class="row justify-between">
            <div>
              <span class="justify-center text-h4 text-weight-bolder">
                {{ filterText }}
              </span>
              <span v-if="filterType === 'lists'">
                <q-icon
                  class="setSuperscript"
                  name="mdi-information-outline"
                  size="sm"
                  @click="listInfo = true"
                ></q-icon
              ></span>
              <span v-if="filterType === 'book'">
                <q-icon
                  class="setSuperscript"
                  name="mdi-information-outline"
                  size="xs"
                  @click="bookInfo = true"
                ></q-icon
              ></span>
            </div>
            <div>
              <q-btn-dropdown
                icon="add"
                color="dark"
                size="xs"
                class="q-mr-sm"
                fab-mini
              >
                <q-list>
                  <q-item clickable v-close-popup @click="addMemoryDialog(1)">
                    <q-item-section>
                      <q-item-label>Memory</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="addMemoryDialog(3)">
                    <q-item-section>
                      <q-item-label>Recipe</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="addMemoryDialog(2)">
                    <q-item-section>
                      <q-item-label>Interview</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="addMemoryDialog(4)">
                    <q-item-section>
                      <q-item-label>Tradition</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="newBookDialog = true">
                    <q-item-section>
                      <q-item-label>Book</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="newListDialog = true">
                    <q-item-section>
                      <q-item-label>List</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="addMemoryDialog(5)"
                    v-if="user.AdminLevel >= 100"
                  >
                    <q-item-section>
                      <q-item-label>Help</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>

          <div>
            <q-toolbar inset>
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
                        <q-btn
                          flat
                          icon="mdi-filter-outline"
                          color="accent"
                          v-if="selectedMemoryType !== 0"
                          >Filter Memories</q-btn
                        >
                        <q-btn
                          flat
                          icon="mdi-filter-outline"
                          v-if="selectedMemoryType === 0"
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
                <!--FILTER BUTTONS FOR LISTS-->
                <q-btn
                  color="accent"
                  icon="mdi-check"
                  rounded
                  glossy
                  @click="setFilter('lists')"
                >
                </q-btn>
                <!--FILTER BUTTONS FOR HELP-->
                <q-btn
                  color="accent"
                  icon="mdi-help"
                  rounded
                  glossy
                  @click="setFilter('help')"
                >
                </q-btn>
              </q-btn-group>
            </q-toolbar>
          </div>
        </div>
      </div>
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
import { ref, onMounted } from "vue";
import actions from "../actions/memories";
import mediaActions from "../actions/blobs";
import { useUserStore } from "stores/user";
import { storeToRefs } from "pinia";
import QcCard from "components/QuickConnectCard.vue";
import StoryCard from "components/storyCard.vue";
import BookCard from "components/bookCard.vue";
import ListCard from "components/listCard.vue";
import AddBook from "components/addBook.vue";
import AddList from "components/addList.vue";
import MediaCardEdit from "components/mediaCardEdit.vue";
import bookActions from "../actions/books";
import listActions from "../actions/lists";
import helpActions from "../actions/help";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "IndexPage",
  components: {
    StoryCard,
    MediaCardEdit,
    QcCard,
    BookCard,
    ListCard,
    AddBook,
    AddList,
  },
  setup() {
    const userState = useUserStore();
    const user = reactive(userState.user);
    const { isLoggedIn, token, pageLength } = storeToRefs(userState);
    const reauthToken = window.localStorage.getItem("rt");

    const allBookList = ref(null);
    const text = ref(null);
    const allListsList = ref(null);
    const badDataMessage = ref("");
    const bookList = reactive([]);
    const bookInfo = ref(false);
    const buttonList = reactive([]);
    const circleID = ref(null);
    const circleTitle = ref(null);
    const circleList = reactive([]);
    const draftLabel = ref(0);
    const drafts = ref(false);
    const makeDraft = ref(false);
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
    const listInfo = ref(false);
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
    const message = ref("");
    const memoryTypeOn = ref(false);
    const myTemplates = ref(null);
    const newBookDialog = ref(false);
    const newBookTitle = ref(null);
    const newMemoryOpen = ref(false);
    const newSlideCount = ref(0);
    const newSlideList = reactive([]);
    const newStartSlide = ref(0);
    const newTemplateName = ref(null);
    const noBookMsg = ref("");
    const openCameraDialog = ref(false);
    const progress = ref(false);
    const qUploadFle = ref(null);
    const recordLast = ref(0);
    const recordStart = ref(0);
    const saveDraft = ref(false);
    const saveTemplateDialog = ref(false);
    const searchOn = ref(false);
    const searchTerm = ref("");
    const selectedMemoryType = ref(0);
    const stories = ref(null);
    const newStoryID = ref(null);
    const screenSize = ref(null);
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
    const newListDialog = ref(false);
    const filterText = ref("Memories");
    const memoryTitle = ref("Memory");
    const helpList = ref([]);
    const helpTypeID = ref(null);
    const $q = useQuasar();
    const booksDialogFlag = ref(false);

    onMounted(() => {
      recordLast.value = pageLength.value;
      getAllStories(user.UserID.value);
      draftCount(user.UserID.value);
      getMessage();
      getCircleList();
      setDate();
      getMemoryTemplates(1);
      getHelpTypes();
      getLists();
      setScreenSize();
      $q.screen.setSizes({ sm: 400, md: 500, lg: 1000, xl: 2000 });
    });

    const setScreenSize = () => {
      if ($q.screen.width <= 450) {
        screenSize.value = "smallScreen";
        return;
      }
      if ($q.screen.width > 451 && $q.screen.width <= 775) {
        screenSize.value = "mediumScreen";
        return;
      }
      if ($q.screen.width > 776 && $q.screen.width <= 899) {
        screenSize.value = "largeScreen";
      }
      if ($q.screen.width >= 900 && $q.screen.width <= 1199) {
        screenSize.value = "xlScreen";
      }
      if ($q.screen.width >= 1200) {
        screenSize.value = "xxlScreen";
      }
      return;
    };

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

    const selectMemoryType = () => {
      memoryTypeOn.value = false;
    };

    const startFilter = async () => {
      filterType.value = "memory";
      memoryTypeOn.value = !memoryTypeOn.value;
      setFilter("all");
    };

    const setFilter = async (newfilter) => {
      searchOn.value = false;
      searchTerm.value = "";
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";

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
      if (filter.value === "help") {
        filterType.value = "memory";
        filterText.value = "Help";
        getHelp();
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

      //Start List Filter

      if (filter.value === "lists") {
        filterType.value = "lists";
        filterText.value = "Lists";
        getLists();
        draftCount();
        filterIcon.value = "mdi-playlist-plus";
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
        if (filter.value === "help") {
          await getMoreHelp();
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
          recordStart.value = recordStart.value + pageLength.value;
        });
    };

    const getMoreAllStories = async (index, done) => {
      filter.value = "all";
      recordStart.value = recordStart.value + pageLength.value;
      if (recordStart.value < recordLast.value || !recordLast.value) {
        await actions
          .getAllStories(user.UserID, recordStart.value, pageLength.value)
          .then((newStories) => {
            stories.value.push(...newStories.recordset);
          });
      }
    };

    const getHelp = async () => {
      filter.value = "help";
      searchOn.value = false;
      searchTerm.value = "";
      stories.value = [];
      recordStart.value = 0;
      recordLast.value = "";
      await helpActions
        .getAllHelp(recordStart.value, pageLength.value)
        .then((newStories) => {
          if (typeof newStories !== "undefined") {
            recordLast.value = newStories.output.recordCount;
            stories.value = newStories.recordsets[0];
            //    recordStart.value = recordStart.value + pageLength.value;
          }
        });
    };

    const getMoreHelp = async (index, done) => {
      filter.value = "help";
      recordStart.value = recordStart.value + pageLength.value;
      if (recordStart.value < recordLast.value || !recordLast.value) {
        await helpActions
          .getAllHelp(recordStart.value, pageLength.value)
          .then((newStories) => {
            stories.value.push(...newStories.recordset);
          });
      }
      return;
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
      filter.value = "search";
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

    const getMemoryTemplates = async (tempType) => {
      await actions
        .getMemoryTemplates(user.UserID, tempType)
        .then((retTemplates) => {
          myTemplates.value = retTemplates;
        });
    };

    const setTemplate = async (memoryText, memoryIngredients, memoryCircle) => {
      storyText.value = memoryText;
      if (storyTypeID.value === 3 && memoryIngredients) {
        storyIngredients.value = memoryIngredients;
      }
      if (memoryCircle === 0) {
        circleID.value = null;
      } else {
        circleID.value = memoryCircle;
      }
    };

    const saveTemplate = async (templateType) => {
      await actions
        .saveTemplate(
          user.UserID,
          templateType,
          newTemplateName.value,
          storyText.value,
          storyIngredients.value,
          circleID.value
        )
        .then(() => {
          newTemplateName.value = null;
          saveTemplateDialog.value = false;
        })
        .then(() => {
          if (storyIngredients.value === 0) {
            storyIngredients.value = null;
          }
          getMemoryTemplates(templateType);
        });
    };

    const deleteTemplate = async (templateID) => {
      await actions.deleteTemplate(templateID).then(() => {
        getMemoryTemplates(storyTypeID.value);
      });
    };

    const addMemoryDialog = async (newMemType) => {
      Object.assign(newSlideList, emptySlideList);
      newStartSlide.value = 0;
      newMemoryOpen.value = true;
      switch (newMemType) {
        case 1:
          memoryTitle.value = "Memory";
          break;
        case 2:
          memoryTitle.value = "Interview";
          break;
        case 3:
          memoryTitle.value = "Recipe";
          break;
        case 4:
          memoryTitle.value = "Tradition";
          break;
        case 5:
          memoryTitle.value = "Help";
          break;

        default:
          memoryTitle.value = "Memory";
      }

      await addMemory(newMemType);
      await getMemoryTemplates(newMemType);
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
        helpTypeID.value = null;
        newSlideCount.value = 0;

        Object.assign(newSlideList, emptySlideList);
        newStartSlide.value = 0;
      });
    };

    const saveAsDraft = async () => {
      circleID.value = 0;
      draftCheck("userSelected");
    };

    const draftCheck = async (draftType) => {
      if (draftType === "userSelected") {
        saveDraft.value = false;
        circleID.value = 0;
        validationCheck();
        return;
      }

      if (
        draftType === "unknown" &&
        (circleID.value === null || circleID.value === "")
      ) {
        saveDraft.value = true;
        return;
      }

      validationCheck();
    };
    const validationCheck = async () => {
      if (storyTitle.value === null || storyTitle.value === "") {
        badDataMessage.value = "You must enter a title.";
        return;
      }
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
      if (storyIngredients.value !== null || storyIngredients.value !== 0) {
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

      if (newMemoryOpen.value === true) {
        await updateNewMemory();
      } else {
        await updateMemory();
      }
    };

    const addMemory = async (newMemType) => {
      if (newMemType === null) {
        newMemType = 1;
      }
      setStoryType(newMemType);
      saveDraft.value = false;
      var newCircleID = null;
      // if (circleID.value === "") {
      //   newCircleID = null;
      // } else {
      //   newCircleID = circleID.value;
      // }

      // if (newMemType === 5) {
      //   //TYPE 5 IS A HELP MEMORY
      //   newCircleID = 0;
      // }
      storyData.value = {
        StoryTypeID: newMemType,
        StoryTitle: "",
        StoryText: "",
        Interviewee: "",
        StoryIngredients: "",
        Hidden: 0,
        HelpTypeID: 0,
      };
      await actions
        .newMemory(user.UserID, storyData.value, newCircleID)
        .then((newID) => {
          newStoryID.value = newID[0].InsertedId;
          storyID.value = newID[0].InsertedId;
        });
    };

    const handleFileUpload = async () => {
      progress.value = true;
      openCameraDialog.value = false;
      let formData = new FormData();
      formData.append("file", qUploadFle.value);
      formData.append("userID", user.UserID);
      formData.append("storyID", storyID.value);
      formData.append("reauthToken", reauthToken);

      await mediaActions
        .addNewBlob(formData)
        .then((ret) => {
          progress.value = false;
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
          HelpTypeID: helpTypeID.value,
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
          HelpTypeID: helpTypeID.value,
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
          helpTypeID.value = 0;
          newMemoryOpen.value = false;
          newSlideCount.value = 0;
          makeDraft.value = false;

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
          HelpTypeID: helpTypeID.value,
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
          //  hidden.value = false;
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

    const getHelpTypes = async () => {
      await actions.getHelpTypes().then((helpTypes) => {
        helpList.value = helpTypes.recordset;
      });
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

    const newListAdded = async () => {
      newListDialog.value = false;
      getLists();
      setFilter(filter.value);
    };

    const getLists = async () => {
      await listActions.getLists(user.UserID).then((lists) => {
        allListsList.value = lists;
      });
    };

    const listAdded = async () => {
      newListDialog.value = false;
      getLists();
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
      allListsList,
      addMemory,
      addMemoryDialog,
      allBookList,
      badDataMessage,
      bookInfo,
      bookList,
      booksDialogFlag,
      buttonList,
      cancelNewMemory,
      circleID,
      circleList,
      circleTitle,
      deleteTemplate,
      draftCheck,
      draftLabel,
      ingredientsRef,
      filter,
      filterIcon,
      filterText,
      filterType,
      getLists,
      getGroupMemories,
      getMoreGroupMemories,
      getInterviews,
      getMore,
      getAllStories,
      getMyStories,
      getMoreAllStories,
      getHelp,
      getMoreHelp,
      getNewMedia,
      getTraditions,
      goToTop,
      handleFileUpload,
      helpList,
      helpTypeID,
      hidden,
      imageFullScreen,
      imageHeight,
      ingEditorType,
      interviewee,
      interviewsFlag,
      interviewList,
      listAdded,
      listInfo,
      memEditorType,
      memoryTitle,
      memoryTypeOn,
      memoryTypeOptions,
      message,
      myTemplates,
      newBookAdded,
      newListAdded,
      newBookDialog,
      newListDialog,
      newBookTitle,
      newMemoryOpen,
      newSlideList,
      newSlideCount,
      newTemplateName,
      noBookMsg,
      onPasteIng,
      onPasteText,
      openBookDialog,
      openBookDispDialog,
      openCameraDialog,
      openTraditions,
      openInterviews,
      progress,
      qUploadFle,
      recordStart,
      recordLast,
      saveAsDraft,
      saveDraft,
      saveTemplate,
      saveTemplateDialog,
      screenSize,
      searchOn,
      searchMemories,
      searchTerm,
      startFilter,
      selectedMemoryType,
      selectMemoryType,
      setFilter,
      setGroup,
      setInterviews,
      setMemoryType,
      setSearch,
      setStoryType,
      setTemplate,
      setTraditions,
      startCameraDialog,
      stories,
      storyID,
      storyIngredients,
      storyText,
      storyTitle,
      storyTypeID,
      tcDate,
      text,
      traditionsFlag,
      traditionList,
      updateBookTitle,
      updateMemory,
      updateMemoryBooks,
      validationCheck,
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
.list-card {
  width: 30%;
  height: 175px;
  margin-right: 10px;
}
.newBookDialog {
  width: 85%;
  margin: auto;
}

.addButton {
  margin-top: 1%;
}
.smallScreen {
  margin-top: 30%;
}

.mediumScreen {
  margin-top: 15%;
}
.largeScreen {
  margin-top: 8%;
}

.xlScreen {
  margin-top: 5%;
}

.xxlScreen {
  margin-top: 2%;
}
.bookCard {
  cursor: pointer;
  cursor: hand;
  width: 100px;
}

.listClass {
  cursor: pointer;
  cursor: hand;
  min-height: 4vh;
}

.infoClass {
  margin-top: 8%;
}

.qpage {
  width: 100%;
  padding-top: 10%;
}
.setSuperscript {
  vertical-align: super;
}

.toolbarSize {
  width: 100%;
}

.bg-image {
  background-image: url(/m4u_background.jpg);
  background-size: cover;
  background-repeat: none;
  background-attachment: fixed;
}

.bookWrap {
  display: flex;
  flex-wrap: wrap;
  margin-right: 10px;
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
