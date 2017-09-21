/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Layer = require("component_modules/layer.m.js").layer;
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("add.html"),
    data:function(){
        return {
            form:{},
            valid:false,
            app:window.appstore
        }
    },
    methods:{
        validator: function () {
            var form =  $("#formSubmit");
            var self = this;

            form.validator({
                errorCallback: function (unvalidFields) {
                    self.valid = true;
                },
                after: function (e) {
                    var data = self.getFormData(form);
                    var param = $.extend(JSON.parse(JSON.stringify(self.auth)),data,{type:"userAuth"});
                    Layer.open({
                        content: "提交中",
                        type: 2,
                        shadeClose: false,
                        shade: false
                    });

                    Service.bind(param, function (rep) {
                        Layer.open({
                            content: "绑定成功！",
                            shadeClose: false,
                            btn:["确定"],
                            yes: function () {
                                Layer.closeAll();
                                var router = new Router();
                                router.setRoute("business/bind");
                                self.$parent.$broadcast("reload","bind");
                            }
                        });
                    }, function (rep) {
                        Layer.closeAll();
                        alert(rep.Message);
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
        initForm:function(form){
            var self = this;
            form.fields.$delete('type');
            var fList = [];
            for(var k in form.fields){
                fList.push({key:k,val:form.fields[k]});
            }
            form.fields = fList;
            return form;
        }
    },
    ready: function () {
        var self = this;
        Service.getBindForm(self.auth, function (rep) {
            self.form = self.initForm(rep);
            Vue.nextTick(function () {
                self.validator();
            })
        });
    }
});