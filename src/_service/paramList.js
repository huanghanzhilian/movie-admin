/**
 * loanTypeModel.js 贷款类型数据模型
 * @author yuebin
 */

define(['app'], function (app) {
    app.registerFactory('paramList', ['$http', function ($http) {

        return {
            get: function(paramstr) {
                return $http({
                    method: 'get',
                    url: '/rs/paramlist',
                    params: {
                        params: paramstr
                    }
                });
            }
        };
    }]);
});