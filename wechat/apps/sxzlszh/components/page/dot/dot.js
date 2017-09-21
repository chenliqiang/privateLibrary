/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
require("navbar/navbar.js");
require('components/filter/filter.js');

module.exports = Vue.extend({
    inherit:true,
    template:__inline("dot.html"),
    data:function(){
        return {
            list:[],
            index:1,
            size:2
        }
    },
    methods:{
        _getHref: function (id,suid) {
            var d = [],target = {},url = "http://m.amap.com/?mk=";
            for(var i=0;i<this.list.length;i++){
                if(this.list[i].suid == suid){
                    d = this.list[i].result;
                    break;
                }
            }
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
        toMap: function (id,suid) {
            var href = this._getHref(id,suid);
            window.location.href = href;
        }
    },
    ready: function () {
        var self = this,$scroll = mui(".mui-scroll-wrapper");
        self.auth.suid = self.suidlist;
        var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{index:self.index,size:self.size});
        Service.getDot(param, function (data) {
            self.list = data;
            Vue.nextTick(function () {
                $scroll.scroll();
            });
        })
    }
});