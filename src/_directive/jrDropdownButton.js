/**
 * jrDropdownButton 下拉选择类型的button
 * @example <jr-dropdown-button options="['北京','深圳']"  selected="city" value="value"></jr-dropdown-button>
 * @author yuebin
 */

define(['app'], function (app) {
    app.registerDirective('jrDropdownButton', [function () {

        return {
            restrict: 'E',
            replace: true,
            template: __inline('tpl/jrDropdownButton.html'),
            scope: {
                theme: '@',
                options: '=',
                selected: '=',
                value: '=',
                disabled: '='
            },
            link: function($scope, iElement, iAttrs) {
                 // 监听options变量，为那些ajax加载的下拉菜单做补救
                 $scope.$watch('options', function() {
                    // 如果供显示的选中项依然为空,则遍历查找选中项
                    setDisplayName($scope);
                 });

                // // 初始化显示值
                setDisplayName($scope);

                /**
                 * 下拉菜单选择事件
                 * @param  {object} option 选项原型，为options数组的一个元素
                 */
                $scope.select = function(option) {
                    var _displayName = option.name || option;
                    // 人工重复点击检查
                    if (_displayName === $scope.displayName) {
                        return false;
                    }
                    
                    setSelected($scope, iAttrs, option);
                };


                //监听外部方式改变下拉框的值（例如清空查询项操作）
                $scope.$watch('value', function(newValue) {
                    if(newValue === undefined) {
                        newValue = '';
                    }
                    if($scope.options) {
                        for (var i = 0; i < $scope.options.length; i++) {
                            if ($scope.options[i].value === newValue) {
                                $scope.displayName = $scope.options[i].name;
                            }
                        }
                    }

                });
            }
        };

        /**
         * 设置显示值
         * @param {object} $scope 实例独立scope
         */
        function setDisplayName($scope) {
            if ($scope.selected) {
                $scope.displayName = $scope.selected.name || $scope.selected;
            } else if ($scope.options&&$scope.options[0]){
                if ($scope.value){
                    var has=false;
                    for (var i = 0; i < $scope.options.length; i++) {
                        if ($scope.options[i].value === $scope.value) {
                            $scope.displayName = $scope.options[i].name;
                            has=true;
                        }
                    }
                    if(!has){
                        $scope.displayName = $scope.options[0].name || $scope.options[0];
                        if(typeof $scope.options[0].value === 'undefined') {
                            $scope.value = $scope.options[0];
                        } else {
                            $scope.value = $scope.options[0].value;
                        }
                    }

                } else {
                    $scope.displayName = $scope.options[0].name || $scope.options[0];

                    if(typeof $scope.options[0].value === 'undefined') {
                        $scope.value = $scope.options[0];
                    } else {
                        $scope.value = $scope.options[0].value;
                    }
                }
            }
        }

        /**
         * 当下拉选择时候调用
         * @param {object} $scope 实例独立scope
         * @param {object} iAttrs 实例属性
         * @param {object} option 选项option
         */
        function setSelected($scope, iAttrs, option) {
            // 设置显示值
            $scope.displayName = option.name || option;

            // 设置选项的原始值
            if (iAttrs.selected) {
                $scope.selected = option;
            }

            // 设置选项的常用value值
            if (iAttrs.value) {
                $scope.value = option.value || undefined;
            }
        }
    }]);
});