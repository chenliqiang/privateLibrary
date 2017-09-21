/**
 * Created by Chenliqiang on 2016/3/15.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;
var Layer = require("component_modules/layer.m.js").layer;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("water.html"),
    data:function(){
        return{
            form:{
                sn:"",
                pwd:""
            },
            history:[]
        }
    },
    methods:{
        init:function(){
            this.validator();
            this.renderHistory("water");
        },
        validator: function () {
            var form =  $("#form-water");
            var self = this;
            form.validator({
                errorCallback: function (unvalidFields) {
                },
                after: function (e) {
                    self.query();
                    return false;
                },
                isErrorOnParent: true
            })
        },
        check:function(){
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{pwd:self.qu_water.pwd,id:self.qu_water.sn,target:"water"});
            Service.query(param,function(rep){
                if(rep.length>0){
                    var router = new Router();
                    router.setRoute("/business/query/water/detail");
                }else{
                    Layer.open({
                        content: "非常抱歉，贵户尚未安装远传类型水表，未能提供查询服务",
                        btn: ['确认'],
                        shadeClose: false
                    })
                }
            },function(e){
                Layer.open({
                    content: "非常抱歉，贵户尚未安装远传类型水表，未能提供查询服务",
                    btn: ['确认'],
                    shadeClose: false
                })
            })
        },
        query:function(){
            var self = this;
            self.qu_water.sn = self.form.sn.toString();
            self.qu_water.pwd = self.form.pwd;
            self.check();
        },
        bindDelete:function(sn){
            this.delItem("water", sn);
            this.renderHistory("water");
        },
        bindQuery:function(sn,pwd){
            var self = this;
            self.qu_water.sn = sn.toString();
            self.qu_water.pwd = pwd;
            self.check();
        },
        getItem: function (key) {
            return JSON.parse(localStorage.getItem(key) || "[]");
        },
        setItem: function (key, list) {
            localStorage[key] = JSON.stringify(list);
        },
        delItem: function (key, obj) {
            var list = this.getItem(key);
            if (list.length > 0) {
                var b = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].sn != obj) {
                        b.push(list[i]);
                    }
                }
                this.setItem(key, b);
            }
        },
        renderHistory:function(key){
            this.history = this.getItem(key);
        }
    },
    events:{
        "water-history-reload":function(){
            this.renderHistory("water");
        }
    },
    ready: function () {
        this.init();
    }
});