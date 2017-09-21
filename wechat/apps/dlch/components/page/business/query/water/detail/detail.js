/**
 * Created by Chenliqiang on 2016/3/15.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m.js").layer;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("detail.html"),
    data:function(){
        return{
            list:[],
            table_height:"",
            title:""
        }
    },
    methods:{
        init:function(){
            var height = document.documentElement.clientHeight;
            this.table_height = (height - 100) + "px";
            this.query();
        },
        query:function(){
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{pwd:self.qu_water.pwd,id:self.qu_water.sn,target:"water"});
            Service.query(param,function(rep){
                if(rep.length>0){
                    self.title = rep[0].station;
                    self.addItem("water", {sn: self.qu_water.sn, pwd: self.qu_water.pwd});
                    self.$parent.$broadcast("water-history-reload");
                    self.list = rep;
                }
            },function(e){
                Layer.open({
                    content: "非常抱歉，贵户尚未安装远传类型水表，未能提供查询服务",
                    btn: ['确认'],
                    shadeClose: false
                })
            })
        },
        getItem: function (key) {
            return JSON.parse(localStorage.getItem(key) || "[]");
        },
        setItem: function (key, list) {
            localStorage[key] = JSON.stringify(list);
        },
        addItem: function (key, obj) {
            var list = this.getItem(key);
            if (list.length > 0) {
                var b = false;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].sn == obj.sn) {
                        b = true;
                    }
                }
                if (!b) {
                    list.push(obj);
                    this.setItem(key, list);
                }
            } else {
                list.push(obj);
                this.setItem(key, list);
            }
        }
    },
    watch:{
        "qu_water.sn":function(){
            this.list = [];
            this.query();
        },
        "qu_water.pwd":function(){
            this.list = [];
            this.query();
        }
    },
    ready: function () {
        this.init();
    }
});