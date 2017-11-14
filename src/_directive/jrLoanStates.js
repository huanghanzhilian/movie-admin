/**
 * jrLoanStates指令定义，用于贷款流程的状态切换
 * @example <jr-dropdown-button jr-loan-states selected="checkStatus" value="" dataid=""></jr-dropdown-button>
 * @author yuebin
 */

define([
'app',
'directive/jrPlaceholder',
'directive/jrCheckbox',
'model/orderStatesModel',
'model/orderRejectReasonModel'
], function (app) {
    app.registerDirective('jrLoanStates', [
    '$http',
    '$modal',
    'orderStatesModel',
    'orderRejectReasonModel',
    function ($http, $modal, orderStatesModel, orderRejectReasonModel) {
        // 订单状态
        var ORDER_STATES = [''].concat(orderStatesModel);

        var rejectTpl = __inline('tpl/jrLoanStatesReject.html');
        var confirmTpl = __inline('tpl/jrLoanStatesConfirm.html');

        return {
            restrict: 'E',
            replace: true,
            template: __inline('tpl/jrLoanStates.html'),
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

                    switch (option.value) {
                        case '4':
                            // 待签合同
                            modalTpl = confirmTpl;
                            title = '批核确认';
                            confirmModal($scope, modalTpl, option, title);
                            break;
                        case '5':
                            modalTpl = rejectTpl;
                            reasons = orderRejectReasonModel.get(option.value);
                            title = '贷款取消理由';
                            rejectModal($scope, modalTpl, option, title, reasons);
                            break;
                        case '6':
                            modalTpl = rejectTpl;
                            reasons = orderRejectReasonModel.get(option.value);
                            title = '退件理由';
                            rejectModal($scope, modalTpl, option, title, reasons);
                            break;
                        case '7':
                            modalTpl = rejectTpl;
                            reasons = orderRejectReasonModel.get(option.value);
                            title = '审批拒绝理由';
                            rejectModal($scope, modalTpl, option, title, reasons);
                            break;
                        case '8':
                            // 已放款
                            modalTpl = confirmTpl;
                            title = '放款确认';
                            confirmModal($scope, modalTpl, option, title);
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
                updateState($scope, option, {note: reasonStr});
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
            $http.post('/rs/admin/updateState', $.param($.extend({
                orderId: $scope.dataid,
                checkState: option.value
            }, additionParams))).success(function(data, status, headers, config) {
                // TODO 完成选项
                $scope.displayName = option.name;

                $scope.value = option.value;
                setOptions($scope);

                // TODO 如果提交了备注要赋值回去
                if (additionParams && additionParams.note) {
                    $scope.datainfo.note = additionParams.note;
                }
            });
        }

        /**
         * 设置待选项
         */
        function setOptions($scope) {
            // 获取当前状态
            $scope.options = [];
            //  1   待处理 -> 其他全部
            //  2   审批审核中 -> 4 5 7 8
            //  3   待客户提交资料 -> 2 4 5 7 8
            //  4   待签合同 -> 3 5 7 8
            //  5   贷款取消 -> 3 4 7
            //  6   退件
            //  7   审批拒绝
            //  8   已放款
            switch ($scope.value) {
                case '1':
                    $scope.options = $scope.options.concat(ORDER_STATES.slice(1));
                    break;
                case '2':
                    $scope.options = $scope.options.concat(ORDER_STATES.slice(4, 6), ORDER_STATES.slice(7));
                    break;
                case '3':
                    $scope.options = $scope.options.concat(ORDER_STATES.slice(2, 3), ORDER_STATES.slice(4, 6), ORDER_STATES.slice(7));
                    break;
                case '4':
                    $scope.options = $scope.options.concat(ORDER_STATES.slice(3, 4), ORDER_STATES.slice(5, 6), ORDER_STATES.slice(7));
                    break;
                case '5':
                    $scope.options = $scope.options.concat(ORDER_STATES.slice(3, 5), ORDER_STATES.slice(7, 8));
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