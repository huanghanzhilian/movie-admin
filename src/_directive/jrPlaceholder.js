/**
 * jrPlaceholder指令定义，用于兼容ie8+ 的placeholder支持
 * @example <input type="text" jr-placeholder="请输入..."/>
 * @example <textarea jr-placeholder="请输入..."></textarea>
 * @author yuebin
 */

define(['app'], function (app) {
    app.registerDirective('jrPlaceholder', [function () {
    
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function($scope, element, attrs, ctrl) {
                if (!('placeholder' in document.createElement('input'))) {
                    var value;
      
                    var placehold = function () {
                        element.val(attrs.jrPlaceholder);
                        element.addClass('placeholder-ie');
                    };
                    var unplacehold = function () {
                        element.val('');
                        element.removeClass('placeholder-ie');
                    };
                    
                    $scope.$watch(attrs.ngModel, function (val) {
                      value = val || '';
                    });

                    element.on('focus', function () {
                        if(value === '') {
                            unplacehold();
                        }
                    });
                    
                    element.on('blur', function () {
                        if (element.val() === '') {
                            placehold();
                        }
                    });
                    
                    ctrl.$formatters.unshift(function (val) {
                        if (!val) {
                            placehold();
                            value = '';
                            return attrs.jrPlaceholder;
                        }
                        return val;
                    });
                } else {
                    element.attr('placeholder', attrs.jrPlaceholder);
                }
            }
        };
    }]);
});