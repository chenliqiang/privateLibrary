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
        appid:"wx8e3f800a1ec51085",
        auth:{
            openid:"",
            unionid:"",
            suid:"560a47af0bb9ab56cf789e81",
            app:"yhsl"
        },
        info:{
            name:"",
            type:""
        },
        news:{
            id:"",
            title:"",
            date:""
        },
        config:{

        },
        title:"大连长海"
    },
    methods:{
        init:function(){
            var self = this;
            if(self.debug){
                self.auth.openid = "oy8Uxs8CjNenvQgMGL1afUfTqy_o";
                self.auth.unionid = "olNcSt_WsUycvqzvFG-86kyIO0MQ";
            }else{
                self.getAuth();
            }
        },
        getAuth:function(){
            var code = Service.GetQueryString("code","hash"),
                unionid = Service.GetQueryString("unionid"),
                openid  = Service.GetQueryString("openid"),
                suid  = Service.GetQueryString("suid");

            if(code){

                Layer.open({
                    content: "加载中",
                    type: 2,
                    shadeClose: false,
                    shade: false
                });
                Service.getUserInfo({code:code,appid:this.appid}, function (rep) {
                    Layer.closeAll();
                    if(rep.code && rep.code == 1){
                        self.auth = JSON.parse(localStorage[self.appid]);
                    }else{
                        self.auth.unionid = rep.unionid;
                        self.auth.openid = rep.openid;

                        localStorage[self.appid] = JSON.stringify(self.auth);

                        if(!localStorage[self.appid +"isBind"]){
                            Service.bindUser({
                                unionid: self.auth.unionid,
                                openid: self.auth.openid,
                                suid: self.auth.suid,
                                app: "yhsl"
                            },function(rep){
                                localStorage[self.appid +"isBind"] = true;
                            })
                        }
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
        var self = this;
        Fastclick.FastClick.attach(document.body);
        document.title = self.title;
        self.init();
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

router.on("/business/water", function () {
    require.async(["components/page/business/water/water"], function (p) {
        doRouter("handle-water",p);
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


router.on("/info", function () {
    require.async(["components/page/info/info"], function (p) {
        doRouter("info",p);
    })
});
router.on("/loading", function () {
    require.async(["components/page/loading/loading"], function (p) {
        doRouter("loading",p);
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




