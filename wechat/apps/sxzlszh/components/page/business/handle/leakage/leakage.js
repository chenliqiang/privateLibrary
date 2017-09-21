/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m.js").layer;
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("leakage.html"),
    data:function(){
        return {
            form:{
                contact:"",
                tel:"",
                addr:"",
                upfile:"",
                desc:"",
                type:"loushui"
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
            var form =  $("#form-leakage");
            var self = this;
            form.validator({
                errorCallback: function () {
                    self.valid = true;
                },
                after: function (e) {
                    self.valid = false;
                    Layer.open({
                        content: '是否上传举报信息？',
                        btn: ['确认', '取消'],
                        shadeClose: false,
                        yes: function() {
                            self.submit();
                        },
                        no: function() {}
                    });
                    return false;
                },
                isErrorOnParent: true
            })
        },
        onUpload: function (e) {
            var file = e.target.files[0];
            var self = this;
            types = ["image/jpeg", "image/gif", "image/png"];
            if (types.indexOf(file.type) > -1) {
                lrz(file, {
                    width: 800,
                    done: function (rep) {
                        self.form.upfile = rep.base64;
                    }
                });
            }
        },
        submit:function(){
            var self = this;
            self.auth.suid = self.suid.sxzls;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{form:JSON.parse(JSON.stringify(self.form))});
            Layer.open({
                content: "提交中",
                type: 2,
                shadeClose: false,
                shade: false
            });

            Service.report(param, function (rep) {
                Layer.closeAll();
                Layer.open({
                    content: "举报提交成功，您可以通过微客服了解最新进度!!!",
                    btn:["确认"],
                    yes: function () {
                        self.form = {
                            name:"",
                            contact:"",
                            addr:"",
                            tel:"",
                            mobile:"",
                            type:"loushui"
                        };
                        var router = new Router();
                        router.setRoute("#business/handle");
                        Layer.closeAll();
                    },
                    shadeClose: false
                })
            },function(e){
                Layer.open({
                    content: '举报提交失败：' + e.Message,
                    shadeClose: false,
                    btn: ["确定"]
                });
            });
        }
    },
    ready: function () {
        this.init();
    }
});