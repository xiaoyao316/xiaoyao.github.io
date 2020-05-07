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
            { text: 'Github', link: 'https://github.com/xiaoyao316' },
        ],
        sidebar: [
            {
                title: 'JavaScript',// 必要的
                path: '/js/',       // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                collapsable: true,  // 可选的, 默认值是 true,
                sidebarDepth: 1,    // 可选的, 默认值是 1
                children: []
            },
            {
                title: '设计模式',
                path: '/designMode/',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/designMode/singleton',
                    '/designMode/strategy',
                    '/designMode/proxy',
                    '/designMode/iterator',
                    '/designMode/observer',
                    '/designMode/command',
                    '/designMode/composite',
                    '/designMode/template',
                    '/designMode/flyweight',
                    '/designMode/chainOfResponsibility',
                    '/designMode/mediator',
                    '/designMode/decorator',
                    '/designMode/state',
                    '/designMode/adapter'
                ]
            },
            {
                title: '浏览器',
                path: '/browser/',
                collapsable: true,
                sidebarDepth: 1,
                children: [
                    '/browser/loadpage'
                ]
            },
            {
                title: '前端优化',
                path: '/optimize/',
                collapsable: true,
                sidebarDepth: 1,
                children: []
            },
        ],
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
    },
    serviceWorker: true,
    plugins: [
        '@vuepress/active-header-links',
        '@vuepress/back-to-top',
        '@vuepress/plugin-pwa'
    ]
}
