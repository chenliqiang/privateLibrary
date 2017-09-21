/**
 * Created by Chenliqiang on 2016/3/16.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;
var Router = require("component_modules/director").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("complaint.html"),
    data:function(){
        return{
            form:{
                typo:"投诉",
                theme:"",
                content:"",
                name:"",
                addr:"",
                tel:"",
                type:"complain"
            },
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
            var form =  $("#form-complaint");
            var self = this;
            form.validator({
                errorCallback: function (unvalidFields) {
                },
                after: function (e) {
                    self.submit();
                    return false;
                },
                isErrorOnParent: true
            })
        },
        submit:function(){
            var self = this;
            Layer.open({
                type:2,
                content:"提交中"
            });
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{form:self.form});
            Service.feeback(param,function(rep){
                Layer.closeAll();
                Layer.open({
                    content:"提交成功,您可以通过微客服了解最新进度!!!",
                    shadeClose:false,
                    btn:["确定"],
                    yes:function(){
                        Layer.closeAll();
                        self.clearForm();
                        var router = new Router();
                        router.setRoute("/business/interact");
                    }
                });
            },function(e){
                Layer.closeAll();
                Layer.open({
                    content: '提交错误，请检查网络!',
                    shadeClose: false,
                    btn: ["确定"]
                });
            })
        },
        clearForm:function(){
            var self = this;
            self.form = {
                typo:"投诉",
                theme:"",
                content:"",
                name:"",
                addr:"",
                tel:"",
                type:"complain"
            };
        }
    },
    watch:{
        "interact.suid":function(){
            this.clearForm();
        }
    },
    ready: function () {
        this.init();
    }
});