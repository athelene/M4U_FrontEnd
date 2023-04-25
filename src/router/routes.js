const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/LoginPage.vue"),
        props: true,
      },
    ],
  },

  {
    path: "/charter",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "/charter",
        name: "/charter",
        component: () => import("pages/CharterRegister.vue"),
      },
    ],
  },

  {
    path: "/home",
    name: "home:",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/policies",
        name: "policies",
        component: () => import("pages/PolicyPage.vue"),
      },
      {
        path: "/newsubscribercancel",
        name: "newsubscribercancel",
        component: () => import("pages/NewSubscriberCancel.vue"),
      },
      {
        path: "/newsubscribersuccess",
        name: "newsubscribersuccess",
        component: () => import("pages/SuccessPage.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "/newchartersuccess",
        name: "newchartersuccess",
        component: () => import("pages/SuccessCharterPage.vue"),
        meta: {
          needsAuth: true,
        },
      },
      {
        path: "/newpassword",
        name: "newpassword",
        component: () => import("pages/NewPassword.vue"),
        meta: {
          needsAuth: true,
        },
      },
    ],
  },

  {
    path: "/quickconnect",
    name: "quickconnect",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/quickconnect",
        name: "quickconnect",
        component: () => import("pages/QCPage.vue"),
      },
    ],
  },

  {
    path: "/share",
    name: "share",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/share",
        name: "share",
        component: () => import("pages/SharePage.vue"),
      },
    ],
  },

  {
    path: "/import",
    name: "import",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/import",
        name: "import",
        component: () => import("pages/ImportPage.vue"),
      },
    ],
  },

  {
    path: "/export",
    name: "export",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/export",
        name: "export",
        component: () => import("pages/ExportPage.vue"),
      },
    ],
  },

  {
    path: "/exportComplete",
    name: "exportComplete",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/exportComplete",
        name: "exportComplete",
        component: () => import("pages/ExportCompletePage.vue"),
      },
    ],
  },

  {
    path: "/tos",
    name: "tos",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/tos",
        name: "tos",
        component: () => import("pages/PolicyPage.vue"),
      },
    ],
  },

  {
    path: "/info",
    name: "info",
    component: () => import("pages/InfoPage.vue"),
  },

  {
    path: "/credits",
    name: "credits",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/credits",
        name: "credits",
        component: () => import("pages/CreditPage.vue"),
      },
    ],
  },
  {
    path: "/admin",
    name: "admin",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/admin",
        name: "admin",
        component: () => import("pages/AdminPage.vue"),
      },
    ],
  },

  {
    path: "/admininvite",
    name: "admininvite",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/admininvite",
        name: "admininvite",
        component: () => import("pages/AdminInvite.vue"),
      },
    ],
  },

  {
    path: "/adminqc",
    name: "adminqc",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/adminqc",
        name: "adminqc",
        component: () => import("pages/AdminQCPage.vue"),
      },
    ],
  },

  {
    path: "/adminusers",
    name: "adminusers",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/adminusers",
        name: "adminusers",
        component: () => import("pages/AdminUserPage.vue"),
      },
    ],
  },

  {
    path: "/invite",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/invite",
        name: "invite",
        component: () => import("pages/InvitePage.vue"),
      },
    ],
  },

  {
    path: "/daysfree",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/daysfree",
        name: "daysfree",
        component: () => import("pages/DaysFreePage.vue"),
      },
    ],
  },

  {
    path: "/SuggestQCPage",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/suggestqc",
        name: "suggestqc",
        component: () => import("pages/SuggestQCPage.vue"),
      },
    ],
  },

  {
    path: "/SuggestInterviewPage",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/suggestinterview",
        name: "suggestinterview",
        component: () => import("pages/SuggestInterviewPage.vue"),
      },
    ],
  },

  {
    path: "/profile",
    name: "/profile",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/profile",
        name: "profile",
        component: () => import("pages/ProfilePage.vue"),
      },
    ],
  },

  {
    path: "/connections",
    name: "/connections",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/connections",
        name: "connections",
        component: () => import("pages/ConnectionPage.vue"),
      },
    ],
  },

  {
    path: "/contact",
    name: "contact",
    meta: { needsAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/contact",
        name: "contact",
        component: () => import("pages/ContactUs.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
