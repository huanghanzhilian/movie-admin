/**
 * ui-checkbox 复选框
 *
 * @package angularjs directive
 *
 * @usage
 * <ui-checkbox name="" checked="">选项信息</ui-checkbox>
 * 
 * @author  Yang,junlong at 2015-11-25 15:32:20 build.
 * @version $Id: uiCheckbox.js 12511 2016-01-21 11:23:26Z yangjunlong $
 */

define(['app'], function (app) {
    app.registerDirective('uiCheckbox', [function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<span class="ui-checkbox" ng-class="{checked: (checked == \'true\')}" ng-click="check($event)"><span></span><input type="checkbox" name="{{name}}" /><i class="icon"></i>{{text}}</span>',
            scope: {
                name: "@",
                text: "@",
                checked: "@",
                value: '@',
                index: '@',
                data: '=',
                fdata: '='
            },
            link: function($scope, iElement, iAttrs) {
                if(iAttrs.readonly){
                    return;
                }

                var $checkbox = iElement.find('input');

                if($scope.data){
                    var fdata = [];
                    $scope.data.map(function(item, index){
                        if(item.isSelect){
                            fdata.push(item.value); 
                        }
                    });

                    $scope.fdata = fdata.join(',');
                }
                
                
                $scope.check = function($event) {
                    $event.preventDefault();
                    
                    $scope.checked = ($scope.checked == 'true') ? false : true;
                    $scope.data[$scope.index].isSelect = $scope.checked;
                    $checkbox.prop('checked', $scope.checked);

                    var fdata = [];
                     $scope.data.map(function(item, index){
                        if(item.isSelect){
                           fdata.push(item.value); 
                        }
                     });

                    $scope.fdata = fdata.join(',')
                }
            }
        };
    }]);
});