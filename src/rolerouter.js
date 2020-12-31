let routers = [{
    path: '/',
    component: resolve => require(['./components/pages/DataBoard.vue'], resolve),
    meta: {
        title: '首页'
    },
    children: [{
        path: '/404',
        name: '404',
        component: resolve => require(['./components/pages/404.vue'], resolve),
        meta: {
            title: '404',
            requireAuth: true
        }
    }]
}];
export default routers;