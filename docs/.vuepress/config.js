module.exports = {
    title: '前端大户',
    description: '前端大户个人博客',
    head: [
        ['link', { rel: 'icon', href: '/img/favicon.ico' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['link', { rel: 'apple-touch-icon', href: '/img/logo.png' }]
    ],
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            { text: 'JavaScript', link: '/js/promise' },
            { text: '设计模式', link: '/designMode/singleton' },
            { text: '源码学习',
                items: [
                    { text: 'Vue', link: '/vue/' },
                    { text: 'Vuex', link: '/vuex/' },
                    { text: 'Vue-Router', link: '/vue-router/' },
                    { text: 'Element UI', link: '/element/communicate' }
                ]
            },
            { text: 'Github', link: 'https://github.com/xiaoyao316' }
        ],
        sidebar: {
            '/js/': [
                'promise',
                'throttle',
                'call-apply-bind',
                'new',
                'instanceof',
                'compose',
                'currying',
                'proto',
                'eventloop',
            ],
            '/designMode/': [
                'singleton',
                'strategy',
                'proxy',
                'iterator',
                'observer',
                'command',
                'composite',
                'template',
                'flyweight',
                'chainOfResponsibility',
                'mediator',
                'decorator',
                'state',
                'adapter'
            ],
            '/element/': [
                'communicate',
                'form',
                'alert',
                'button',
            ],
            '/vue/': []
        },
        sidebarDepth: 4,
        lastUpdated: 'Last Updated',
    },
    serviceWorker: true,
    plugins: [
        '@vuepress/active-header-links',
        '@vuepress/back-to-top',
        '@vuepress/plugin-pwa'
    ]
}
