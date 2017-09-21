/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("list.html"),
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
                mui('#pullrefresh').pullRefresh().endPullupToRefresh(rep.length<10);
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
        "info.type": function () {
            this.list = [];
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
                    contentrefresh: 'ÕýÔÚ¼ÓÔØ...',
                    callback: function () {
                        self.getList();
                    }
                }
            }
        });
        self.getList();
    }
});