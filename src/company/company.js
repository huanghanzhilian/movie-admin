/**
 * CtrlHome.js 首页控制器
 * @url /#/home
 * @author yuebin
 */

define([
'app',
'directive/jrDatepicker',
'directive/jrDropdownButton',
'directive/jrPlaceholder'
], function ( app) {
    app.registerController('CtrlCompany', ['$scope','$rootScope', '$http', '$modal', '$state', '$stateParams', '$filter','FileUploader',
    function ($scope,$rootScope, $http, $modal, $state, $stateParams, $filter,FileUploader) {

        
        $scope.queryParams = $.extend({
            pageNum: 1,
            querySize:10
        }, $stateParams);

        $scope.queryOptions = {
            companyStatus: [
                {value: '', name: '是否合作'},
                {value: '1', name: '合作中'},
                {value: '0', name: '合作终止'}
            ],
            showSubCompany:[
                {value: '', name: '是否显示子公司'},
                {value: '0', name: '不显示'},
                {value: '1', name: '显示'}
            ]
        };

        $scope.orders = {
            pageNum: 1
        };
        
        function getData(params) {
            $http.get('/stat/company/json/get/getCompanyPage', {
                params: $.extend({}, params, {optDesc: '合作伙伴列表'})
            }).success(function(data, status, headers, config) {
                $scope.orders = data.object;
            });
        };

        getData($scope.queryParams);
        
        $scope.addCompany = function(event) {
            window.open("#/company/add")
        };
        $scope.search = function(event) {
            $scope.queryParams.pageNum = 1;
            getData($scope.queryParams)
        };

        //清空查询项
        $scope.clearParams = function() {
            var pageSize = $scope.queryParams.pageSize;
            $scope.queryParams = {
                pageNum: 1,
                pageSize: pageSize
            }
            console.log($scope.queryParams)
        }

        /**
         * 翻页跳转
         */
        $scope.$watch('orders.pageNum', function(newValue, oldValue) {
            if (newValue === oldValue) {
                return false;
            }
            $scope.queryParams.pageNum = newValue;
            getData($scope.queryParams)
        });

        $scope.$watch('orders.pageSize', function(newValue, oldValue) {
            if (newValue === oldValue) {
                return false;
            }
            $scope.queryParams.pageSize = newValue;
            getData($scope.queryParams)
        });

    }]);
});
