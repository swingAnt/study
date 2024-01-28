import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import("../views/About.vue"),
  },
  {
    path: "/list",
    name: "List",
    children:[
      {
        path:"/list/:id",
        name:'Details',
        component: () =>
          import("../views/Details.vue"),
      }
    ],
    component: () =>
      import("../views/List.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to,from,next)=>{
//   if( ){
//     next();
//   }else{
//     router.push('/login')
//     next('/login')
//   }
// })

export default router;
