/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m.js").layer;
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("repair.html"),
    data:function(){
        return {
            form:{
                addr:"",
                contact:"",
                addr:"",
                tel:"",
                desc:"",
                type:"baoxiu"
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
            var form =  $("#form-repair");
            var self = this;
            form.validator({
                errorCallback: function () {
                    self.valid = true;
                },
                after: function (e) {
                    self.valid = false;
                    var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{form:JSON.parse(JSON.stringify(self.form))},{type:"userAuth"});
                    Layer.open({
                        content: "提交中",
                        type: 2,
                        shadeClose: false,
                        shade: false
                    });

                    Service.business(param, function (rep) {
                        Layer.closeAll();
                        Layer.open({
                            content: "提交成功",
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