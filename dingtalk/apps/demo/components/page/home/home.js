/**
 * Created by Chenliqiang on 2016/4/7.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("home.html"),
    data:function(){
        return {
            corpId:window.appstore.base.corpId,
            agentId:window.appstore.base.agentId,
            msgdata:{
                touser:"",
                toparty:"",
                agentid:"18032301",
                msgtype:"text",
                "text":{
                    content:""
                }
            },
            users:""
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
                        "device.notification.toast",
                        "device.notification.alert",
                        "device.notification.confirm",
                        "device.launcher.launchApp",
                        "biz.contact.choose",
                        "biz.contact.createGroup",
                        "device.notification.vibrate"
                    ]
                });

                dd.error(function(error){
                    alert(JSON.stringify(error));

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
        },
        selectUsers:function(){
            var self = this;
            dd.ready(function(){
                dd.biz.contact.choose({
                    startWithDepartmentId: 0, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
                    multiple: true, //是否多选： true多选 false单选； 默认true
                    users: [], //默认选中的用户列表，userid；成功回调中应包含该信息
                    corpId: self.corpId, //企业id
                    max: 1500, //人数限制，当multiple为true才生效，可选范围1-1500
                    onSuccess: function(data) {
                        if(data.length>0){
                            self.users = "";
                            self.msgdata.touser = "";
                        }
                        for(var i=0;i<data.length;i++){
                            if(i>0){
                                self.msgdata.touser += "|";
                                self.users += "、";
                            }
                            self.users += data[i].name;
                            self.msgdata.touser += data[i].emplId;
                        }
                        $("#users").html(self.users);
                        if($("#users").html() != "点击选择联系人"){
                            $("#users").css("color","#000");
                        }
                    },
                    onFail : function(err) {
                        alert("联系人选择失败 " + JSON.stringify(err));
                    }
                });
            });
        },
        send:function(){
            var self = this;
            if(self.msgdata.touser.length == 0){
                dd.device.notification.alert({
                    message: "请选择联系人",
                    title: "提示",
                    buttonName: "确定",
                    onSuccess : function() {
                    },
                    onFail : function(err) {}
                });
                return;
            }
            if(self.msgdata.text.content.length == 0){
                dd.device.notification.alert({
                    message: "请填写消息内容",
                    title: "提示",
                    buttonName: "确定",
                    onSuccess : function() {
                    },
                    onFail : function(err) {}
                });
                return;
            }
            var param = $.extend({corpid:self.corpId},{msgdata:self.msgdata});

            Service.sendmsg(param,function(rep){
                var text = "",icon="";
                 if(rep.errcode == 0){
                     text = "发送成功";
                     icon = "success";
                     dd.device.notification.vibrate({
                         duration: 300, //震动时间，android可配置 iOS忽略
                         onSuccess : function(result) {
                         },
                         onFail : function(err) {}
                     })
                 }else{
                     text = rep.Response.errmsg;
                     icon = "error";
                 }

                dd.device.notification.toast({
                    icon: icon, //icon样式，有success和error，默认为空 0.0.2
                    text: text, //提示信息
                    //duration: Number, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
                    //delay: Number, //延迟显示，单位秒，默认0
                    onSuccess : function(result) {
                        /*{}*/
                    },
                    onFail : function(err) {}
                })
            },function(err){
                alert("失败 " + JSON.stringify(err));
            });
            self.reset();
        },
        reset:function(){
            var self = this;
            $("#users").html("点击选择联系人");
            $("#users").css("color","#A9A9A9");
            self.users = "";
            self.msgdata = {
                    touser:"",
                    toparty:"",
                    agentid:"18032301",
                    msgtype:"text",
                    "text":{
                    content:""
                }
            }
        }
    },
    ready: function () {
        this.init();
    }
});