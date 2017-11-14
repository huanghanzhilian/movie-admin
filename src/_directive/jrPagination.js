/**
 * Created by ZhangMiao on 2016/11/11.
 */
define(['app'],function(app) {
    app.registerDirective('jrPagination', function() {
        return {
            restrict: 'A',
            replace: true,
            template: __inline('tpl/jrPagination.html'),
            scope: {
                totalItems: '=',
                page: '=',
                itemsPerPage: '='
            },
            link: function($scope, iElement, iAttrs) {

                $scope.itemsPerPageArr = [10,20,50];
                //$scope.itemNum = $scope.itemsPerPageArr[0];
                $scope.status = {
                    isopen: false
                };

                $scope.changeItemNum = function(num) {
                    $scope.itemsPerPage = num;
                }
            }
        }
    })
})