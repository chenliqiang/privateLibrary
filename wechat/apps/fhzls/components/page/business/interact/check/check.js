/**
 * Created by Chenliqiang on 2016/3/16.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;
var Router = require("component_modules/director").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("check.html"),
    data:function(){
        return{
            form:{
                judge1:"满意",
                judge2:"满意",
                judge3:"满意",
                judge4:"满意",
                tel:"",
                remark:"",
                type:"research"
            },
            thisRemark:false,
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
            var form =  $("#form-check");
            var self = this;
            form.validator({
                errorCallback: function (unvalidFields) {
                },
                after: function (e) {
                    if(self.form.remark.length==0){
                        self.thisRemark = true;
                        return false;
                    }
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
                    content:"评价成功!",
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
                judge1:"满意",
                judge2:"满意",
                judge3:"满意",
                judge4:"满意",
                tel:"",
                remark:"",
                type:"research"
            };
        }
    },
    watch:{
        //"interact.suid":function(){
        //    this.clearForm();
        //},
        "form.remark":function(val){
            var self = this;
            if(val.length>0){
                self.thisRemark = false;
            }else{
                self.thisRemark = true;
            }
        }
    },
    filters:{
        "isRemark":function(bool){
            var state = "";
            if(bool){
                state = "error";
            }
            return state;
        }
    },
    ready: function () {
        this.init();
    }
});