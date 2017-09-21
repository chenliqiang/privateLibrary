/**
 * Created by Chenliqiang on 2016/3/16.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;
var Router = require("component_modules/director").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("blowdown.html"),
    data:function(){
        return{
            bindlist:[],
            token:""
        }
    },
    methods:{
        init:function(){
            this.initDate();
            this.getBindList();
            this.validator();
        },
        initDate:function(){
            $("#blowdown-date").mobiscroll({
                preset: 'date',
                mode: 'clickpick',
                dateFormat: "yy",
                dateOrder: 'yy',
                setText: '确定',
                cancelText: '取消',
                dayText: '日', monthText: '月', yearText: '年',
                endYear: 2020,
                maxDate: new Date()
            }).val((new Date()).format("yyyy"));
        },
        validator: function () {
            var form =  $("#form-blowdown");
            var self = this;
            form.validator({
                errorCallback: function (unvalidFields) {
                },
                after: function (e) {
                    self.query();
                    return false;
                },
                isErrorOnParent: true
            })
        },
        query:function(){
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),
                {
                    Token:self.token,
                    Begin:$("#blowdown-date").val() + "-01-01",
                    End:$("#blowdown-date").val() + "-12-31",
                    target:"blowdown"
                });
            self.water.blowdown = param;
            var router = new Router();
            router.setRoute("/business/water/blowdown/detail");
        },
        getBindList:function(){//有新增绑定时此处需要同步
            var self = this;
            self.auth.suid = self.suid.sxps;
            self.bindlist = [];
            Service.getBindList(self.auth,function(rep){
                self.bindlist = rep;
                Vue.nextTick(function () {
                    $($("#cod-token").find("option")[0]).attr("selected",true);
                })
            })
        }
    },
    events:{
        "bind-reload":function(){
            this.getBindList();
        }
    },
    filters:{
        "extract":function(list){
            var self = this,tem= [];
            if(list.length>0){
                self.token = list[0].sn;
            }
            for(var i=0;i<list.length;i++){
                tem.push({ text:list[i].sn, value: list[i].sn });
            }
            return tem;
        }
    },
    ready: function () {
        this.init();
    }
});