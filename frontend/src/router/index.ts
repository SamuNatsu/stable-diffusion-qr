/// Router module
import { Router, createRouter, createWebHashHistory } from 'vue-router';

// Components
import Index from '@/views/Index.vue';
import Info from '@/views/Info.vue';
import Generator from '@/views/Generator.vue';
import Prettifier from '@/views/Prettifier.vue';

// Export router
export const router: Router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/info',
      component: Info
    },
    {
      path: '/generator',
      component: Generator
    },
    {
      path: '/prettifier',
      component: Prettifier
    }
  ]
});

// Router guards
router.afterEach((): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
