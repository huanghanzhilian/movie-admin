/**
 * Created by ZhangMiao on 2016/8/10.
 */
define([
    'app',
    'directive/jrDatepicker',
    'directive/jrDropdownButton',
    'directive/jrPlaceholder',
    'directive/jrPagination'
], function(app){
    app.registerController('CtrlCompanyWarning', ['$scope', '$http', '$state', '$stateParams', '$modal',
        function($scope, $http, $state, $stateParams, $modal) {
            //初始查询参数
            $scope.queryParams = $.extend({
                pageNum: 1,
                pageSize: 10
            }, $stateParams);

            $scope.queryOptions = {
                ruleGroup: [
                    {value: '',name: '类型'},
                    {value: '逾期',name: '逾期'},
                    {value: '清退',name: '清退'},
                    {value: '授信',name: '授信'},
                    {value: '推单',name: '推单'},
                    {value: '合同',name: '合同'},
                    {value: '房管员',name: '房管员'}
                ],
                warningStatus: [
                    {value: '', name: '是否解决'},
                    {value: '10', name: '待解决'},
                    {value: '20', name: '已解决'}
                ],
                triggerType: [
                    {value: '', name: '触发方式'},
                    {value: '1', name: '系统冻结'},
                    {value: '0', name: '短信提醒'}
                ],
                unfreezeType: [
                    {value: '', name: '解除方式'},
                    {value: '-11', name: '系统解冻'},
                    {value: '-110', name: '人工解冻'}
                ]
            };

            $scope.orders = {
                pageNum: 1,
                pageSize: 10
            };

            function getData(params) {
                //$http.get('/v4/rs/manage/getCompanyWarningPage', {
                $http.get('/manage/company-warning/json/get/getCompanyWarningPage', {
                    params: $.extend({}, params, {optDesc: '公寓预警（新）'})
                }).success(function(data, status, headers, config) {
                    $scope.orders = data.object;
                });
            }

            getData($scope.queryParams);

            $scope.search = function() {
                $scope.queryParams.pageNum = 1;
                getData($scope.queryParams);
                //$state.go('company-warning.list', $scope.queryParams,{reload:true});
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

            $scope.toOrderPage = function(item) {
                //var url = '';
                //ruleCorrectType  0推单,1逾期，2清退，3.授信,4.房管员,5.授信,6.合同
                if(item.ruleCorrectType == '1') {
                    //url = $state.href('overdue.list', {orderIds: item.orderIds});
                    console.log(item.orderIds)
                    $state.go('overdue', {orderIds: item.orderIds});
                }
                else if(item.ruleCorrectType == '2') {
                    //url = $state.href('repayingList.list', {orderIds: item.orderIds});
                    $state.go('repayingList.list', {orderIds: item.orderIds});
                }
                //window.open(url);
            }

            /**
             * 翻页跳转
             */
            $scope.$watch('orders.pageNum', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return false;
                }
                $scope.queryParams.pageNum = newValue;
                getData($scope.queryParams);
                //$state.go('company-warning.list', $.extend({}, $stateParams, {pageNum: newValue}));
            });

            $scope.$watch('orders.pageSize', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return false;
                }
                $scope.queryParams.pageSize = newValue;
                getData($scope.queryParams)
            });

            //设置备注
            //$scope.modify = function (item) {
            //    var message = item;
            //    $modal.open({
            //        template: __inline('tpl/modify.html'),
            //        controller: 'ModifyCtrl',
            //        resolve: {
            //            message: function () {
            //                return angular.copy(message);
            //            }
            //        }
            //    })
            //}
            //
            //app.registerController('ModifyCtrl', ['$scope','$modalInstance','message',
            //    function($scope,$modalInstance,message) {
            //        $scope.message = message;
            //        console.log(message);
            //        $scope.warningStatus = [
            //            {value: '', name: '预警状态'},
            //            {value: '0', name: '待解决'},
            //            {value: '1', name: '已解决'},
            //            {value: '2', name: '忽略'}
            //        ]
            //        $scope.submit = function() {
            //            var params = {
            //                id: $scope.message.id,
            //                warningStatus: $scope.message.warningStatus,
            //                remark: $scope.message.remark
            //            };
            //            $http.get('/v4/rs/manage/editOrderWarning',{
            //                params: params
            //            }).success(function(data) {
            //                if(data.success) {
            //                    $modalInstance.close();
            //                    $state.reload();
            //                }
            //            })
            //        }
            //    }])

        }])
})
