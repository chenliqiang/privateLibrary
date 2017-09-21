/**
 * Created by Chenliqiang on 2016/3/16.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
require("navbar/navbar.js");
require('components/filter/filter.js');

module.exports = Vue.extend({
    inherit:true,
    template:__inline("all.html"),
    data:function(){
        return {
            list:[]
        }
    },
    methods:{
        _getHref: function (id) {
            var d = this.list,target = {},url = "http://m.amap.com/?mk=";
            for(var i=0;i< d.length;i++){
                if(d[i]._id == id){
                    target = d[i];
                    d.splice(i,1);
                }
            }
            d.unshift(target);
            for(var i=0;i< d.length;i++){
                url+= d[i].lat+","+d[i].lng+","+d[i].name+"|"
            }
            return url;
        },
        toMap: function (id) {
            var href = this._getHref(id);
            window.location.href = href;
        },
        getDot:function(){
            var self = this,$scroll = mui(".mui-scroll-wrapper");
            self.auth.suid = self.dot.suid;
            var param = JSON.parse(JSON.stringify(self.auth));
            Service.getDot(param, function (data) {
                self.list = data;
                Vue.nextTick(function () {
                    $scroll.scroll();
                });
            })
        }
    },
    watch:{
        "dot.suid":function(){
            this.list = [];
            this.getDot();
        }
    },
    ready: function () {
        this.getDot();
    }
});