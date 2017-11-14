// 发布时候采用不同的roadmap ——即使用fis release -d publish时候
var staticsPath = '/static-huang';//资源目录
var pagePrePath = '/static-huang';//资源模板

//发布到生产环境_released目录
var isPublish = ['sandbox','publish'].indexOf(process.title.split(/\s/)[3]) != -1;
if (isPublish) {
    staticsPath = '/_released/resources/static-huang';
    pagePrePath = '/_released/views/static-huang';
}


//
var MACHINE_MAP = {
    // 沙盒
    sandbox: {
        host:'http://127.0.0.1:8080',
        path:'D:/'
    }
};


//项目配置
fis.config.merge({
    statics: staticsPath,
    pagePrePath: pagePrePath,

    project: {//项目中哪些文件被忽略 exclude不包含的
        exclude: [/\.(tar|rar|psd|jar|bat|sh|md)$/i, /^\/doc\/|\/dep\/est|.*\/\.demo\//i]
    },

    modules: {

        parser: {//此文件用到哪些插件
            less: 'less'
        },

        lint: {  //代码检查过程中 检查报错和去掉log
            js: 'jshint',
            css: 'csslint'
        },

        preprocessor: {  //改变文件内容自定义函数插件
            html: filePreprocessor
        },

        // postprocessor: {
        //     js: filePostprocessor
        // }
    },

    roadmap: {//文件路径处理
        ext: {//表示文件后缀配置
            less: 'css'//把文件后缀为less修改为css
        },

        path: [
            {
                reg: /^\/dep\/(.*)/i,  //匹配文件规则
                url: '/static-huang/dep/$1',//将匹配文件原始路径修改为指定url
                release: '${statics}/dep/$1',//文件路径的修改
                useCompile: false,//
            },
            {
                 reg: /^\/manage\/(.*)/i,
                 release: isPublish?false:'/manage/$1'//当发布到本地测试环境使发布的manage  $1上面匹配文件$1表示括号1的文件，$2表示正则中的2，$0表示所有
            },
            {
                reg: /^\/stat\/(.*)/i,
                release: isPublish?false:'/stat/$1'
            },
            {
                reg: /^\/src\/index\.html$/i,
                release: '${pagePrePath}/index.html'
            },

            {
                reg: /^\/src\/login\/login\.html$/i,
                release: '${pagePrePath}/login.html'
            },
            {
                reg: /^\/src\/land\/land\.html$/i,
                release: '${pagePrePath}/land.html'
            },
            {
                reg: /^\/src\/(.*)/i,//src所有
                url: '/static-huang/$1',
                release: '${statics}/$1'
            }
        ]
    },

    settings: {//插件的配置
        optimizer: {
            'uglify-js': {//js压缩插件
                mangle: false,//
                compress: {
                    drop_console: true,//是否去掉log
                    drop_debugger: true //debugger去掉
                }
            }
        },
        lint: {
            csslint: {  //css检查插件
                // 若ie值为false，则忽略所有与IE兼容性相关的校验规则
                ie: false,
                // 要忽略的规则ID列表
                ignore: ['font-sizes', 'outline-none', 'compatible-vendor-prefixes', 'star-property-hack']
            }
        }
    },
    deploy: {
        publish : {//publish发布命令自定义自己的命令
            exclude : /\/doc\/|\/test\/|.*\.test\.json|\/_directive\/tpl\/|\/_common\/component\/|\/_common\/less-config\.css|server\.conf|map\.json/i,
            //from参数省略，表示从发布后的根目录开始上传
            //发布到当前项目的上一级的output目录中
            to : '../'
        }
    }
});

// 8位时间戳，精确到2分钟的发布区分
var timestamp = new Date().getTime().toString().substr(0,8);
// 预处理器插件扩展，对vm文件替换版本戳
function filePreprocessor(content, file) {
    var contentStr;
    contentStr = content.replace(/\${__version__}/g, timestamp);

    return contentStr;
};

// 设置deploy节点
fis.util.map(MACHINE_MAP, function(key, item){
    var hostPath = item['path'] || '',
        hostName = item['host'],
        serverReceiver = hostName + '/fisreceiver.jsp',
    // 设置replace规则
        replaceFrom = /http:\/\/www\.58\.com|http:\/\/static\.58\.com/g,
        replaceTo = function(domain){
            switch(domain){
                case 'http://www.58.com':
                    return hostName;
                    break;
                case 'http://static.58.com':
                    return '';
                    break;
            }
        };

    fis.config.set('deploy.' + key, [{
        //如果配置了receiver，fis会把文件逐个post到接收端上
        receiver : serverReceiver,
        //从产出的结果的static目录下找文件
        from : '/resources/static',
        //上传目录从static下一级开始不包括static目录
        subOnly : true,
        //保存到远端机器的/home/fis/www/static目录下
        //这个参数会跟随post请求一起发送
        to : hostPath + '/resources/static',
        // replace
        replace: {
            from: replaceFrom,
            to: replaceTo
        }
    },{
        //如果配置了receiver，fis会把文件逐个post到接收端上
        receiver : serverReceiver,
        //从产出的结果的static目录下找文件
        from : '/views/static',
        //上传目录从static下一级开始不包括static目录
        subOnly : true,
        //保存到远端机器的/home/fis/www/static目录下
        //这个参数会跟随post请求一起发送
        to : hostPath + '/views/static',
        // replace
        replace: {
            from: replaceFrom,
            to: replaceTo
        }
    }
    ]);
});