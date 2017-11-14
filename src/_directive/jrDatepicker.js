/**
 * jrDatepicker 日历选择插件
 * @example <jr-datepicker title="开始" time="startTime" format="yyyy-MM-dd"></jr-datepicker>
 * @author yuebin
 */

define(['app'], function (app) {
    app.registerDirective('jrDatepicker', ['$filter', function($filter) {

        return {
            restrict: 'E',
            replace: true,
            template: __inline('tpl/jrDatepicker.html'),
            scope: {
                title: '@',
                placeholder: '@',
                format: '@',
                time: '='
            },
            link: function($scope, iElement, iAttrs) {
                // 定义默认datepicker格式
                $scope.datepickerFormat = $scope.format || 'yyyy-MM-dd';

                if (typeof $scope.time === 'string') {
                    // 兼容IE8的日期格式转换
                    $scope._time = $filter('date')(new Date($scope.time.replace(/-/g, '/')), $scope.datepickerFormat);
                } else {
                    $scope._time = $scope.time;
                }

                // 按钮点击打开选择panel
                $scope.datepicker = function($event) {
                    $scope.opened = true;
                    $event.stopPropagation();
                }
                // 日期格式化
                $scope.$watch('_time', function() {
                    $scope.time = $filter('date')($scope._time, $scope.datepickerFormat);
                });
            }
        };
    }]);
});