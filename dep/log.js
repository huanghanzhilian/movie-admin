/**
 * 用户数据收集 统一日志统计
 *
 * 参数约定:
 * 
 * 
 */
(function($){

    // 全局统计项
    var _options = {};

    var log = {
        init: function(){
            var that = this;
            $(document).on('click', function(event){
                var target = event.target;
                var ele = $(target).closest('*[log]');
                var log = $(ele).attr('log');
                if(log){
                    that.send(that.parseLog(log));
                }
            });
        },

        /**
         * 发送log统计请求
         * 
         * @return {[type]} [description]
         */
        send: function(options){
            /**
             * log统计参数约定
             *
             * @cid 分类ID cid=0 默认值设置为0
             * @url 被点击链接的url，如果是展现的统计则为当前页的url
             */
            var defaults = {
                cid: "manage",
                type:"",
                us:"",
                url: location.href,
                t: (new Date()).getTime()
            };

            $.extend(defaults, _options, options);

            defaults.url = encodeURIComponent(defaults.url);

            var query = [];
            $.each(defaults, function(key, item) {
                query.push(key + '=' + item);
            });

            var logUrl ='/log.gif?';

            // 发送日志请求
            this.stat(logUrl +  query.join('&'));
        },

        /**
         * 创建一个图片对象用于发送统计请求
         * 
         * @param  {String} src 图片统计地址
         */
        stat: function(src) {
            var n = "__log_58_" + (new Date()).getTime();

            // 将image对象赋给全局变量，防止被当做垃圾回收，造成请求失败。
            var img = window[n] = new Image();
            img.onload = img.onerror = function(){
                //垃圾回收
                window[n] = null; 
            };
            img.src = src;
            img = null;//垃圾回收
        },

        /**
         * 往全局统计项中添加一些KEY 
         */
        push: function(key, value){
            var length = arguments.length;
            if (length > 1) {
                _options[key] = value;
            } else {
                $.extend(_options, key);
            }
        },

        remove: function(key){
            delete _options[key];
        },

        parseLog: function(logStr) {
            if(!logStr){
                return {};
            }
            var tmp = logStr.split(',');
            var result = {};
            for (var i = 0; i < tmp.length; i++) {
                var t = tmp[i].split(':');
                //result[t[0]] = t[1];
                result[$.trim(t[0])] = $.trim(t[1]);
            }
            return result;
        }
    };
    log.init()
    $.log=log
})(jQuery)

