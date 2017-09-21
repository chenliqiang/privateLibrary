/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
require("navbar/navbar.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("dot.html"),
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
        }
    },
    ready: function () {
        var self = this,$scroll = mui(".mui-scroll-wrapper");

        var param = JSON.parse(JSON.stringify(self.auth));
        param.type = "syzx";
        Service.getDot(param, function (data) {
            self.list = data;
            Vue.nextTick(function () {
                $scroll.scroll();
            });
        })
    }
});