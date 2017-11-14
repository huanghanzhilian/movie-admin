/**
 * jrCheckbox 复选框
 * @example <jr-checkbox name="" checked="">选项信息</jr-checkbox>
 * @author yuebin
 */

define(['app'], function (app) {
    app.registerDirective('jrCheckbox', [function() {

        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<span class="jr-checkbox" ng-class="{checked: checked}" ng-click="check($event)"><input type="checkbox" name="{{name}}" /><i class="icon"></i>{{text}}</span>',
            scope: {
                name: "@",
                text: "@",
                checked: "="
            },
            link: function($scope, iElement, iAttrs) {
                var $checkbox = iElement.find('input');

                $scope.check = function($event) {
                    $scope.checked = !$scope.checked;
                    $checkbox.prop('checked', $scope.checked);
                }
            }
        };
    }]);
});