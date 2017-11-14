/**
 * loanTypeModel.js 贷款类型数据模型
 * @author yuebin
 */

define(['app'], function (app) {
    app.registerFactory('orderStatesModel', [function () {
        return [{
            name: '待征信验真',
            value: '20'
        }, {
            name: '征信验真拒绝', 
            value: '30'
        }, {
            name: '待人工验真', 
            value: '40'
        }, {
            name: '人工验真拒绝', 
            value: '50'
        }, {
            name: '待人工电话验真', 
            value: '60'
        }, {
            name: '人工电话验真拒绝', 
            value: '70'
        }, {
            name: '待人工终审确认', 
            value: '80'
        }, {
            name: '终审拒绝', 
            value: '90'
        }];
    }]);
});