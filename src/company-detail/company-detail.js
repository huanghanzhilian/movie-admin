/**
 * Created by ZhangMiao on 2016/8/10.
 */
define([
    'app',
    'dict.cities',
    'directive/jrDatepicker',
    'directive/jrDropdownButton',
    'directive/jrCitySelect',
    'directive/jrPlaceholder',
    'directive/jrPagination'
], function(app,citiesModule){
    app.registerController('CtrlCompanyDetail', ['$scope', '$http', '$state', '$stateParams', '$modal',
        function($scope, $http, $state, $stateParams, $modal) {
            //初始查询参数
            $scope.queryParams = $.extend({
                type:"show",
                companyId:""
            }, $stateParams);
            if(!$scope.queryParams.companyId){
                $scope.queryParams.type="add";
            }
            $scope.queryOptions = {
                bankName:[
                ],
                isPublic: [
                    {value: '1', name: '对公'},
                    {value: '0', name: '对私'}
                ],
                canYuefu: [
                    {value: '1', name: '是'},
                    {value: '0', name: '否'}
                ],
                qingtuiReturnServiceMoney: [
                    {value: '1', name: '是'},
                    {value: '0', name: '否'}
                ],
                companyProvinceCode:citiesModule.get_provinces_from_dict(),
                companyCityCode:citiesModule.get_cities_by_code_from_dict("110000"),
                provinceCode:citiesModule.get_provinces_from_dict(),
                cityCode:citiesModule.get_cities_by_code_from_dict("110000")
            };

            //默认值
            $scope.orders={
                company:{
                    id:-1
                    // serviceRate:"0.03"
                },
                companyMore:{
                    id:-1,
                    maxLoanMonth:"12",//最大租住月数
                    minLoanMonth :"3",//最小租住月数
                    maxAgentNum:"50",//最大房管员数
                    faceMatchPassRate:"0.6",//活体识别成功匹配度
                    faceMatchRefuseRate:"0.6",//活体识别失败匹配度
                    withdrawFeeRate:"0.4",//提现手续费率
                    minFeeMoney:"300",//最小提现手续费金额 (分)
                    loanMonthRate:"4",//月付费率%
                    profitRate:"50",//月收单模式分润美月付占比%
                    yuefuMaxRate:"10",//月付最大比例%
                    yuefuMaxMoney:"600000",//月付最大借款总额(分)
                    canYuefu:"1",//是否可月付
                    qingtuiReturnServiceMoney:"1",//清退公寓是否返回服务费 1是 0否
                    maxYuefuMonth:"3",//支持分期月数
                    overdueRate:"0",//租客逾期罚息(%)
                    companyProvinceCode:"110000",
                    province:"北京市",
                    companyCityCode:"110100",
                    city:"北京市"
                },
                companyRelation:{
                    maxMonthRent:"3000",
                    sys_rentStartDateSection:"10-33"
                },
                bankcard:{
                    id:-1,
                    provinceCode:"110000",
                    provinceName:"北京市",
                    cityCode:"110100",
                    cityName:"北京市",
                    isPublic:"0"
                }
            }
            //获取详情数据
            function getData(params) {
                $scope.loading=false
                $http.get('/stat/company/json/get/getCompanyInfo', {
                    params: $.extend({}, params, {optDesc: '合作伙伴详情'})
                }).success(function(data, status, headers, config) {
                    $scope.orders = data.object;

                    $scope.loading=true
                });
            }

            if($scope.queryParams.type!="add"){
                getData($scope.queryParams);
            }
            //选择银行联动 自动完成
            $scope.changeself=function(e){
                var newValue = $scope.orders.bankcard.bankName

                $http.get('/stat/company/json/get/getBankName', {
                    params: {
                        keyword: newValue
                    }
                }).success(function(data, status, headers, config) {
                    $scope.queryOptions.bankName=data.object;

                });
            }


            $scope.blurself=function(){
                setTimeout(function(){
                    $scope.queryOptions.bankName=[]
                },200)
            }
            $scope.selectbankName=function(text){
                $scope.orders.bankcard.bankName=text
                $scope.queryOptions.bankName = [];
            }
            $scope.save=function($event){
                //3秒内不能点击
                if ($($event.target).data('disabled')) {
                    return false;
                }
                $($event.target).data('disabled', true);
                setTimeout(function(){
                    $($event.target).data('disabled', false);
                },3000)
                var data={}
                for(var k in $scope.orders){
                    data[k]=JSON.stringify($scope.orders[k])
                }
                var params = $.extend(data,{optDesc: '保存合作伙伴信息'});
                $http.post('/stat/company/json/operate/saveAgentCompany', $.param(params)).success(function(data, status, headers, config) {

                    if(data.success) {
                        $.modalAlert(data.message,function(){
                            window.close();
                            //提交后刷新主页面
                            window.opener.location.reload();
                        })


                    }
                })
            }
            if($scope.queryParams.type!="show"){


                //公司扩展省份变了，城市列表变化
                $scope.$watch('orders.companyMore.companyProvinceCode', function(val,nval) {
                    if(val==nval){return;}
                    $scope.queryOptions.companyCityCode = citiesModule.get_cities_by_code_from_dict(val);

                    $scope.orders.companyMore.province=$("#companyProvinceCode .displayName").text()
                });
                $scope.$watch('orders.companyMore.companyCityCode', function(val,nval) {
                    if(val==nval){return;}
                    $scope.orders.companyMore.city=$("#companyCityCode .displayName").text()
                });
                //银行卡省份变了，城市列表变化
                $scope.$watch('orders.bankcard.provinceCode', function(val,nval) {
                    if(val==nval){return;}
                    $scope.queryOptions.cityCode = citiesModule.get_cities_by_code_from_dict(val);
                    $scope.orders.bankcard.provinceName=$("#provinceCode .displayName").text()
                });
                $scope.$watch('orders.bankcard.cityCode', function(val,nval) {
                    if(val==nval){return;}
                    console.log($("#cityCode .displayName").text())
                    $scope.orders.bankcard.cityName=$("#provinceCode .displayName").text()
                });

            }
        }])
})
