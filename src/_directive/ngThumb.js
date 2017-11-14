// Angular File Upload module does not include this directive
// Only for example
// 
/**
 * The ng-thumb directive
 * @author: nerv
 * @version: 0.1.2, 2014-01-09
 */

define(['app'], function (app) {
    app.registerDirective('ngThumb', ['$window', '$compile', function($window, $compile) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        var zoomer = null;
        var zoomwp = null;
        var _playZoomer = function(scope, index){
            var $win = angular.element($window);
            var queue = scope.item.uploader.queue;
            var item = queue[index];

            var win_height = $win.height();
            var win_width = $win.width();

            var width =  item.width;
            var height =  item.height;

            if(item.width > win_width || item.height > win_height){
                if(item.width/item.height > win_width/win_height){
                    width =  win_width;
                    height =  width/item.width*item.height;
                } else {
                    height =  win_height;
                    width = height/item.height*item.width;
                }
            }

            var offset_left = (win_width - width)/2;
            var offset_top = (win_height - height)/2;

            item._width = width;
            item._height = height;

            item._offset_left = offset_left;
            item._offset_top = offset_top;

            if(index == 0){
                scope.flag = 0;
            } else {
                scope.flag = 2;
            }

            var size = queue.length;

            if(size == (index+1)){
                scope.flag = 3;
            }

            if(size == 1){
                scope.flag = -1;
            }

            var _width = item._width;
            var _height = item._height;
            var _src = item.src;


            item = scope.item;
            console.log(item);

            var content = angular.element('<div class="content"><img style="width:'+_width+'px;height:'+_height+'px;" src="'+_src+'" /></div>');
            content.css({
                width: width,
                height: height,
                left: offset_left,
                top: offset_top
            }).show();
            console.log(content);

            if($('#zoom').size() > 0){
                zoomer = $compile($.parseHTML('<div id="zoom" class="zoom" ng-click="hideZoomer($event, item)"><a class="close"></a><a ng-show="flag>0" href="javascript:;" ng-click="playZoomer($event, '+index+', 0)" class="previous"></a><a ng-show="flag<3&&flag>-1" href="javascript:;" ng-click="playZoomer($event, '+index+', 1)" class="next"></a></div>'))(scope);
                zoomer.show();
                zoomer.append(content);
                zoomwp.html(zoomer);
            } else {
                $body = angular.element("body");
                zoomwp = angular.element('<div class="zoomer"></div>');
                
                // 初始化
                zoomer = $compile($.parseHTML('<div id="zoom" class="zoom" ng-click="hideZoomer($event, item)"><a class="close"></a><a ng-show="flag>0 " href="javascript:;" ng-click="playZoomer($event, '+index+', 0)" class="previous"></a><a ng-show="flag<3&&flag>-1" href="javascript:;" ng-click="playZoomer($event, '+index+', 1)" class="next"></a></div>'))(scope);
                zoomer.show();
                zoomer.append(content);

                zoomwp.html(zoomer);

                $body.append(zoomwp);
            }
        };

        return {
            restrict: 'A',
            replace: true,
            template: '<img/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;

                scope.flag = 0;
                
                //console.log(item);

                //console.log(scope);

                var params = scope.$eval(attributes.ngThumb);

                function onLoadImage(event) {
                    var img = event.target;

                    scope.item.src = img.src;
                    scope.item.width = img.width;
                    scope.item.height = img.height;

                    if(img.width/img.height > 1.25){
                        var width =  125;
                        var height =  width/img.width*img.height;
                    } else {
                        var height =  100;
                        var width = height/img.height*img.width;
                    }

                    element.css('height', height);
                    element.css('width', width);

                    element.attr('src', img.src + '?w=125');
                }

                var file = params.file;
                console.log(file);
                if(file.attachmentUrl) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    scope.item.src = img.src = file.attachmentUrl;
                } else {
                    if (!helper.isFile(params.file)) return;
                    if (!helper.isImage(params.file)) return;

                    var reader = new FileReader();

                    reader.onload = onLoadFile;
                    reader.readAsDataURL(params.file);

                    function onLoadFile(event) {
                        var img = new Image();
                        img.onload = onLoadImage;
                        img.src = event.target.result;
                    }
                }

                // 点击图片 付出弹层效果
                element.click(function(event){
                    var queue = scope.item.uploader.queue;
                    var index = queue.indexOf(scope.item);

                    _playZoomer(scope, index);

                   scope.$apply(function(){
                       scope.flag = scope.flag;
                   })
                });

                //  隐藏
                scope.hideZoomer = function(event, item){
                    zoomer.hide();
                };

                scope.playZoomer = function(event, index, type){
                    event.stopPropagation();
                    event.preventDefault();

                    var queue = scope.item.uploader.queue;
 
                    if(type == 0){
                        // 往前翻页
                        // 
                        if(index == 0){
                            return;
                        }
                        
                        _playZoomer(scope, index-1);

                    } else if(type == 1) {
                        if(index == queue.length-1){
                            return;
                        }

                        _playZoomer(scope, index+1);
                    }
                }
            }
        };
    }]);
});

