/**
 * routeDefs.js 路由定义
 * @description 该app为SPA，single page application
 * 路由完全有前端控制，此处配置**路由**
 */
define(['app'], function(app) {
    /**
     * register `routeDefs`
     *
     */
    app.registerProvider('routeDefs', [
        '$stateProvider',
        '$urlRouterProvider',
        '$couchPotatoProvider',
        function($stateProvider, $urlRouterProvider, $couchPotatoProvider) {
            this.$get = function() {
                // this is a config-time-only provider
                // in a future sample it will expose runtime information to the app
                return {};
            };
            // $locationProvider.html5Mode(true);

            $urlRouterProvider.otherwise('welcome');

            // a uniform empty tpl for inherit
            var emptyTplInherit = '/static-huang/empty-tpl-inherit.html';

            $stateProvider.state('welcome', {
                url: '/welcome',
                templateUrl: function(stateParams){
                    return '/static-huang/welcome/welcome.html';
                }
            })

                 //合作伙伴详情
                .state('company', {
                    url: '/company',
                    abstract: true,
                    templateUrl: emptyTplInherit
                }).state('company.list', {
                    url: '?companyKey&cityKey&pageNum',
                    templateUrl: '/static-huang/company/company.html',
                    controller: 'CtrlCompany',
                    resolve: {
                        ctrl: $couchPotatoProvider.resolveDependencies(['/static-huang/company/company.js'])
                    }
                })
                .state('company.add', {
                    url: '/add',
                    templateUrl: '/static-huang/company-detail/company-detail.html',
                    controller: 'CtrlCompanyDetail',
                    resolve: {
                        ctrl: $couchPotatoProvider.resolveDependencies(['/static-huang/company-detail/company-detail.js'])
                    }
                })
                .state('company.detail', {
                    url: '/{companyId:[0-9]+}?type',
                    templateUrl: '/static-huang/company-detail/company-detail.html',
                    controller: 'CtrlCompanyDetail',
                    resolve: {
                        ctrl: $couchPotatoProvider.resolveDependencies(['/static-huang/company-detail/company-detail.js'])
                    }
                })
                .state('OutlierDetection', {
                    url: '/OutlierDetection?pageNum',
                    templateUrl: '/static-huang/OutlierDetection/OutlierDetection.html',
                    controller: 'CtrlOutlierDetection',
                    resolve: {
                        ctrl: $couchPotatoProvider.resolveDependencies(['/static-huang/OutlierDetection/OutlierDetection.js'])
                    }
                })
                .state('Riskmigration', {
                    url: '/Riskmigration?pageNum',
                    templateUrl: '/static-huang/Riskmigration/Riskmigration.html',
                    controller: 'CtrlRiskmigration',
                    resolve: {
                        ctrl: $couchPotatoProvider.resolveDependencies(['/static-huang/Riskmigration/Riskmigration.js'])
                    }
                })
                .state('RelationalAnomaly', {
                    url: '/RelationalAnomaly?id&filtername&graphLevel',
                    templateUrl: '/static-huang/RelationalAnomaly/RelationalAnomaly.html',
                    controller: 'RelationalAnomaly',
                    resolve: {
                        ctrl: $couchPotatoProvider.resolveDependencies(['/static-huang/RelationalAnomaly/RelationalAnomaly.js'])
                    }
                })

        }
    ]);
    //end for define
});