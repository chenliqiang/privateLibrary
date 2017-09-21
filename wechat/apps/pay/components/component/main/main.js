/**
 * Created by Chenliqiang on 2016/3/22.
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
        debug:false,
        runing:"wxtool",//mobile,wxtool
        currentView:"",
        appid:"",
        auth:{
            openid:"",
            unionid:"",
            suid:"",
            app:"yhsl"
        },
        pay:{
            appid:"wx0fe5e72ab475542b",//度量
            openid:'',
            unionid:''
        }
        //title:"微支付"
    },
    methods:{
        init:function(){
            var self = this;
            if(self.debug){
                self.auth.openid = "ovR-ot7pMxNWOS0lTy5EkIuqtS4I";
                self.auth.unionid = "ocDk1s4HJgWKmJh422kckkrpp0H4";
                self.auth.suid = "56f8d58f0bb9ab129a54486f";//微信公众号测试8083

                Service.bindUser({
                    unionid: self.auth.unionid,
                    openid: self.auth.openid,
                    suid: self.auth.suid,
                    app: "yhsl"
                },function(rep){})

            }else{
                self.appid = Service.GetQueryString("appid","mobile");
                self.auth.suid = Service.GetQueryString("suid","mobile");
                self.auth.openid = Service.GetQueryString("openid","mobile");
                self.auth.unionid = Service.GetQueryString("unionid","mobile");
                self.getAuth();
            }
        },
        getAuth:function(){
            /*获取支付的用户信息*/
            var self = this;
            var code = Service.GetQueryString("code",self.runing);
            Service.getUserAuth({code:code,appid:self.pay.appid}, function (rep) {
                if(rep.code != 0){
                    WeixinJSBridge.call('closeWindow');
                }else{
                    self.pay.unionid = rep.auth.unionid;
                    self.pay.openid = rep.auth.openid;
                }
            })
        }
    },
    components:{
        "loading":loading
    },
    ready:function(){
        Fastclick.FastClick.attach(document.body);
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




