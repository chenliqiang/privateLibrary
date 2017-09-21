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
            selected:"0"
        }
    },
    methods:{
        getBindForm:function(){
            var self = this;
            switch(self.selected){
                case "0":{
                    self.auth.suid = self.suid.sxzls;
                }break;
                case "1":{
                    self.auth.suid = self.suid.sxzls;
                }break;
                case "2":{
                    self.auth.suid = self.suid.sxps;
                }
            }
            self.form = {};
            Service.getBindForm(self.auth, function (rep) {
                self.form = self.initForm(rep);
                Vue.nextTick(function () {
                    self.validator();
                })
            });
        },
        initForm:function(form){
            var self = this;
            switch(self.selected){
                case "0":{
                    form.fields.$delete('usort');
                }break;
                case "1":{
                    form.fields.$delete('usort');
                    form.fields.$delete('usfz');
                    form.fields.$delete('name');
                }break;
                case "2":{
                    form.fields.$delete('type');
                }break;
            }
            var fList = [];
            for(var k in form.fields){
                fList.push({key:k,val:form.fields[k]});
            }
            form.fields = fList;
            return form;
        },
        validator: function () {
            var form =  $("#formSubmit");
            var self = this;

            form.validator({
                errorCallback: function (unvalidFields) {
                },
                after: function (e) {
                    var data = self.getFormData(form);
                    switch (self.selected){
                        case "0":{
                        }
                        case "1":{
                            self.sxzls_bindBusiness(data);
                        }break;
                        case "2":{
                            self.sxps_bindBusiness(data);
                        }break;
                    }
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
        clearFormData:function(){
            var self = this;
            self.selected = "0";
            $("#formSubmit")[0].reset();
        },
        sxzls_bindBusiness:function(formData){
            var self = this;
            self.auth.suid = self.suid.sxzls;
            if(self.selected == "1"){
                formData = $.extend(formData,{name:"-",usfz:"-"});
            }
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),formData);
            Layer.open({
                content: "提交中",
                type: 2,
                shadeClose: false,
                shade: false
            });
            Service.verfiy(param,function(rep){
                Layer.closeAll();
                var router = new Router();
                if(self.selected == "0"){//自来水居民用户
                    rep.tel = rep.umtel;
                    rep.idcard = rep.usfz;
                    rep.name = rep.username;
                    if(!rep.tel){
                        Layer.open({
                            content: "当前系统没有登记您的手机号码，是否登记该号码？",
                            shadeClose: false,
                            btn: ["是", "否"],
                            yes: function () {
                                Layer.closeAll();
                                self.clearFormData();
                                self.verify = $.extend(JSON.parse(JSON.stringify(self.auth)),rep,{umtelupd:"1",usort:self.selected});
                                router.setRoute("/business/bind/add/verify");
                            },
                            no: function () {
                                Layer.closeAll();
                                self.clearFormData();
                                self.verify = $.extend(JSON.parse(JSON.stringify(self.auth)),rep,{umtelupd:"0",usort:self.selected});
                                router.setRoute("/business/bind/add/verify");
                            }
                        });
                    }
                    else if (rep.tel != rep.umtel) {
                        Layer.open({
                            content: "当前录入号码与您系统登记的号码不一致，是否更新登记号码？",
                            shadeClose: false,
                            btn: ["是", "否"],
                            yes: function () {
                                Layer.closeAll();
                                self.verify = $.extend(JSON.parse(JSON.stringify(self.auth)),rep,{umtelupd:"1",usort:self.selected});
                                self.clearFormData();
                                router.setRoute("/business/bind/add/verify");
                            },
                            no: function () {
                                Layer.closeAll();
                                self.verify = $.extend(JSON.parse(JSON.stringify(self.auth)),rep,{umtelupd:"0",usort:self.selected});
                                self.clearFormData();
                                router.setRoute("/business/bind/add/verify");
                            }
                        });
                    }
                    else {
                        self.verify = $.extend(JSON.parse(JSON.stringify(self.auth)),rep,{umtelupd:"0",usort:self.selected});
                        self.clearFormData();
                        router.setRoute("/business/bind/add/verify");
                    }
                }
                else{//自来水企业用户
                    rep.usfz = "-";
                    rep.idcard = "-";
                    rep.name = rep.username;
                    self.verify = $.extend(JSON.parse(JSON.stringify(self.auth)),rep,{umtelupd:"0",usort:self.selected});
                    self.clearFormData();
                    router.setRoute("/business/bind/add/verify");
                }
            },function(e){
                Layer.closeAll();
                Layer.open({
                    content: "用户信息填写错误，请检查！",
                    shadeClose: false,
                    btn: ["确定"]
                });
            })
        },
        sxps_bindBusiness:function(formData){
            var self = this;
            self.auth.suid = self.suid.sxps;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),formData,{type:"userAuth"});
            Layer.open({
                content: "提交中",
                type: 2,
                shadeClose: false,
                shade: false
            });

            Service.bind(param, function (rep) {
                Layer.closeAll();
                Layer.open({
                    content: "绑定成功！",
                    shadeClose: false,
                    btn:["确定"],
                    yes: function () {
                        Layer.closeAll();
                        self.clearFormData();
                        self.$parent.$broadcast("bind-reload");
                        var router = new Router();
                        router.setRoute("business/bind");
                    }
                });
            }, function (rep) {
                Layer.closeAll();
                alert(rep.Message);
            });
        }
    },
    watch:{
        "selected":function(val,oldVal){
            this.getBindForm();
        }
    },
    filters:{
        "fType":function(types){
            var self = this,type = "text";
            if(self.selected == "2" && types == "name"){
                type = "password";
            }
            return type;
        }
    },
    ready: function () {
        this.getBindForm();
    }
});