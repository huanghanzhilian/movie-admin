/**
 * CtrlPartnerQtdk.js 清退代扣控制器
 * @url /partnerqtdk
 * @author zhangmiao
 */

define([
    'app',
    'echarts',
    'directive/jrDatepicker',
    'directive/jrDropdownButton'
], function ( app,echarts,theme) {
    $(window).on("keydown",function(e){
        if(e.keyCode==27){
            $("#apigt").toggleClass("allview")
        }
    })
    app.registerController('RelationalAnomaly', ['$scope', '$http', '$modal', '$state', '$stateParams', '$filter','FileUploader',
        function ($scope, $http, $modal, $state, $stateParams, $filter,FileUploader) {

            $scope.queryParams = $.extend({
                pageNum: 1,
                graphLevel:"1",
                filtername:""
            }, $stateParams);
            $scope.queryOptions = {
                graphLevel: [
                    {value: '1', name: '1重关系'},
                    {value: '2', name: '2重关系'},
                    {value: '3', name: '3重关系'}
                ]
            }
            var curDate;
            $scope.quanpin=function(){
                $(".table-con").toggleClass("allview")
            }

            $scope.$watch("queryParams.graphLevel",function(newValue,oldValue){
                if (newValue === oldValue) {
                    return false;
                }
                if($scope.allData){
                    setOption($scope.allData["graphLevel"+newValue])
                }

            })
            $scope.search = function(event) {
                $scope.queryParams.pageNum = 1;
                $state.go('apigraph.list', $scope.queryParams,{reload:true});
            };

            var option = {
                legend: {
                    data: [],
                    x:"left"
                },

                tooltip: {
                    formatter:function(params){
                        if(params.dataType=="node"){
                            return params.data.detail
                        }else if(params.dataType=="edge"){
                            return params.data.detail
                        }
                    }
                },

                series: [{
                    edgeSymbol: ['', 'arrow'],
                    edgeSymbolSize:8,
                    type: 'graph',
                    layout: 'force',
                    animation: false,
                    label: {
                        normal: {
                            show:true,
                            position: 'inside',
                            formatter: '{b}',
                            textStyle:{
                                color:"#333"
                            }
                        }
                    },
                    draggable: true,
                    roam: true,
                    data: [],
                    categories: [],
                    force: {
                        layoutAnimation:false,
                        gravity: 0.2,
                        // repulsion: 20,
                        edgeLength: 200,
                        repulsion: 2000
                    },
                    lineStyle: {
                        normal: {
                            color: 'source'
//                            curveness: 0.2
                        }
                    },
                    edgeLabel:{
                        normal:{
                            show:true
                        }
                    },
                    links: []
                }]
            };

            var myCityChart = echarts.init(document.getElementById('successView'));

            function getCityData(params,callback) {
                $http.get('/manage/highRisk-order/json/get/warnRelationGraph', {
                    params: $.extend({}, params, {optDesc: '风险订单图谱'})
                }).success(function(data2, status, headers, config) {
                    $scope.allData=data2.object;
                    setOption($scope.allData["graphLevel"+$scope.queryParams.graphLevel]);
                    callback&&callback()
                });
            }

            getCityData($scope.queryParams);
            //变化
            function setOption(data2){
                curDate=data2
                var data= $.extend({},data2)
                if($scope.queryParams.filtername){
                    var arr=$scope.queryParams.filtername.split("、");

                    data.pointList=getNodes(arr,curDate);
                }
                var sizeTypes=[40,45,50,55,60];//大小
                var colorTypes=["#b6a2de","#5ab1ef","#ffb980","#d87a80","#749f83","#bda29a","#2f4554"];//颜色
                option.color=["#ca8622"];//第一个颜色不取

                option.legend.data=[];
                //设置系统颜色
                data.pointList.forEach(function(node){
                    var rol=node.colorDetail;
                    //获取分类
                    if(option.legend.data.indexOf(rol)==-1){
                        option.legend.data.push(rol);
                    }
                    //获取颜色
                    var col=colorTypes[node.colorType];

                    if(option.color.indexOf(col)==-1){
                        option.color.push(col);
                    }
                });
                option.series[0].categories=option.legend.data.map(function(name){
                    return {
                        name:name
                    }
                })

                option.series[0].data=data.pointList.map(function(node){

                    node.category=option.legend.data.indexOf(node.colorDetail);
                    node.symbolSize =sizeTypes[node.sizeType];
                    node.itemStyle ={
                        normal:{
                            borderType:"solid",
                            borderColor:colorTypes[node.colorType],
                            color:"#fff",
//                            shadowColor:"#000",
//                            shadowOffsetX:5,
                            borderWidth:5
                        },
                        emphasis:{
                            borderWidth:5
                        }
                    }
                    return node;
                });
                option.series[0].links=data.edgeList.map(function(node){
                    node.source=""+node.source;
                    node.target=""+node.target;
                    node.label={
                        normal:{
                            formatter:function(pattams){
                                return pattams.data.detail
                            }
                        }
                    }
                    node.lineStyle={
                        normal:{
                            color:"#666"
                        }
                    }
                    return node;
                });

                myCityChart.setOption(option,true);
            }
            //点击事件
            myCityChart.on("dblclick",function(param) {
                var data = param.data;
                if(data.orderid) {
                    var href = $state.href('order.check', {orderId: data.orderid, flag: 1});
                    window.open(href);
                }
            });
            $(".form-body").css({
                width:"100%"
            })
            //获取关系节点
            function getNodes(nameArr,curDate){
                var idArr=[];
                curDate.pointList.forEach(function(item){
                    var p=nameArr.indexOf(item.name)
                    if(p>-1){
                        idArr[p]=item.id;
                    }
                })
                if(idArr.length==0){
                    return []
                }
                var list=[]
                curDate.edgeList.forEach(function(item){
                    if(idArr.indexOf(item.source)>-1){
                        if(list.indexOf(item.target)==-1){
                            list.push(item.target)
                        }
                    }
                    if(idArr.indexOf(item.target)>-1){
                        if(list.indexOf(item.source)==-1) {
                            list.push(item.source)
                        }
                    }
                })
                console.log(list)
                list=list.concat(idArr)
                var itemArr=[]
                curDate.pointList.forEach(function(item){
                    if(list.indexOf(item.id)>-1){
                        itemArr.push(item)
                    }
                })
                return itemArr;
            }
            var ctrlDown=false;
            $(window).keydown(function(e){
                if(e.keyCode==17){
                    ctrlDown=true;
                }
            })
            $(window).keyup(function(e){
                if(e.keyCode==17){
                    ctrlDown=false;
                }
            })
            myCityChart.on("click",function(param) {
                if(param.dataType=="node"){
                    var data=param.data;
                    if($scope.queryParams.filtername.indexOf(data.name)==-1){
                        $scope.queryParams.filtername=($scope.queryParams.filtername+"、"+data.name).replace("、、","、").replace(/^、/,"")
                    }

                    if(ctrlDown){
                        $scope.queryParams.filtername=data.name;
                        setOption(curDate);
                    }
                    $("#filtername").val($scope.queryParams.filtername)
                }
            });
        }]);
});
