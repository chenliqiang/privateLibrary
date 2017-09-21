/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m.js").layer;
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("new.html"),
    data:function(){
        return {
            form:{
                name:"",
                contact:"",
                addr:"",
                tel:"",
                mobile:"",
                type:"xinzhuang"
            },
            valid:false,
            con_height:""
        }
    },
    methods:{
        init:function(){
            var height = document.documentElement.clientHeight;
            this.con_height = (height - 15) + "px";
            this.validator();
        },
        validator: function () {
            var form =  $("#form");
            var self = this;

            form.validator({
                errorCallback: function () {
                    self.valid = true;
                },
                after: function (e) {
                    self.valid = false;
                    self.auth.suid = self.suid.sxzls;
                    var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{form:JSON.parse(JSON.stringify(self.form))});
                    Layer.open({
                        content: "提交中",
                        type: 2,
                        shadeClose: false,
                        shade: false
                    });

                    Service.business(param, function (rep) {
                        Layer.closeAll();
                        Layer.open({
                            content: "新装申请成功，您可以通过微客服了解最新进度!!!",
                            btn:["确定"],
                            yes: function () {
                                self.form = {
                                    name:"",
                                    contact:"",
                                    addr:"",
                                    tel:"",
                                    mobile:"",
                                    type:"xinzhuang"
                                };
                                var router = new Router();
                                router.setRoute("#business/handle");
                                Layer.closeAll();
                            },
                            shadeClose: false
                        })
                    },function(e){
                        Layer.open({
                            content: '新装申请失败:' + e.Message,
                            shadeClose: false,
                            btn: ["确定"]
                        });
                    });
                    return false;
                },
                isErrorOnParent: true
            })
        }
    },
    ready: function () {
        this.init();
    }
});