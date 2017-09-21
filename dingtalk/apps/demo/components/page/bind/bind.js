/**
 * Created by Chenliqiang on 2016/4/25.
 */

var Vue = require("component_modules/vue.js");
var Layer = require("component_modules/layer.m.js").layer;
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("bind.html"),
    data:function(){
        return {
            corpId:window.appstore.base.corpId,
            agentId:"17670701",//test
            //agentId:window.appstore.base.agentId
            suid:window.appstore.base.suid,
            form:{},
            valid:false,
            auth:window.appstore.auth
        }
    },
    methods:{
        init:function(){
            var self = this;
            var localtoken = JSON.parse(localStorage.getItem("yh-dingtalk"));
            if(localtoken){
                self.goto(localtoken.token);
            }else{
                self.getjsapi();
            }
        },
        getBindForm:function(){
            var self = this;
            Service.getBindForm(self.auth, function (rep) {
                var fList = [];
                for(var k in rep.fields){
                    fList.push({key:k,val:rep.fields[k]});
                }
                rep.fields = fList;
                self.form = rep;
                Vue.nextTick(function () {
                    self.validator();
                    mui("input[type='text']").input();
                })
            });
        },
        validator: function () {
            var form =  $("#formSubmit");
            var self = this;

            form.validator({
                errorCallback: function (unvalidFields) {
                    self.valid = true;
                },
                after: function (e) {
                    var data = self.getFormData(form);
                    var param = $.extend(JSON.parse(JSON.stringify(self.auth)),data,{code:"hzyhsw",aid:"scada"});
                    Layer.open({
                        content: "提交中",
                        type: 2,
                        shadeClose: false,
                        shade: false
                    });
                    Service.bindUser(param, function (rep) {
                        Layer.closeAll();
                        localStorage["yh-dingtalk"] = JSON.stringify(rep);
                        Layer.open({
                            content: "绑定成功,点击确定进入系统",
                            shadeClose: false,
                            btn: ["确定"],
                            yes: function () {
                                Layer.closeAll();
                                self.goto(rep.token);
                            }
                        });
                    }, function (rep) {
                        Layer.closeAll();
                        Layer.open({
                            content:rep.Message,
                            shadeClose: false,
                            btn: ["确定"]
                        });
                    });

                    return false;
                },
                isErrorOnParent: true
            })
        },
        getFormData: function (form) {
            var l = form.serializeArray();
            var o = {};
            for(var i in l){
                o[l[i]["name"]] =  l[i]["value"];
            }
            return o;
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
                        "device.notification.confirm",
                        "runtime.permission.requestAuthCode",
                        "device.notification.showPreloader",
                        "device.notification.hidePreloader"
                    ]
                });

                dd.error(function(error){
                    dd.device.notification.alert({
                        message: "启动失败，请刷新或重新进入",
                        title: "提示",
                        buttonName: "确定",
                        onSuccess : function() {
                        },
                        onFail : function(err) {}
                    });
                });

                dd.ready(function(){
                    dd.runtime.permission.requestAuthCode({
                        corpId: self.corpId,
                        onSuccess: function(result) {
                            self.getuser(result.code);
                        },
                        onFail : function(err) {
                            dd.device.notification.alert({
                                message: "数据异常，请刷新或重新进入",
                                title: "提示",
                                buttonName: "确定",
                                onSuccess : function() {
                                },
                                onFail : function(err) {}
                            });
                        }
                    })
                });
            })
        },
        getuser:function(code){
            var self = this;
            Service.getuserauth({corpid:self.corpId,code:code},function(rep){
                self.auth.openid = rep.userid;
                self.auth.unionid = rep.userid
                self.getBindForm();
            },function(err){
                alert(JSON.stringify(err));
            })
        },
        goto:function(token){
            var url = "http://weixin2.test.dlmeasure.com/static/duliang/weixin/apps/yhpsdd/zw/index.html?token=" + token +"&#&pageHome";
            window.location.href = url;
        }
    },
    filters:{
        "fType":function(types){
            var type = "text";
            if(types == "pw"){
                type = "password";
            }
            return type;
        }
    },
    ready: function () {
        this.init();
    }
});