/**
 * Created by Chenliqiang on 2016/3/16.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;
var Router = require("component_modules/director").Router;

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
            this.table_height = (height - 110) + "px";
            this.query();
        },
        query:function(){
            var self = this;
            Layer.open({
                content: "查询中",
                type: 2,
                shadeClose: false
            });
            Service.query(self.water.cod,function(rep){
                Layer.closeAll();
                self.list = rep
            },function(e){
                Layer.closeAll();
                Layer.open({
                    content: '对不起，没有查询到相关用户的信息!',
                    shadeClose: false,
                    btn: ["确定"]
                });
            })
        }
    },
    watch:{
        "water.cod":function(){
            this.query();
        }
    },
    ready: function () {
        this.init();
    }
});