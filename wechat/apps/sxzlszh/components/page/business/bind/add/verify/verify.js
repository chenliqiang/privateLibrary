/**
 * Created by Chenliqiang on 2016/3/10.
 */

var Vue = require("component_modules/vue.js");
var Layer = require("component_modules/layer.m.js").layer;
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("verify.html"),
    data:function(){
        return {
            thisTel: ""
        }
    },
    methods:{
        init:function(){
            var self = this;
            if(self.verify.umtel){
                self.thisTel = self.verify.umtel.substr(0,3)+"****"+self.verify.umtel.substr(7,11);
            }else{
                self.thisTel = "无预留";
            }
            self.validator();
        },
        verfiy:function(){
            if(!$("#btn-auth").hasClass("mui-disabled")){
                $("#btn-auth").addClass("mui-disabled");
                var self = this;
                var param = $.extend(JSON.parse(JSON.stringify(self.verify)),{sendsms:"101"});
                Service.verfiySMS(param,function(){

                },function(e){
                    alert(e.Message);
                })
                self.countDown(180);
            }
        },
        countDown:function(num){
            var self = this;
            var t = $("#btn-auth");
            t.html("重新获取"+num);
            self.timer = setInterval(function(){
                    num--;
                    if(num<=0){
                        t.html("获取验证码").removeClass("mui-disabled");
                        clearInterval(self.timer);
                    }else{
                        t.html("重新获取"+num);
                    }
                }
            ,1000);
        },
        initForm:function(){
            var self = this;
            $("input[name='code']").val("");
            $("#btn-auth").html("获取验证码").removeClass("mui-disabled");
            clearInterval(self.timer);
        },
        validator: function () {
            var form =  $("#form-auth");
            var self = this;

            form.validator({
                errorCallback: function (unvalidFields) {
                },
                after: function (e) {
                    var code = $("input[name='code']").val();
                    var param = $.extend(JSON.parse(JSON.stringify(self.verify)),{code:code});
                    Service.bind(param,function(rep){
                        Layer.open({
                            content:"绑定成功!",
                            shadeClose:false,
                            btn:["确定"],
                            yes:function(){
                                Layer.closeAll();
                                self.initForm();
                                self.$parent.$broadcast("bind-reload");//绑定成功后目前2个地方使用，1绑定列表，2居民用户水量查询,3绑定的表单清空
                                var router = new Router();
                                router.setRoute("/business/bind");
                            }
                        });
                    },function(e){
                        Layer.open({
                            content:e.Message,
                            shadeClose:false,
                            btn:["确定"]
                        });
                    })

                    return false;
                },
                isErrorOnParent: true
            })
        },
        back:function(){
            this.initForm();
            var router = new Router();
            router.setRoute("/business/bind/add");
        }
    },
    watch:{
        "verify":function(val){
            this.init();
        }
    },
    filters:{
    },
    ready: function () {
        this.init();
    }
});