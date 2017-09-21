/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m.js").layer;
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("change.html"),
    data:function(){
        return {
            form:{
                sn:"",
                addr:"",
                name:"",
                upfile:"",
                desc:"",
                tel:"",
                type:"shenqing"
            }
        }
    },
    methods:{
        validator: function () {
            var form =  $("#form-change");
            var self = this;
            form.validator({
                errorCallback: function () {
                    self.valid = true;
                },
                after: function (e) {
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
        }
    },
    ready: function () {
        this.validator();
    }
});