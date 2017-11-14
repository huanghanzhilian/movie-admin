/**
 * ui-textarea 文本区输入框
 *
 * @package angularjs directive
 * @subpackage ui-kit
 *
 * @usage 
 * <ui-textarea max-wd-num="200"></ui-textarea>
 * 
 * @author  Yang,junlong at 2015-11-27 11:50:07 build.
 * @version $Id: uiTextarea.js 12511 2016-01-21 11:23:26Z yangjunlong $
 */

define(['app'], function (app) {
    app.registerDirective('uiTextarea', [function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<span class="ui-textarea"><textarea placeholder="{{placeholder}}" ng-model="value"></textarea><span ng-if="maxlength" class="max-length">{{curlength||0}}/{{maxlength}}</span></span>',
            scope: {
                name: "@",
                placeholder: "@",
                maxlength: '@',
                value: '='
            },
            link: function($scope, iElement, iAttrs) {
                var $input = iElement.find('textarea');
                if(iAttrs.readonly){
                    $input.attr('readonly', iAttrs.readonly);
                    return;
                }

                if(!$scope.maxlength){
                    return;
                }

                

                var fixLength = function(ele){
                    var value = $(ele).val();
                    var len = value.length;
                    if(len > $scope.maxlength){
                        $(ele).val(value.substr(0, $scope.maxlength));

                        len = $scope.maxlength;

                        //return;
                    }
                    $scope.$apply(function() {
                        $scope.curlength = len;
                    });
                };

                setTimeout(function(){
                    fixLength($input);
                },250);


                $input.on('focus', function(){

                }).on('blur', function(){

                    fixLength(this);
                }).on('keyup', function(){
                	fixLength(this);
                });

                //
                // setTimeout(function(){
                //     $input.focus();
                //     $input.blur();
                // },250);
            }
        };
    }]);
});
