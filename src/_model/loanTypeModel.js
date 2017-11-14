/**
 * loanTypeModel.js 贷款类型数据模型
 * @author yuebin
 */

define(['app'], function (app) {
    app.registerFactory('loanTypeModel', [function () {
        return [{
            name: '消费贷',
            value: 'xiaofeidai'
        }, {
            name: '企业贷', 
            value: 'qiyedai'
        }, {
            name: '购车贷', 
            value: 'chedai'
        }, {
            name: '购房贷', 
            value: 'fangdai'
        }];
    }]);
});