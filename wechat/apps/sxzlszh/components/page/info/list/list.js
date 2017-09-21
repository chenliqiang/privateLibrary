/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;
require('components/filter/filter.js');

module.exports = Vue.extend({
    inherit:true,
    template:__inline("list.html"),
    data:function(){
        return {
            list:[],
            index:1,
            size:2
        }
    },
    methods:{
        init:function(){
            this.getList();
        },
        getList: function () {
            var self = this;
            self.auth.suid = self.suidlist;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{
                "target":"info",
                "index":self.index,
                "size":self.size,
                "stype":self.info.type
            });
            Service.getList(param, function (rep) {
                self.list = rep;
            });
        },
        getTime: function (t) {
            var year = t.substr(0,4) +"-";
            var month = t.substr(4,2) +"-";
            var day = t.substr(6,2);
            return year + month + day;
        },
        toDetail: function (news,suid,name) {
            var self = this;
            self.news.title = news.tl;
            self.news.date = news.dt;
            self.news.name = name
            self.auth.suid = suid;
            var router = new Router();
            router.setRoute("info/detail/"+news._id);
        }
    },
    watch:{
        "info.type": function () {
            this.list = [];
            this.getList();
        }
    },
    ready: function () {
        this.init();
    }
});