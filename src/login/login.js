/**
 * CtrlLogin.js 登陆页控制器，独立于angular路由之外
 * @url /login
 * @author yuebin
 */
// 独立placeholder定义，针对首页

var app=angular.module("app",['ui.bootstrap','ui.bootstrap.tpls']);

(function(app) {
    app.directive("jrPlaceholder", [function() {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function($scope, element, attrs, ctrl) {
                if (!('placeholder' in document.createElement('input'))) {
                    var value;

                    var placehold = function () {
                        element.val(attrs.jrPlaceholder);
                        element.addClass('placeholder-ie');
                    };
                    var unplacehold = function () {
                        element.val('');
                        element.removeClass('placeholder-ie');
                    };

                    $scope.$watch(attrs.ngModel, function (val) {
                        value = val || '';
                    });

                    element.on('focus', function () {
                        if(value === '') {
                            unplacehold();
                        }
                    });

                    element.on('blur', function () {
                        if (element.val() === '') {
                            placehold();
                        }
                    });

                    ctrl.$formatters.unshift(function (val) {
                        if (!val) {
                            placehold();
                            value = '';
                            return attrs.jrPlaceholder;
                        }
                        return val;
                    });
                } else {
                    element.attr('placeholder', attrs.jrPlaceholder);
                }
            }
        };
    }])
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    app.controller('CtrlLogin', ['$scope','$http','$location','$modal',function ($scope, $http, $location, $modal) {
        /**
         * 登录参数,兼容浏览器密码回填
         * @type {Object}
         */
        if($location.search().error){
            $scope.verif="/rs/manage/authCode?"+new Date().getTime()+"";
        }
        //console.log($location.search().error)
        setTimeout(function() {
            $scope.loginData = {
                optDesc:"用户登录",
                userName: $('#username').val(),
                password: $('#password').val()
            };
        }, 500);

        // 用户名输入框失去焦点时候兼容浏览器密码手动触发回填
        $scope.blur = function() {
            if ($scope.loginData.password !== $('#password').val()) {
                $scope.loginData.password = $('#password').val();
            }
        }

        $scope.enter = function($event) {
            if ($event.keyCode === 13 && $scope.loginData.password !== $('#password').val()) {
                $scope.loginData.password = $('#password').val();
            }
        }
        $scope.refresh=function(){
            $scope.verif="/rs/manage/authCode?"+new Date().getTime()+"";
        }
        $scope.login = function() {

            $scope.loginData.password = $.fn.md5($scope.loginData.password);

            $http({
                method: 'POST',
                url: '/stat/white/json/get/checklogin',
                data: $.param($scope.loginData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).success(function(data, status, headers, config) {
                if (data.success) {
                    loginSuccess();
                    if(getUrlParam('referrer')){
                        location.href = getUrlParam('referrer') + location.hash;
                    } else {
                        location.href = '/stat/index'+location.hash;
                    }

                } else {
                    $scope.loginForm.errorInfo = data.message;
                }
                if(data.requestParams.auth==1){
                    $location.search("error","true")
                    $scope.verif="/rs/manage/authCode?"+new Date().getTime()+"";
                }

            }).error(function(data, status, headers, config) {
                $scope.loginForm.errorInfo = '网络错误,请检查网络连接';
            });

            var loginCount = 0;
            function loginSuccess() {
                if (++loginCount > 1) {
                    location.href = '/stat/index';
                }
            }
        }
        /**
         * 查找密码
         */
        $scope.findpwd = function(event, status) {
            step1()
        };
        var step1=function(){
            var modaladdConfig = $modal.open({
                template: __inline('tpl/step1.html'),
                controller: function($scope,$modalInstance){
                    $scope.data={
                        userName:""
                    }
                    $scope.errorInfo=""
                    $scope.submit=function(){
                        $scope.errorInfo=""
                        $http({
                            method: 'POST',
                            url: '/rs/manage/checkuser',
                            data: $.param({
                                userName:$scope.data.userName
                            }),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        }).success(function(data, status, headers, config) {
                            if (data.success) {
                                step2(data.object.userName,data.object.phone)
                                $scope.$dismiss('cancel')

                            } else {
                                $scope.errorInfo = data.message;
                            }
                        }).error(function(data, status, headers, config) {
                            $scope.errorInfo = '网络错误,请检查网络连接';
                        });
                    }
                },
                backdrop: 'static',
                resolve: {
                    status: function() {
                        return status
                    }
                }
            });

            modaladdConfig.result.then(function () {

            });
        }
        var step2 = function(userName,phone) {
            var modaladdConfig = $modal.open({
                template: __inline('tpl/step2.html'),
                controller: function($scope,$modalInstance){
                    $scope.data={
                        userName:userName,
                        phone:phone,
                        phonePin:"",
                        password:"",
                        confirmPassword:""
                    }
                    $scope.errorInfo = "";
                    $scope.djs=function(num){
                        var djs=num
                        $("#getPhonePin").attr("disabled","disabled")
                        $("#pin").show()
                        var _sync=function(){
                            if(djs>0){
                                $("#pintext").text(djs)
                                djs--
                                setTimeout(function(){
                                    _sync()
                                },1000)
                            }else{
                                $("#pin").hide()
                                $("#getPhonePin").removeAttr("disabled")
                            }
                        }
                        _sync()
                    }
                    $scope.getPhonePin=function(){
                        $scope.errorInfo = "";

                        $http({
                            method: 'POST',
                            url: '/rs/manage/getPhonePIN',
                            data: $.param({
                                userName:$scope.data.userName,
                                phone:$scope.data.phone
                            }),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        }).success(function(data, status, headers, config) {
                            if (data.success) {
                                $scope.djs(180)
                            } else {
                                $scope.errorInfo = data.message;
                            }
                        }).error(function(data, status, headers, config) {
                            $scope.errorInfo = '网络错误,请检查网络连接';
                        });


                    }
                    $scope.submit=function(){
                        $scope.errorInfo=""

                        if($scope.data.password!=$scope.data.confirmPassword){
                            $scope.errorInfo="两次密码输入不一致"
                            return;
                        }
                        $http({
                            method: 'POST',
                            url: '/rs/manage/findMyPassword',
                            data: $.param({
                                userName:$scope.data.userName,
                                phone:$scope.data.phone,
                                phonePin:$scope.data.phonePin,
                                password:$scope.data.password,
                                confirmPassword:$scope.data.confirmPassword,
                                optDesc:"获取初始密码"
                            }),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        }).success(function(data, status, headers, config) {
                            if (data.success) {
                                step3()
                                $scope.$dismiss('cancel')

                            } else {
                                $scope.errorInfo = data.message;
                            }
                        }).error(function(data, status, headers, config) {
                            $scope.errorInfo = '网络错误,请检查网络连接';
                        });
                    }
                },
                backdrop: 'static',
                resolve: {
                    status: function() {
                        return status
                    }
                }
            });

            modaladdConfig.result.then(function () {

            });
        }
        var step3 = function() {
            var modaladdConfig = $modal.open({
                template: __inline('tpl/step3.html'),
                controller: function($scope,$modalInstance){

                },
                backdrop: 'static',
                resolve: {
                    status: function() {
                        return status
                    }
                }
            });

            modaladdConfig.result.then(function () {

            });
        }
        /**
         * 验证码点击更换
         * @param  {[object]} e 事件对象
         */
        var verifyCodeUrl = '/rs/user/verifyCode?_=';
        $scope.uncacheVerifyCodeUrl = verifyCodeUrl + new Date().getTime();
        $scope.changeCode = function(e) {
            $scope.uncacheVerifyCodeUrl = verifyCodeUrl + new Date().getTime();
        }
    }]);
})(app)


