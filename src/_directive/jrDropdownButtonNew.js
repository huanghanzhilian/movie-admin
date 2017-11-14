/**
 * Created by ZhangMiao on 2017/2/17.
 */

define(['app'], function (app) {
    app.registerDirective('jrDropdownButtonNew', [function () {

        return {
            restrict: 'E',
            replace: true,
            template: __inline('tpl/jrDropdownButtonNew.html'),
            scope: {
                theme: '@',
                options: '=',
                selected: '=',
                value: '=',
                disabled: '=',
                placeholdertext: '@'
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
                $scope.selcet = function(option) {
                    var _displayName = option.name || option;
                    // 人工重复点击检查
                    if (_displayName === $scope.displayName) {
                        return false;
                    }

                    setSelected($scope, iAttrs, option);
                };
            }
        };

        /**
         * 设置显示值
         * @param {object} $scope 实例独立scope
         */
        function setDisplayName($scope) {
            if ($scope.selected) {
                $scope.displayName = $scope.selected.name || $scope.selected;
            } else if ($scope.options){
                if ($scope.value){
                    for (var i = 0; i < $scope.options.length; i++) {
                        if ($scope.options[i].value === $scope.value) {
                            $scope.displayName = $scope.options[i].name;
                        }
                    }
                }
                else {
                    $scope.displayName = '';
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
