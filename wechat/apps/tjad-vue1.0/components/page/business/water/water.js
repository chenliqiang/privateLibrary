/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("water.html"),
    data:function(){
        return {
            bindList:[],
            detail:{}
        }
    },
    methods:{
        getList: function () {
            var self = this;
            Service.getBindList(this.auth, function (rep) {
                self.bindList = rep;

                if(rep.length > 0){
                    self.getFee(rep[0].sn);
                }
            })
        },
        getFee: function (sn) {
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{sn:sn});
            Service.getFee(param, function (rep) {
                self.detail = rep;
            })
        },
        select: function (sn) {
            this.getFee(sn);
            $(".mui-popover").removeClass("mui-active").hide();
            $(".mui-backdrop").remove();
        },
        getDate: function (v) {
            var o = v.split("--");
            if(o.length>1&&o[0] == o[1]){
                return o[0];
            }else{
                return v;
            }
        }
    },
    ready: function () {
        this.getList();
    }
});