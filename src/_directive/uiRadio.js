/**
 * ui-radio 复选框
 *
 * @package angularjs directive
 *
 * @usage
 * <ui-radio name="" checked="">选项信息</ui-radio>
 * 
 * @author  Yang,junlong at 2015-11-25 17:56:27 build.
 * @version $Id: uiRadio.js 12511 2016-01-21 11:23:26Z yangjunlong $
 */

define(['app'], function (app) {
    app.registerDirective('uiRadio', [function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<span class="ui-radio" ng-class="{checked: checked}" ng-click="check($event)"><input type="radio" ng-checked="{{checked}}" name="{{name}}" /><i class="icon"></i>{{text}}</span>',
            scope: {
                name: "@",
                text: "@",
                checked: "@"
            },
            link: function($scope, iElement, iAttrs) {
                var $radio = iElement.find('input');

                $scope.check = function($event) {
                	var checked = !$radio[0].checked;
                    $scope.checked = checked;
                    $radio.prop('checked', checked);
                }
            }
        };
    }]);
});