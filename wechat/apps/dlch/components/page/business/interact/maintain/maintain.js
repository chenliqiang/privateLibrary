/**
 * Created by Chenliqiang on 2016/3/15.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;
var Router = require("component_modules/director").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("maintain.html"),
    data:function(){
        return{
            bindList:[]
        }
    },
    methods:{
        init:function(){
            this.getBind();
        },
        getBind:function(){
            var self = this;
            Service.getBindList(self.auth,function(rep){
                self.bindList = rep;
            })
        }
    },
    watch:{
        "interact.suid":function(){
            var self = this;
            self.bindList = [];
            this.getBind();
        }
    },
    ready: function () {
        this.init();
    }
});