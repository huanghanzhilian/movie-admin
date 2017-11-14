/**
 * ui-datepicker 日期拾取器
 *
 * @usage
 * <ui-datepicker name="" checked="">选项信息</ui-datepicker>
 * 
 * @author  Yang,junlong at 2015-12-02 18:33:40 build.
 * @version $Id: uiDatepicker.js 18876 2016-10-08 12:15:29Z zhangmiao03 $
 */

define(['app'], function (app) {
    app.registerDirective('uiDatepicker', ['$filter', function($filter) {

        return {
            restrict: 'E',
            replace: true,
            template: __inline('tpl/uiDatepicker.html'),
            scope: {
                prefix: '@',
                format: '@',
                time: '=',
                options: '=',
                showButton: '@'
            },
            link: function($scope, iElement, iAttrs) {
                var $input = iElement.find('input');
                if(iAttrs.readonly){
                    $input.attr('readonly', iAttrs.readonly);
                    $input.attr('disabled', true);
                    return;
                }

                $scope.datepickerFormat = $scope.format || 'yyyy-MM-dd';

                if (typeof $scope.time === 'string') {
                    // 兼容IE8的日期格式转换
                    $scope._time = new Date($scope.time.replace(/-/g, '/'));
                } else {
                    $scope._time = $scope.time;
                }

                $scope.opened = false;
                // 按钮点击打开选择panel（只有点击input和i以及两者的父元素datepicker时才会显示或隐藏日历，这样在选择日期之后日历才会自动隐藏）
                $scope.datepicker = function($event) {
                    if($($event.target).hasClass('datepicker') || $($event.target).parent().hasClass('datepicker')) {
                        $scope.opened = !$scope.opened;
                        $event.stopPropagation();
                    }

                }

                // 日期格式化
                $scope.$watch('_time', function() {
                    $scope.time = $filter('date')($scope._time, $scope.datepickerFormat);
                });
            }
        };
    }]);
});
