/**
 * CtrlApp.js 整个app的上层控制器
 * @description 处理整个app层面的事务
 */
define(['app'], function(app) {
  app.controller('CtrlApp', ['$scope', '$http', '$rootScope', '$timeout', '$location', '$anchorScroll', '$document', '$window', '$q', function($scope, $http, $rootScope, $timeout, $translate, $location, $anchorScroll, $document, $window, $q) {

    //rootscope中存储用户的信息
    // $rootScope.CURRENT_USER_NAME = CURRENT_USER_NAME;
    //anchor处理
    $scope.anchorTo = function(anchor) {
        $location.hash(anchor);
        $anchorScroll();
    };

    //菜单展开收缩效果
	$('a.dpdtoggle', $('#side')).click(function(event) {
	    event.preventDefault();
	    event.stopPropagation();
	    
	    var parent = $(this).parent();
	    var submenu = $('>ul.submenu', parent);
	    if(submenu.is(":visible")){
	        submenu.slideUp('fast', function(){
	            parent.removeClass('expand');
	        });
	        
	    } else {
	        submenu.slideDown('fast', function(){
	            parent.addClass('expand');
	        });
	    }
	});

	if(!window.chrome){
		$('.vacation-chorme').show();
		$scope.vacation = true;
	}

  }]);
});