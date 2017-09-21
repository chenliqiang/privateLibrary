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
        appid:"wx6530bacfede0545a",/*和达演示平台*/
        auth:{
            openid:"",
            unionid:"",
            app:"yhsl",
            suid:"56f8d58f0bb9ab129a54486f"//绍兴柯桥供水有限公司8083
        },
        title:"支付测试"
    },
    methods:{
        init:function(){
            var self = this;
            if(self.debug){
                self.auth.openid = "o3H5ysyLPFE9o7JTmNuoBfZWUl54";
                self.auth.unionid = "olNcSt9NNT0GOJ7oFAEh8R-SkbTc";

            }else{
                self.getAuth();
            }
        },
        getAuth:function(){
            var self = this,
                code = Service.GetQueryString("code"),
                unionid = Service.GetQueryString("unionid"),
                openid  = Service.GetQueryString("openid"),
                suid  = Service.GetQueryString("suid")

            if(code){
                Layer.open({
                    content: "加载中",
                    type: 2,
                    shadeClose: false,
                    shade: false
                });
                //（只）获取当前公众号用户信息
                Service.getUserAuth({code:code,appid:this.appid}, function (rep) {
                    Layer.closeAll();
                    if(rep.code != 0){
                        self.auth = JSON.parse(localStorage[self.appid]);
                    }else{
                        self.auth.unionid = rep.auth.unionid;
                        self.auth.openid = rep.auth.openid;

                        localStorage[self.appid] = JSON.stringify(self.auth);

                        Service.bindUser({
                            unionid: self.auth.unionid,
                            openid: self.auth.openid,
                            suid: self.auth.suid,
                            app: "yhsl"
                        },function(rep){})
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
        Fastclick.FastClick.attach(document.body);
        document.title = this.title;
        this.init();
    }
});

function doRouter(target,page){
    var coms = window.app.$options.components;
    if(!coms[target]){
        coms[target] = page;
    }
    window.app.$data.currentView = target;
}

router.on("/pay", function () {
    require.async(["components/page/pay/pay"], function (p) {
        doRouter("pay",p);
    })
});

router.on("/loading", function () {
    require.async(["components/page/loading/loading"], function (p) {
        doRouter("loading",p);
    })
});

router.init("/pay");




