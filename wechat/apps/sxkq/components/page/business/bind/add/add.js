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
            valid:false
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
                    self.valid = false;
                    var data = self.getFormData(form);
                    if(data.usfz.length == 0){
                        data.usfz = "-";
                    }
                    else if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(data.usfz))){
                        $("input[name='usfz']").parent().addClass("error");
                        return false;
                    }
                    if($("input[name='usfz']").parent().hasClass("error")){
                        $("input[name='usfz']").parent().removeClass("error");
                    }
                    var param = $.extend(JSON.parse(JSON.stringify(self.auth)),data,{type:"userAuth"});
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
                                $("#formSubmit")[0].reset();
                                var router = new Router();
                                router.setRoute("business/bind");
                                self.$parent.$broadcast("reload","bind");
                            }
                        });
                    }, function (rep) {
                        Layer.closeAll();
                        Layer.open({
                            content:rep.Message,
                            shadeClose: false,
                            btn: ["确定"]
                        });
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
        }
    },
    filters:{
        "mob":function(key){
            var type = "text";
            if(key == "umtel"){
                type = "mobile";
            }
            else if(key == "usfz"){
                type = null;
                //type = "idnumber";
            }
            return type;
        },
        "need":function(key){
            var need = "required";
            if(key == "usfz"){
                need = null;
            }
            return need;
        },
        "bt":function(key){
            var bool = true;
            if(key == "usfz"){
                bool = false;
            }
            return bool;
        }
    },
    ready: function () {
        var self = this;
        Service.getBindForm(self.auth, function (rep) {
            var fList = [];
            for(var k in rep.fields){
                fList.push({key:k,val:rep.fields[k]});
            }
            rep.fields = fList;
            self.form = rep;
            Vue.nextTick(function () {
                self.validator();
                mui("input[type='text']").input();
            })
        });
    }
});