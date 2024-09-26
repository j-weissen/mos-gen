import { createRouter, createWebHistory } from "vue-router";
import Form from "../components/Form.vue";
import Login from "../components/Login.vue";
import Edit from "../components/Edit.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Form",
      component: Form,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/edit",
      name: "Edit",
      component: Edit,
    },
  ],
});

export default router;
