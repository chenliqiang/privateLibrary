/**
 * Created by Chenliqiang on 2016/4/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("pay.html"),
    methods:{
        init:function(){
            this.getJSSDK();
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
            Service.getJSSDK({appid:self.appid, url:url, auth:false}, function (rep) {
                Layer.closeAll();
                wx.config({
                    debug: false,
                    appId: rep.appId,
                    timestamp: rep.timestamp,
                    nonceStr: rep.nonceStr,
                    signature: rep.signature,
                    jsApiList: ["chooseWXPay","hideAllNonBaseMenuItem"]
                });
                self.hideAllNonBaseMenu();
                Layer.open({
                    content:"支付准备就绪！",
                    shadeClose:false,
                    btn:["确定"]
                });
            }, function (e) {
                Layer.closeAll();
                Layer.open({
                    content:"微支付迷路啦，请刷新或重新进入！",
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
        wxPay:function(){
            Layer.open({
                content: "提交中",
                type: 2,
                shadeClose: false,
                shade: false
            });
            var self = this;
            var params = {
                appid:self.appid,
                openid:self.auth.openid,
                body:'水费支付',
                total_fee:1
            }
            Service.wxpaytest(params, function (rep) {
                Layer.closeAll();
                if(rep.code == 0){
                    var out_trade_no = rep.pay.out_trade_no;
                    wx.chooseWXPay({
                        timestamp: rep.pay.timeStamp,
                        nonceStr: rep.pay.nonceStr,
                        package: rep.pay.package,
                        signType: rep.pay.signType,
                        paySign: rep.pay.paySign,
                        success:function(res){
                            Layer.open({
                                content: "销账中",
                                type: 2,
                                shadeClose: false,
                                shade: false
                            });

                            setTimeout(function(){
                                Layer.closeAll();
                            },3000);
                        }
                    });
                }
                else{
                    Layer.open({
                        content: rep.pay,
                        shadeClose: false,
                        btn: ["确定"]
                    });
                }
            })
        }
    },
    ready: function () {
        this.init();
    }
});