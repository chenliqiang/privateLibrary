/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
require("navbar/navbar.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("custom.html"),
    data:function(){
        return {
            list:[]
        }
    },
    ready: function () {
        var self = this,$scroll = mui(".page-custom");
        self.auth.suid = self.suid.sxzls;
        var param = JSON.parse(JSON.stringify(self.auth));
        param.type = "wsh";
        Service.getTypes(param, function (data) {
            var list = [];
            if(data.length>0){
                for(var i=0;i<data.length;i++)
                    data.sort(function(a,b){
                        return b.order - a.order;
                    })
                for(var i=1;i<Math.round(data[0].order);i++){
                    var l = [];
                    for(var j=0;j<data.length;j++){
                        if(data[j].order == (i*2-1) || data[j].order == (i*2)){
                            l.push(data[j]);
                            l.sort(function(a,b){
                                return a.order - b.order;
                            })
                        }
                    }
                    if(l.length>0){
                        list.push(l);
                    }
                }
            }
            //for(var i=0;i<data.length;i+=2){
            //    var l = [];
            //
            //    data[i].order == (i+1)? l.push(data[i]):null;
            //    data[i+1].order == (i+2)? l.push(data[i+1]):null;
            //    list.push(l);
            //}
            self.list = list;
            Vue.nextTick(function () {
                $scroll.scroll();
            });
        })
    }
});