/**
 * 租客管理 状态 数据模型
 * 
 * @author    Yang,junlong at 2015-11-03 17:18:36 build.
 * @version:  $Id: userStatusModel.js 12500 2016-01-21 10:04:18Z yangjunlong $
 */

define(['app'], function (app) {
    app.registerFactory('userStatusModel', [function () {
        return [
        	{name: '全部状态',value: ''},
            {name: '放款中',value: '1'},
            {name: '还款中',value: '2'},
            {name: '已还清',value: '3'},
            {name: '已逾期',value: '4'},
            {name: '已清退',value: '5'},
            {name: '已结清',value: '6'}
        ];
    }]);
});