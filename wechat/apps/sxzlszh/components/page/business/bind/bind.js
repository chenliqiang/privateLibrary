/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m.js").layer;
require('components/filter/filter.js');

module.exports = Vue.extend({
    inherit:true,
    template:__inline("bind.html"),
    data:function(){
        return {
            list:[]
        }
    },
    methods:{
        unbind: function (sn,suid) {
            var self = this;
            Layer.open({
                content:"确定解绑您的户号（"+sn+"）?",
                btn:["确定","取消"],
                yes: function () {
                    self.auth.suid = suid;
                    var param = JSON.parse(JSON.stringify(self.auth));
                    param.sn = sn;
                    Service.unBind(param, function (rep) {
                        Layer.closeAll();
                        //self.render();
                        self.$parent.$broadcast("bind-reload");
                    })
                },
                no: function () {
                    Layer.closeAll();
                },
                shadeClose:false
            })
        },
        render: function () {
            var self = this;
            self.auth.suid = self.suidlist;
            self.list = [];
            Layer.open({
                content: "加载中",
                type: 2,
                shadeClose: false,
                shade: false
            });
            Service.getBindList(self.auth, function (rep) {
                Layer.closeAll();
                var temlist = [];
                for(var i=0;i<rep.length;i++){
                    for(var k=0;k<rep[i].result.length;k++){
                        var tem = rep[i].result[k];
                        tem.suid = rep[i].suid;
                        temlist.push(tem);
                    }
                }
                self.list = temlist;
            })
        },
        doReload:function(){
            if($("#refresh").hasClass("mui-icon-refresh")){
                this.render();
            }
            $("#refresh").removeClass("mui-icon-refresh");
            $(".mui-spinner").show();
            setTimeout(function(){
                $(".mui-spinner").hide();
                $("#refresh").addClass("mui-icon-refresh");
            },2000)
        },
        reload: function () {
            this.render();
        }
    },
    events:{
        "bind-reload":function(){
            this.reload();
        }
    },
    ready: function () {
        this.render();
    }
});