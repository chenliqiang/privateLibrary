/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m.js").layer;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("detail.html"),
    data:function(){
        return {
            content:""
        }
    },
    computed:{
        getDate: function () {
            if(this.news.date){
                var t = this.news.date;
                var year = t.substr(0,4) +"-";
                var month = t.substr(4,2) +"-";
                var day = t.substr(6,2);
                return year + month + day;
            }else{
                return "";
            }
        }
    },
    methods:{
        getDetail: function (id) {
            var self = this;
            var param = $.extend(JSON.parse(JSON.stringify(self.auth)),{id:id});

            Layer.open({
                content: "Мгдижа",
                type: 2,
                shadeClose: false,
                shade: false
            });
            Service.getDetail(param, function (rep) {
                self.content = rep.ct;
                Layer.closeAll();
                Vue.nextTick(function () {
                    $("TABLE").attr("width","100%");
                })
            })
        },
        imgFull: function () {
            $(".rich_content").delegate("img","click", function (e) {
                window.location.href = e.target.src;
            })
        }
    },
    watch:{
        "news.id": function (id) {
            this.content = [];
            this.getDetail(id);
        }
    },
    ready: function () {
        this.getDetail(this.news.id);
        this.imgFull();
    }
});