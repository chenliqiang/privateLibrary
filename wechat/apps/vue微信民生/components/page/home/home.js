/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Router = require("component_modules/director.js").Router;
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("home.html"),
    methods:{
        toDetail: function (news) {
            this.news.title = news.tl;
            this.news.date = news.dt;
            var router = new Router();
            router.setRoute("info/detail/"+news._id);
        }
    },
    ready: function () {
        var self = this;
        Service.getConfig(self.auth, function (config) {
            self.config = config;
            document.title = self.config.name;

            Vue.nextTick(function(){
                mui(".page-home").scroll();
                mui("#slider").slider({interval: 3000});
            })
        });
    }
});