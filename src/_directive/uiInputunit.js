/**
 * 带单位的输入框
 * 
 * @package angularjs directive
 * @subpackage ui-kit
 *
 * @usage
 * <ui-inputunit prefix="" suffix="" value="value"></ui-inputunit>
 * 
 * @author  Yang,junlong at 2015-11-27 11:17:02 build.
 * @version $Id: uiInputunit.js 12511 2016-01-21 11:23:26Z yangjunlong $
 */

define(['app'], function (app) {
    app.registerDirective('uiInputunit', [function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<span class="ui-inputunit" ng-class="{{focusclass}}"><span ng-if="prefix">{{prefix}}</span><input type="text" style="width:{{innerwidth}};" ng-model="value"/><span ng-if="suffix">{{suffix}}</span></span>',
            scope: {
                name: "@",
                prefix: "@",
                suffix: "@",
                innerwidth:'@',
                value: '='
            },
            link: function($scope, iElement, iAttrs) {
                var $input = iElement.find('input');
                if(iAttrs.readonly){
                    $input.attr('readonly', iAttrs.readonly);
                    return;
                }

                $input.on('focus',function(){
                	iElement.addClass('ui-hover ui-inputunit-hover');
                }).on('blur', function(){
                	iElement.removeClass('ui-hover ui-inputunit-hover');
                });
            }
        };
    }]);
});