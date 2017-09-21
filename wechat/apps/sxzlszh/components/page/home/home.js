/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Router = require("component_modules/director.js").Router;
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("home.html"),
    data:function(){
        return {
            carousel:[
                {
                    src:""
                }
            ],
            tel:"",
            content:[]
        }
    },
    methods:{
        toDetail: function (news) {
            var self = this;
            self.info.name = news.subtypnm;
            self.news.title = news.tl;
            self.news.date = news.dt;
            self.auth.suid = news.suid;
            var router = new Router();
            router.setRoute("info/detail/"+news._id);
        }
    },
    ready: function () {
        var self = this;
        self.auth.suid = self.suidlist;
        Service.getConfig(self.auth, function (config) {
            var tem = [];
            for(var i=0;i<config.length;i++){
                if(config[i].suid == self.suid.sxzls){
                    self.carousel = config[i].result.carousel;
                    self.tel = config[i].result.tel;
                    document.title = config[i].result.name;
                }

                for(var j=0;j< config[i].result.content.length;j++){
                    config[i].result.content[j].suid = config[i].suid;
                    tem.push(config[i].result.content[j]);
                    tem.sort(function(a,b){
                        return b.dt - a.dt;
                    })
                }
            }
            for(var i=0;i<5;i++){
                self.content.push(tem[i]);
                self.content.sort(function(a,b){
                    return b.dt - a.dt;
                })
            }
            Vue.nextTick(function(){
                mui(".page-home").scroll();
                mui("#slider").slider({interval: 3000});
            })
        });
    }
});