/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("water.html"),
    data:function(){
        return {
            con_height:"",
            bindList:[],
            detail:{},
            CanPay:false,
            billamount:0,
            sn:""
        }
    },
    methods:{
        init:function(){
            var height = document.documentElement.clientHeight;
            this.con_height = (height - 5) + "px";
            this.getJSSDK();
        },
        getList: function () {
            var self = this;
            Service.getBindList(this.auth, function (rep) {
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
                    appid:self.appid,
                    unionid:self.auth.unionid,
                    openid:self.auth.openid,
                    fqappid:self.appid,
                    suid:self.auth.suid,
                    billkey:self.detail.sn,
                    payplat:'WEIXINPAY',
                    body:'水费支付',
                    billamount:parseInt(self.detail.billamount),
                    name:self.detail.name,
                    addr:self.detail.addr,
                    billfines:self.detail.billfines,
                    paymentid:self.detail.paymentid
                }
                Service.wxPay1_2(params, function (rep) {
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
            var code = Service.GetQueryString("code");
            Service.getJSSDK({appid:self.appid, url:url,auth:false}, function (rep) {
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
                self.getList();
            }, function (e) {
                Layer.closeAll();
                Layer.open({
                    content:"获取数据错误，请刷新或重新进入！",
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