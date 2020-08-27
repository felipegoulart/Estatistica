import Vue from 'vue'
import Router from 'vue-router'

import Inicio from '@/components/Inicio'

Vue.use(Router)

const routes = [
    {
        name: 'inicio',
        path: '/',
        component: Inicio
    }
]

const router = new Router({ routes })

export default router