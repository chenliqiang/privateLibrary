/**
 * Created by jack on 2015/9/23.
 */

var Vue = require("component_modules/vue");
var Router = require("component_modules/director").Router;
var loading = require("components/page/loading/loading");
var Fastclick = require("component_modules/fastclick");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;


var router = new Router();

window.app = new Vue({
    el:"#app",
    data:{
        debug:true,
        currentView:"loading",
        appid:"wx966a34347854b946",/*度量水计量云平台(专业测试)*/
        auth:{
            openid:"",
            unionid:"",
            suid:"",
            app:"yhsl"
        },
        suid:{
            sxzls:"54ffe26cfca5651840b8f93c",//绍兴自来水
            sxps:"556553560bb9ab75972a57e3"//绍兴排水
        },
        suidlist:[
            "54ffe26cfca5651840b8f93c",
            "556553560bb9ab75972a57e3"
        ],
        verify:{},
        info:{
            suid:"",
            name:"",
            type:""
        },
        news:{
            id:"",
            title:"",
            date:"",
            name:""
        },
        smeter:{//居民用户水量查询
            type:"",
            sn:""
        },
        qu_water:{//非居民
            sn:"",
            pwd:""
        },
        progress:{//报装进度
            id:""
        },
        interact:{
            suid:"",
            maintain:{
                "sn":""
            }
        },
        dot:{
            suid:""
        },
        water:{
            cod:{},
            blowdown:{},
            pay:{}
        },
        config:[],
        title:"绍兴水务"
    },
    methods:{
        init: function () {
            var self = this;
            if(self.debug){
                self.auth.openid = "orNrajqa90FxQpk-bzfIoCaDnCWE";
                self.auth.unionid = "olNcSt9NNT0GOJ7oFAEh8R-SkbTc";

                if(!localStorage[self.appid +"isBind"]){
                    Service.bindUser({
                        unionid: self.auth.unionid,
                        openid: self.auth.openid,
                        suid: self.suidlist,
                        app: "yhsl"
                    },function(rep){
                        localStorage[self.appid +"isBind"] = true;
                    })
                }

            }else{
                self.getAuth();
            }
        },
        getAuth: function () {

            var self = this,
                code = Service.GetQueryString("code","hash"),
                state = Service.GetQueryString("state","hash"),
                unionid = Service.GetQueryString("unionid","hash"),
                openid  = Service.GetQueryString("openid","hash"),
                suid  = Service.GetQueryString("suid","hash");

            if(code){
                Layer.open({
                    content: "加载中",
                    type: 2,
                    shadeClose: false,
                    shade: false
                });
                //（只）获取当前公众号用户信息
                Service.getUserInfo({code:code,appid:self.appid}, function (rep) {
                    Layer.closeAll();
                    if(rep.code && rep.code == 1){
                        self.auth = JSON.parse(localStorage[self.appid]);
                    }else{
                        self.auth.unionid = rep.unionid;
                        self.auth.openid = rep.openid;

                        localStorage[self.appid] = JSON.stringify(self.auth);

                        Service.bindUser({
                            unionid: self.auth.unionid,
                            openid: self.auth.openid,
                            suid: self.suidlist,
                            app: "yhsl"
                        },function(rep){ })
                    }
                });
            }else if(unionid){
                self.auth.unionid = unionid;
                self.auth.openid = openid;
            }else{
                self.auth = JSON.parse(localStorage[self.appid]);
            }
        }
    },
    components:{
        "loading":loading
    },
    ready:function(){
        document.title = this.title;
        Fastclick.FastClick.attach(document.body);
        this.init();
    }
});


function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.hash.split("?")[1].match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
};

function doRouter(target,page){
    var coms = window.app.$options.components;
    if(!coms[target]){
        coms[target] = page;
    }
    window.app.$data.currentView = target;
}

router.on("/loading", function () {
    require.async(["components/page/loading/loading"], function (p) {
        doRouter("loading",p);
    })
});

router.on("/home", function () {
    require.async(["components/page/home/home"], function (p) {
        doRouter("home",p);
    })
});

router.on("/dot", function () {
    require.async(["components/page/dot/dot"], function (p) {
        doRouter("dot",p);
    })
});

router.on("/dot/all/:suid", function (suid) {
    require.async(["components/page/dot/all/all"], function (p) {
        window.app.$data.dot.suid = suid;
        doRouter("dot-all",p);
    })
});

router.on("/business", function () {
    require.async(["components/page/business/business"], function (p) {
        doRouter("business",p);
    })
});

router.on("/business/bind", function () {
    require.async(["components/page/business/bind/bind"], function (p) {
        doRouter("bind",p);
    })
});

router.on("/business/bind/add", function () {
    require.async(["components/page/business/bind/add/add"], function (p) {
        doRouter("bind-add",p);
    })
});

router.on("/business/bind/add/verify", function () {
    require.async(["components/page/business/bind/add/verify/verify"], function (p) {
        doRouter("bind-add-verify",p);
    })
});

router.on("/business/handle", function () {
    require.async(["components/page/business/handle/handle"], function (p) {
        doRouter("handle",p);
    })
});

router.on("/business/handle/new", function () {
    require.async(["components/page/business/handle/new/new"], function (p) {
        doRouter("handle-new",p);
    })
});

router.on("/business/handle/reform", function () {
    require.async(["components/page/business/handle/reform/reform"], function (p) {
        doRouter("handle-reform",p);
    })
});

router.on("/business/handle/change", function () {
    require.async(["components/page/business/handle/change/change"], function (p) {
        doRouter("handle-change",p);
    })
});

