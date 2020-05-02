**Github pages 个人主页**
> 受限于Github pages默认master分支，用其它分支就只能多一级目录，所以采用如下项目结构，打包时自动copy一份到根目录，既保证正常开发，也能直接用master分支展示pages
```
├── ...              // 打包后自动复制出来的文件
├── docs             // 源码目录
│ ├── .vuepress
│ │ ├── dist         // 打包目录
│ │ ├── public       // 资源目录
│ │ └── config.js    // vuepress配置
│ ├── ...            // 博文
│ ├── README.md      // 博客首页配置
├── .gitignore       // git忽略配置
├── deploy.js        // 同步打包文件程序
├── LICENSE
├── package.json
├── README.md
```


