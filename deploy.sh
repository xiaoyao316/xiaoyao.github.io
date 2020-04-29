#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:xiaoyao316/xiaoyao316.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:xiaoyao316/xiaoyao316.github.io.git master

# Travis配置的推送
git push -f https://5d5b68068bbf89b5a21f8075dc7827c4f14cf847@github.com/xiaoyao316.github.io.git master:master

cd -