router.on("/business/handle/repair", function () {
    require.async(["components/page/business/handle/repair/repair"], function (p) {
        doRouter("handle-repair",p);
    })
});

router.on("/business/handle/peccancy", function () {
    require.async(["components/page/business/handle/peccancy/peccancy"], function (p) {
        doRouter("handle-peccancy",p);
    })
});

router.on("/business/handle/leakage", function () {
    require.async(["components/page/business/handle/leakage/leakage"], function (p) {
        doRouter("handle-leakage",p);
    })
});

router.on("/business/handle/supervise", function () {
    require.async(["components/page/business/handle/supervise/supervise"], function (p) {
        doRouter("handle-supervise",p);
    })
});

router.on("/business/interact", function () {
    require.async(["components/page/business/interact/interact"], function (p) {
        doRouter("interact",p);
    })
});

router.on("/business/interact/maintain", function () {
    require.async(["components/page/business/interact/maintain/maintain"], function (p) {
        doRouter("interact-maintain",p);
    })
});

router.on("/business/interact/maintain/edit/:sn", function (sn) {
    require.async(["components/page/business/interact/maintain/edit/edit"], function (p) {
        window.app.$data.interact.maintain.sn = sn;
        doRouter("interact-maintain-edit",p);
    })
});

router.on("/business/interact/check", function () {
    require.async(["components/page/business/interact/check/check"], function (p) {
        doRouter("interact-check",p);
    })
});

router.on("/business/interact/complaint", function () {
    require.async(["components/page/business/interact/complaint/complaint"], function (p) {
        doRouter("interact-complaint",p);
    })
});

router.on("/business/water", function () {
    require.async(["components/page/business/water/water"], function (p) {
        doRouter("water",p);
    })
});

router.on("/business/water/cod", function () {
    require.async(["components/page/business/water/cod/cod"], function (p) {
        doRouter("water-cod",p);
    })
});

router.on("/business/water/cod/detail", function () {
    require.async(["components/page/business/water/cod/detail/detail"], function (p) {
        doRouter("water-cod-detail",p);
    })
});

router.on("/business/water/blowdown", function () {
    require.async(["components/page/business/water/blowdown/blowdown"], function (p) {
        doRouter("water-blowdown",p);
    })
});

router.on("/business/water/blowdown/detail", function () {
    require.async(["components/page/business/water/blowdown/detail/detail"], function (p) {
        doRouter("water-blowdown-detail",p);
    })
});

router.on("/business/water/pay", function () {
    require.async(["components/page/business/water/pay/pay"], function (p) {
        doRouter("water-pay",p);
    })
});

router.on("/business/query", function () {
    require.async(["components/page/business/query/query"], function (p) {
        doRouter("query",p);
    })
});

router.on("/business/query/progress", function () {
    require.async(["components/page/business/query/progress/progress"], function (p) {
        doRouter("query-progress",p);
    })
});

router.on("/business/query/smeter", function () {
    require.async(["components/page/business/query/smeter/smeter"], function (p) {
        doRouter("query-smeter",p);
    })
});

router.on("/business/query/smeter/detail", function () {
    require.async(["components/page/business/query/smeter/detail/detail"], function (p) {
        doRouter("query-smeter-detail",p);
    })
});

router.on("/business/query/water", function () {
    require.async(["components/page/business/query/water/water"], function (p) {
        doRouter("query-water",p);
    })
});

router.on("/business/query/water/detail", function () {
    require.async(["components/page/business/query/water/detail/detail"], function (p) {
        doRouter("query-water-detail",p);
    })
});

router.on("/business/query/progress", function () {
    require.async(["components/page/business/query/progress/progress"], function (p) {
        doRouter("query-progress",p);
    })
});

router.on("/business/query/progress/detail", function () {
    require.async(["components/page/business/query/progress/detail/detail"], function (p) {
        doRouter("query-progress-detail",p);
    })
});

router.on("/info", function () {
    require.async(["components/page/info/info"], function (p) {
        doRouter("info",p);
    })
});

router.on("/info/list/:type", function (type) {
    var name  = getQueryString("name");
    require.async(["components/page/info/list/list"], function (p) {
        window.app.$data.info.type = type;
        window.app.$data.info.name = name;
        doRouter("info-list",p);
    })
});

router.on("/info/listall/:suid", function (suid) {
    require.async(["components/page/info/listall/listall"], function (p) {
        window.app.$data.auth.suid = suid;
        window.app.$data.info.suid = suid;
        doRouter("info-listall",p);
    })
});

router.on("/info/detail/:id", function (id) {
    require.async(["components/page/info/detail/detail"], function (p) {
        window.app.$data.news.id = id;
        doRouter("info-detail",p);
    })
});

router.on("/custom", function () {
    require.async(["components/page/custom/custom"], function (p) {
        doRouter("custom",p);
    })
});

router.on("/custom/list/:type", function (type) {
    var name  = getQueryString("name");
    require.async(["components/page/custom/list/list"], function (p) {
        window.app.$data.info.type = type;
        window.app.$data.info.name = name;
        doRouter("custom-list",p);
    })
});

router.on("/custom/detail/:id", function (id) {
    require.async(["components/page/custom/detail/detail"], function (p) {
        window.app.$data.news.id = id;
        doRouter("custom-detail",p);
    })
});

router.on("/service", function () {
    require.async(["components/page/service/service"], function (p) {
        doRouter("service",p);
    })
});

router.init("/home");




