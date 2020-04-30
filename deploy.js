const fs = require('fs');
stat = fs.stat;
const path = require('path');
/**
 * 删除根目录下旧文件
 * @param  String dir 文件夹名称
 */
let protected_folders = ['.git', '.idea', 'docs', '.gitignore', 'deploy.js', 'LICENSE', 'package.json', 'README.md']
let nods = function (dir) {
    fs.readdir(dir, function(err, files) {
        files.forEach(function(filename) {
            var src = path.join(dir, filename);
            if(!protected_folders.includes(src)) {
                stat(src, function (err, st) {
                    if (err) { throw err; }
                    // 判断是否为文件
                    if (st.isFile()) {
                        fs.unlink(src, (err) => {
                            if (err) throw err;
                            console.log('成功删除' + src);
                        });
                    } else {
                        // 递归作为文件夹处理
                        nods(src);
                    }
                });
            }
        });
    });
};

nods('./');


/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */

var copy = function( src, dst ){
    // 读取目录中的所有文件/目录
    fs.readdir( src, function( err, paths ){
        if( err ){
            throw err;
        }
        paths.forEach(function( path ){
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;
            stat( _src, function( err, st ){
                if( err ){
                    throw err;
                }
                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst );
                    // 通过管道来传输流
                    readable.pipe( writable );
                }
                // 如果是目录则递归调用自身
                else if( st.isDirectory() ){
                    exists( _src, _dst, copy );
                }
            });
        });
    });
};

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, callback ){
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            callback( src, dst );
        }
        // 不存在
        else{
            fs.mkdir( dst, function(){
                callback( src, dst );
            });
        }
    });
};

// 复制目录
exists( './docs/.vuepress/dist', './', copy );
