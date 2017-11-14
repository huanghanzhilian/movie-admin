/**
 * jrOrderStates指令定义，用于贷款流程的状态切换
 * @example <jr-order-states selected="checkStatus" value="" dataid=""></jr-order-states>
 * @author yuebin
 */

define([
'app',
'directive/jrPlaceholder',
'directive/jrCheckbox',
'model/orderStatesModel'
], function (app) {
    app.registerDirective('jrOrderStates', [
    '$http',
    '$modal',
    'orderStatesModel',
    function ($http, $modal, orderStatesModel) {
        // 订单状态
        var ORDER_STATES = [''].concat(orderStatesModel);

        var rejectTpl = __inline('tpl/jrOrderStatesReject.html');
        // var confirmTpl = __inline('tpl/jrOrderStatesConfirm.html');

        return {
            restrict: 'E',
            replace: true,
            template: __inline('tpl/jrOrderStates.html'),
            scope: {
                dataid: '@',
                theme: '@',
                selected: '=',
                value: '=',
                datainfo: '='
            },
            link: function($scope, element, attrs) {
                // 设置显示状态
                $scope.displayName = ORDER_STATES[$scope.value].name;

                // 设置待选项
                setOptions($scope);
                /**
                 * 状态变更
                 * @param  {object} option  选项信息
                 */
                $scope.selcet = function(option) {
                    var modalTpl;
                    var reasons;
                    var title;

                    switch (option.value.toString()) {
                        case '2':
                            // 审核通过
                            // modalTpl = confirmTpl;
                            // title = '审核确认';
                            // confirmModal($scope, modalTpl, option, title);
                            if (confirm('确认该用户审核通过')) {
                                updateState($scope, option);
                            }
                            break;
                        case '3':
                            modalTpl = rejectTpl;
                            title = '审核不通过理由';
                            rejectModal($scope, modalTpl, option, title, reasons);
                            break;
                        default:
                            updateState($scope, option);
                    }
                }
            }
        };

        /**
         * 两种拒绝操作弹窗
         */
        function rejectModal($scope, modalTpl, option, title, reasons) {
            var modalStatesReject = $modal.open({
                template: modalTpl,
                controller: 'ModalStatesReject',
                backdrop: 'static',
                resolve: {
                    items: function() {
                        return $.extend(true, [], reasons);
                    },
                    title: function() {
                        return title;
                    }
                }
            });

            modalStatesReject.result.then(function (reasonStr) {
                // called by $modal.close   
                updateState($scope, option, {reason: reasonStr});
            });
        }

        /**
         * 两种确认操作弹窗
         */
        function confirmModal($scope, modalTpl, option, title) {
            var modalStatesReject = $modal.open({
                template: modalTpl,
                controller: 'ModalStatesConfirm',
                backdrop: 'static',
                resolve: {
                    datainfo: function() {
                        return $scope.datainfo;
                    },
                    title: function() {
                        return title;
                    }
                }
            });

            modalStatesReject.result.then(function (postData) {
                // called by $modal.close   
                updateState($scope, option, postData);
            });
        }

        /**
         * 状态变更
         * @param  {object} additionParams 附加参数
         */
        function updateState($scope, option, additionParams) {
            $http.post('/rs/manage/examinehouseinfo', $.param($.extend({
                orderId: $scope.dataid,
                pass: option.value.toString() === '2'
            }, additionParams))).success(function(data, status, headers, config) {
                // TODO 完成选项
                $scope.displayName = option.name;

                $scope.value = option.value;
                setOptions($scope);

                // TODO 如果提交了备注要赋值回去
                // if (additionParams && additionParams.note) {
                //     $scope.datainfo.note = additionParams.note;
                // }
            });
        }

        /**
         * 设置待选项
         */
        function setOptions($scope) {
            // 获取当前状态
            $scope.options = [];
            //  1   待审核 -> 其他全部
            //  2   审核通过
            //  3   审核不通过
            switch ($scope.value.toString()) {
                case '1':
                    $scope.options = $scope.options.concat(ORDER_STATES.slice(2));
                    break;
                default:
                    //在指令渲染完成后置为disabled
                    $scope.disabled = true;   
            }
        }
    }]);

    app.registerController('ModalStatesReject', function ($scope, $modalInstance, items, title) {
        $scope.reasons = items;
        $scope.title = title;
        $scope.addition = {
            text: undefined
        }

        $scope.submit = function () {
            var selectedReasons = [];
            // 遍历搜集已选结果
            for (var i = 0; i < $scope.reasons.length; i++) {
                for (var j = 0; j < $scope.reasons[i].length; j++) {
                    if ($scope.reasons[i][j].checked) {
                        selectedReasons.push($scope.reasons[i][j].text);
                    }
                }
            }
            //追加附加结果
            if ($.trim($scope.addition.text)) {
                // 判断文字长度
                if ($.trim($scope.addition.text).length > 100) {
                    $scope.errorInfo = '补充说明不能超过100个字';
                    return false;
                }
                selectedReasons.push($scope.addition.text);
            }

            if (selectedReasons.length) {
                $modalInstance.close(selectedReasons.join(';'));
            } else {
                $scope.errorInfo = '请选择或填写理由';
            }
        };
    });

    app.registerController('ModalStatesConfirm', function ($scope, $modalInstance, datainfo, title) {
        $scope.datainfo = datainfo;
        $scope.title = title;
        $scope.postData = {
            sucLoanAmount: datainfo.applyLoanAmount,
            sucLoanMonth: datainfo.applyLoanMonth
        };

        $scope.submit = function () {
            // if (!$.trim($scope.postData.sucLoanAmount)) {
            //     $scope.errorInfo = '实际批贷金额不能为空';
            //     return false;
            // }
            // if (!$.trim($scope.postData.sucLoanMonth)) {
            //     $scope.errorInfo = '实际期限不能为空';
            //     return false;
            // }

            $modalInstance.close($scope.postData);
        };
    });
});