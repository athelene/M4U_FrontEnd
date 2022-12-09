import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useUserStore } from "stores/user";
import publicPages from "./openRoutes";

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from) => {
    // redirect to login page if not logged in and trying to access a restricted page

    const authRequired = !publicPages.includes(to.path);

    const auth = useUserStore();
    if (authRequired && !auth.user) {
      console.log(
        "auth required for this route, not authenticated, return to login page"
      );
      if (to.name !== "login") {
        return "/login";
      }
    }
  });
  return Router;
});
