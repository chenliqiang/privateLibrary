/**
 * Created by Chenliqiang on 2016/3/15.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m.js").layer;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("detail.html"),
    data:function(){
        return{
            list:[],
            msg:"",
            table_height:""
        }
    },
    methods:{
        init:function(){
            var self = this;
            var height = document.documentElement.clientHeight;
            self.table_height = (height - 190) + "px";
            self.initMsg(self.smeter.type);
            self.query();
        },
        query:function(){
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{target:self.smeter.type,sn:self.smeter.sn});
            Service.query(param,function(rep){
                if(rep.length>0){
                    self.list = rep;
                }
            },function(e){
                Layer.open({
                    content: "非常抱歉，贵户尚未安装远传类型水表，未能提供查询服务",
                    btn: ['确认'],
                    shadeClose: false
                })
            })
        },
        initMsg:function(type){
            var self = this;
            switch(type){
                case "watermonth":{
                    self.msg = "";
                }break;
                case "waterdetail":{
                    self.msg = "您所查询的用户不存在或暂未实现日水量抄见"
                }break;
            }
        }
    },
    watch:{
        "smeter.type":function(){
            var self = this;
            self.initMsg(self.smeter.type);
            self.list = [];
            self.query();
        },
        "smeter.sn":function(){
            this.list = [];
            this.query();
        }
    },
    ready: function () {
        this.init();
    }
});