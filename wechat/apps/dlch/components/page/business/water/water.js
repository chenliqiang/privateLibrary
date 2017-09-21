/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("water.html"),
    data:function(){
        return {
            bindList:[],
            detail:{}
        }
    },
    events:{
        "refresh":function(){
            var self = this;
            self.getList();
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
            Layer.open({
                content: "加载中",
                type: 2,
                shadeClose: false,
                shade: false
            });
            Service.getFee(param, function (rep) {
                Layer.closeAll();
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