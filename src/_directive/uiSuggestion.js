/**
 * ui-suggestion 
 * 
 * 大58suggestion 
 * 
 * @author  Yang,junlong at 2015-12-03 21:12:55 build.
 * @version $Id: uiSuggestion.js 12511 2016-01-21 11:23:26Z yangjunlong $
 */

define(['app'], function (app) {
    app.registerDirective('uiSuggestion', ['$filter', '$http', function($filter, $http) {

        return {
            restrict: 'E',
            replace: true,
            template: __inline('tpl/uiSuggestion.html'),
            scope: {
                placeholder: '@'
            },
            link: function($scope, element, attrs) {
                var $input = element.find('input');

                var keyword = '';
                var cityid = 1;
                var catid = 8;
                var type = 1;

                $scope.districtNameList = [1,2]

                var timer = null;
                $input.on('keyup', function(event){
                	clearTimeout(timer);
                	timer = setTimeout(function(){
                		// 使用jquery的jsonp请求
                		$.ajax({
				            type: "get",
				            async: false,
				            url: "http://suggest.58.com.cn/searchsuggest_6.do?inputbox=新康园&cityid=1&catid=8&type=1",
				            dataType: "jsonp",
				            jsonp: "callback",
				            //jsonpCallback:"success_jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
				            success : function(json){
				            	//$scope.districtNameList = json.w;
				            	$scope.$watch('districtNameList', function() {
				                    $scope.districtNameList = json.w;
				                });
				            },
				            error:function(){
				                //todo nothing
				            }
				        });
                	}, 200);
                });
            }
        };
    }]);
});
