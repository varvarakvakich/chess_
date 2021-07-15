import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: () => import('./home.vue')
        },
        {
            path: '/game',
            component: () => import('./game.vue'),
        },
    ]
})
