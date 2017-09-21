/**
 * Created by Chenliqiang on 2016/4/19.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("apps.html"),
    data:function(){
        return {
            corpId:window.appstore.base.corpId,
            agentId:window.appstore.base.agentId
        }
    },
    methods:{
        init:function(){
            this.getjsapi();
        },
        getjsapi:function(){
            var self = this;
            var url = location.href.split('#')[0];
            Service.getjsapi({corpid:self.corpId,url:url},function(rep){
                dd.config({
                    agentId: self.agentId,
                    corpId: self.corpId,
                    timeStamp: rep.timestamp,
                    nonceStr: rep.nonceStr,
                    signature: rep.signature,
                    jsApiList: [
                        "device.notification.alert",
                        "device.notification.confirm",
                        "device.launcher.launchApp"
                    ]
                });

                dd.error(function(error){
                    dd.device.notification.alert({
                        message: "启动失败，请刷新一下或重新进入",
                        title: "提示",
                        buttonName: "确定",
                        onSuccess : function() {
                        },
                        onFail : function(err) {}
                    });
                });
            })
        },
        launchApp:function(app){
            var self  = this;
            dd.ready(function(){
                var info = self.getappinfo(app);
                dd.device.launcher.launchApp({
                    app: info.app,
                    activity :'',
                    onSuccess : function(data) {
                        if(data.result == "false" || data.result == false){
                            dd.device.notification.confirm({
                                message: "您可能尚未安装" + info.name,
                                title: "提示",
                                buttonLabels: ['安装', '取消'],
                                onSuccess : function(result) {
                                    if(result.buttonIndex == 0){
                                        window.location.href = info.url;
                                    }
                                },
                                onFail : function(err) {
                                    alert("err " + JSON.stringify(err));
                                }
                            });
                        }
                    },
                    onFail : function(err) {
                        alert("launchApp-Fail " + JSON.stringify(err));
                    }
                });
            });
        },
        getappinfo:function(app){
            var info = {name:"",app:"",url:""};
            switch (app){
                case "taobao":{
                    info.name = "淘宝";
                    if(dd.ios){
                        info.app = "taobao";
                        info.url = "https://appsto.re/cn/Mg5gx.i";
                    }
                    else if(dd.android){
                        info.app = "com.taobao.taobao";
                        info.url = "http://ma.taobao.com/ZhEm81";
                    }
                }break;
                case "weibo":{
                    info.name = "微博";
                    if(dd.ios){
                        info.app = "weibo";
                        info.url = "https://appsto.re/cn/fh06u.i";
                    }
                    else if(dd.android){
                        info.app = "com.sina.weibo";
                        info.url = "http://weibo.cn/client/download";
                    }
                }
            }
            return info;
        }
    },
    ready: function () {
        this.init();
    }
});