/**
 * Created by Chenliqiang on 2016/3/15.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("smeter.html"),
    data:function(){
        return{
            list:[]
        }
    },
    methods:{
        init:function(){
            this.getBindList();
        },
        getBindList:function(){
            var self = this;
            Service.getBindList(self.auth,function(rep){
                self.list = rep;
            })
        },
        search:function(){
            var self = this;
            self.smeter.type =$("#search-type").find("input:checked").data("type")
            self.smeter.sn = $("#sn-list").find("input:checked").data("sn").toString();
            var router = new Router();
            router.setRoute("/business/query/smeter/detail");
        }
    },
    events:{
        "bind-reload":function(){
            this.getBindList();
        }
    },
    filters:{
        "getChecked":function(index){
            var bool = false;
            if(index == 0){
                bool = true;
            }
            return bool;
        }
    },
    ready: function () {
        this.init();
    }
});