/**
 * Created by Chenliqiang on 2016/3/9.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;
require('components/filter/filter.js');

module.exports = Vue.extend({
    inherit:true,
    template:__inline("listall.html"),
    data:function(){
        return {
            list:[],
            index:1,
            size:10
        }
    },
    methods:{
        getList: function () {
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{
                "target":"info",
                "index":self.index,
                "size":self.size,
                "stype":self.info.type
            });
            Service.getList(param, function (rep) {
                if(mui('#pullrefresh').length>0){
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(rep.length<self.size);
                }
                self.index +=1;
                for(var i in rep){
                    self.list.push(rep[i]);
                }
            })
        },
        getTime: function (t) {
            var year = t.substr(0,4) +"-";
            var month = t.substr(4,2) +"-";
            var day = t.substr(6,2);
            return year + month + day;
        },
        toDetail: function (news) {
            this.news.title = news.tl;
            this.news.date = news.dt;
            var router = new Router();
            router.setRoute("info/detail/"+news._id);
        }
    },
    watch:{
        //类型改变是重置上拉加载
        "info.type": function () {
            var self = this;
            self.list = [];
            self.index = 1;
            self.info.suid = "";//重置suid，选择其他水司时保证执行取数
            if(mui('#pullrefresh').length>0){
                mui('#pullrefresh').pullRefresh().refresh(true);
            }
            this.getList();
        },
        //水司改变是重置上拉加载
        "info.suid":function(){
            this.list = [];
            this.index = 1;
            if(mui('#pullrefresh').length>0){
                mui('#pullrefresh').pullRefresh().refresh(true);
            }
            this.getList();
        }
    },
    ready: function () {
        var self = this;
        mui.init({
            swipeBack: false,
            pullRefresh: {
                container: '#pullrefresh',
                up: {
                    contentrefresh: '正在加载...',
                    callback: function () {
                        self.getList();
                    }
                }
            }
        });
        self.getList();
    }
});