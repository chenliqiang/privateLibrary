/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
require("navbar/navbar.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("info.html"),
    data:function(){
        return {
            list:[]
        }
    },

    ready: function () {
        var self = this,$scroll = mui(".page-info");
        var param = JSON.parse(JSON.stringify(self.auth));
        param.type = "gsxx";
        Service.getTypes(param, function (data) {
            var list = [];
            for(var i=0;i<data.length;i+=2){
                var l = [];
                data[i]? l.push(data[i]):null;
                data[i+1]? l.push(data[i+1]):null;
                list.push(l);
            }
            self.list = list;
            Vue.nextTick(function () {
                $scroll.scroll();
            })
        })
    }
});