/**
 * Created by Chenliqiang on 2016/3/9.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;
var Router = require("component_modules/director").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("interact.html"),
    methods:{
        getRouter:function(url,shuisi){
            var self = this;
            var _url = "/business/interact/";
            _url += url;
            switch(shuisi){
                case "sxzls":{
                    self.auth.suid = self.suid.sxzls;
                    self.interact.suid = self.suid.sxzls;
                }break;
                case "sxps":{
                    self.auth.suid = self.suid.sxps;
                    self.interact.suid = self.suid.sxps;
                }break;
            }
            var router = new Router();
            router.setRoute(_url);
        }
    },
    ready: function () {

    }
});