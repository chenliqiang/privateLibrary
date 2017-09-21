/**
 * Created by Chenliqiang on 2016/3/15.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;
var Router = require("component_modules/director").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("edit.html"),
    data:function(){
        return{
            form:{
                name:"",
                tel:"",
                street:"",
                install:"",
                sn:"",
                type:"biangeng"
            },
            tit:""
        }
    },
    methods:{
        init:function(){
            var self = this;
            self.tit = "户号：" + self.interact.maintain.sn;
            self.form.sn = self.interact.maintain.sn;
            self.validator();
        },
        validator: function () {
            var form =  $("#form-maintain");
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
                content:"提交中",
                shadeClose:false
            });
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{form:self.form});
            Service.business(param,function(rep){
                Layer.closeAll();
                Layer.open({
                    content:"提交成功!",
                    shadeClose:false,
                    btn:["确定"],
                    yes:function(){
                        Layer.closeAll();
                        self.clearForm();
                        var router = new Router();
                        router.setRoute("/business/interact/maintain");
                    }
                });
            },function(e){
                Layer.closeAll();
                Layer.open({
                    content: "提交失败，请检查网络！",
                    shadeClose: false,
                    btn: ["确定"]
                });
            })
        },
        clearForm:function(){
            var self = this;
            self.tit = "户号：" + self.interact.maintain.sn;
            self.form = {
                name:"",
                tel:"",
                street:"",
                install:"",
                sn:self.interact.maintain.sn,
                type:"biangeng"
            };
        }
    },
    watch:{
        "interact.maintain.sn":function(){
            this.clearForm();
        }
    },
    ready: function () {
        this.init();
    }
});