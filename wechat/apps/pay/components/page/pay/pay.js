/**
 * Created by Chenliqiang on 2016/3/16.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;
var Router = require("component_modules/director").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("pay.html"),
    data:function(){
        return {
            pay_title:"",
            bindList:[],
            detail:{},
            CanPay:false,
            billamount:0,
            sn:""
        }
    },
    methods:{
        init:function(){
            var self = this;
            if(self.debug){
                self.getList();
            }else{
                self.getJSSDK();
            }
        },
        getList: function () {
            var self = this;
            Service.getBindList(self.auth, function (rep) {
                self.bindList = rep;
                if(rep.length > 0){
                    self.getFee(rep[0].sn);
                }
            })
        },
        getFee: function (sn) {
            var self = this;
            self.sn = sn;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{sn:sn});
            Layer.open({
                content: "查询中",
                type: 2,
                shadeClose: false
            });
            Service.getFee(param, function (rep) {
                Layer.closeAll();
                Vue.nextTick(function () {
                    self.pay_title = "户号[" + sn + "]";
                    self.detail = rep;
                    self.billamount = rep.billamount / 100;
                    if(self.billamount>0){
                        self.CanPay = true;
                    }else{
                        self.CanPay = false;
                    }
                })
            })
        },
        toBind: function () {
            //第一次直接进行查询支付时，可能还未获取本公众号的用户信息，需要授权获取，此处用路由去执行
            var self = this;
            var router = new Router();
            if(self.auth){
                router.setRoute("/business/bind");
            }else{
                router.setRoute("");
            }
        },
        wxPay:function(){
            var self = this;
            wx.ready(function () {

                if(self.CanPay == false){
                    return;
                };
                self.CanPay = false;
                setTimeout(function () {
                    self.CanPay = true;
                },3000)

                Layer.open({
                    content: "提交中",
                    type: 2,
                    shadeClose: false,
                    shade: false
                });

                var params = {
                    appid:self.pay.appid,
                    unionid:self.pay.unionid,
                    openid:self.pay.openid,
                    fqappid:self.appid,
                    suid:self.auth.suid,
                    billkey:self.detail.sn,
                    payplat:'WEIXINPAY',
                    body:'水费支付',
                    billamount:parseInt(self.detail.billamount),
                    name:self.detail.name,
                    addr:self.detail.addr,
                    billfines:self.detail.billfines,
                    paymentid:self.detail.paymentid,
                    paytype:"test"
                }
                Service.wxPay1_1(params, function (rep) {
                    Layer.closeAll();
                    if(rep.code == 0){
                        var out_trade_no = rep.response.out_trade_no;
                        wx.chooseWXPay({
                            timestamp: rep.response.timeStamp,
                            nonceStr: rep.response.nonceStr,
                            package: rep.response.package,
                            signType: rep.response.signType,
                            paySign: rep.response.paySign,
                            success:function(res){
                                Layer.open({
                                    content: "销账中",
                                    type: 2,
                                    shadeClose: false,
                                    shade: false
                                });

                                setTimeout(function(){
                                    Layer.closeAll();
                                    self.reQuery();
                                },3000);
                            }
                        });
                    }
                    else{
                        Layer.open({
                            content: rep.response,
                            shadeClose: false,
                            btn: ["确定"]
                        });
                    }
                },function(e){
                    Layer.closeAll();
                    Layer.open({
                        content: '支付失败，请关闭后重试!',
                        shadeClose: false,
                        btn: ["确定"]
                    });
                })
            })
        },
        reQuery:function(){
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{sn:self.sn});
            Service.getFee(param, function (rep) {
                Vue.nextTick(function () {
                    self.pay_title = "户号[" + self.sn + "]";
                    self.detail = rep;
                    self.billamount = rep.billamount / 100;
                    self.CanPay = false;
                })
            })
        },
        select: function (sn) {
            this.getFee(sn);
            $(".mui-popover").removeClass("mui-active").hide();
            $(".mui-backdrop").remove();
        },
        getDate: function (v) {
            var o = v.split("--");
            if(o.length>1&&o[0] == o[1]){
                return o[0];
            }else{
                return v;
            }
        },
        getJSSDK:function(){
            Layer.open({
                content: "加载中",
                type: 2,
                shadeClose: false,
                shade: false
            });
            var self = this;
            var url = location.href.split('#')[0];
            var code = Service.GetQueryString("code",self.runing);
            Service.getJSSDK1_1({appid:self.pay.appid, url:url, auth:false}, function (rep) {
                Layer.closeAll();
                //self.pay.unionid = rep.unionid;
                //self.pay.openid = rep.openid;
                wx.config({
                    debug: false,
                    appId: rep.appId,
                    timestamp: rep.timestamp,
                    nonceStr: rep.nonceStr,
                    signature: rep.signature,
                    jsApiList: ["chooseWXPay","hideAllNonBaseMenuItem"]
                });
                //self.bindUser();//是否需要绑定要确认
                self.hideAllNonBaseMenu();
                self.getList();
            }, function (e) {
                Layer.closeAll();
                Layer.open({
                    content:"初始化失败，请重新进入！",
                    shadeClose:false,
                    btn:["确定"],
                    yes:function(){
                        Layer.closeAll();
                        self.CanPay = false;
                    }
                });
            })
        },
        hideAllNonBaseMenu:function(){
            wx.ready(function(){
                wx.hideAllNonBaseMenuItem();
            })
        },
        bindUser: function () {
            var self = this;
            Service.bindUser({
                unionid: self.pay.unionid,
                openid: self.pay.openid,
                suid: self.auth.suid,
                app: "yhsl"
            },function(rep){})
        }
    },
    filters:{
        "canPay": function (bool) {
            var state = "";
            if(!bool){
                state = "mui-disabled";
            }
            return state;
        }
    },
    ready: function () {
        this.init();
    }
});
