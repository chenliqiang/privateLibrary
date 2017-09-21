/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Router = require("component_modules/director.js").Router;
var Service = require("main/service.js");

module.exports = Vue.extend({
    template:__inline("home.html"),
    data:function(){
        return {
            config:{}
        }
    },
    methods:{
        toDetail: function (news) {
            this.news.title = news.tl;
            this.news.date = news.dt;
            var router = new Router();
            router.setRoute("info/detail/"+news._id);
        }
    },
    ready: function () {
        var self = this,param = window.appstore.auth;
        Service.getConfig(param, function (config) {
            self.config = config;
            window.appstore.edit_config(config);
            document.title = config.name;
            Vue.nextTick(function(){
                mui(".page-home").scroll();
                mui("#slider").slider({interval: 3000});
            })
        });
    }
});