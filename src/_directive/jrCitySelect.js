/**
 * Created by ZhangMiao on 2017/2/17.
 *
 * <jr-city-select province="enterpriseData.province"
 city="enterpriseData.city"
 district="enterpriseData.district"
 colspan="3"></jr-city-select>
 */
define([
    'app',
    'dict.cities',
    'directive/jrDropdownButtonNew'
], function (app, citiesModule) {
    app.registerDirective('jrCitySelect', function () {
        return {
            restrict: 'EA',
            replace: true,
            template: __inline('tpl/jrCitySelect.html'),
            scope: {
                province: '=',
                city: '=',
                district: '=',
                colspan: '@',
                disabled: '='
            },
            link: function ($scope, element, attrs) {

                /**
                 * 初始化省下拉框
                 */
                $scope.queryOptions = {
                    provinces: citiesModule.get_provinces_from_dict()
                };

                var echoFlag = false; //不需要回显
                if($scope.province || $scope.city || $scope.district) {
                    echoFlag = true;  //需要回显
                }

                /**
                 * 监听省的改变，更新市下拉框
                 */
                $scope.$watch('province', function (newProvince) {

                    $scope.queryOptions.cities = citiesModule.get_cities_by_code_from_dict($scope.province);
                    if(echoFlag) {
                        return;
                    }
                    $scope.city = '';
                })
                /**
                 * 监听市的改变，更新区下拉框
                 */
                $scope.$watch('city', function (newCity) {
                    $scope.queryOptions.districts = citiesModule.get_districts_by_code_from_dict($scope.city);
                    if(echoFlag) {
                        echoFlag = false;
                        return;
                    }
                    if($scope.district){
                        $scope.district = '';
                    }

                })

            }
        }
    })
})
