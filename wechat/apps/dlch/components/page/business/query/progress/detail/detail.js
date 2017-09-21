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
            table_height:""
        }
    },
    methods:{
        init:function(){
            var height = document.documentElement.clientHeight;
            this.table_height = (height - 190) + "px";
            this.query();
        },
        query:function(){
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{target:"progress",id:self.progress.id});
            Service.query(param,function(rep){
                if(rep.length>0){
                    self.list = rep;
                    self.addItem("progress", {id: self.progress.id});
                    self.$parent.$broadcast("progress-history-reload");
                }
            },function(e){
                Layer.open({
                    content: "没有查询到数据",
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
                    if (list[i].id == obj.id) {
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
        "progress.id":function(){
            this.list = [];
            this.query();
        },
    },
    ready: function () {
        this.init();
    }
});