module.exports = {
    title: '前端大户',
    description: '前端大户个人博客',
    head: [
        ['link', { rel: 'icon', href: '/img/favicon.ico' }]
    ],
    themeConfig: {
        nav: [
            { text: '主页', link: '/' },
            { text: '关于', link: '/about/' },
            { text: 'Github', link: 'https://github.com/xiaoyao316' },
        ],
        sidebar: [
            {
                title: 'Javascript',// 必要的
                path: '/js/',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 1,    // 可选的, 默认值是 1
                children: [
                    '/js/proto',
                    '/js/eventloop'
                ]
            },
        ],
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
    }
}
