import Vue from 'vue'
import Router from 'vue-router'

import Descritiva from '@/views/Descritiva'

Vue.use(Router)

const routes = [
    {
        name: 'inicio',
        path: '/',
        component: Descritiva
    }
]

const router = new Router({ routes })

export default router