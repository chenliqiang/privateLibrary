
/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue");
var Service = require("main/service.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("month.html"),
    data:function(){
        return {
            sn:[],
            list:[],
            selectSn:"",
            hasQuery:false
        }
    },
    methods:{
        render: function () {
            this.getSn();
        },
        getSn: function () {
            var self = this;
            Service.getBindList(this.auth, function (rep) {
                var lst = [];
                if(rep.length > 0){
                    for (var i = 0; i < rep.length; i++) {
                        lst.push({text:rep[i].sn,value:rep[i].sn});
                    }
                    self.selectSn = lst[0].value;
                }
                self.sn = lst;
                self.hasQuery = true;
            })
        },
        getWater: function (sn) {
            var self = this;
            Service.getWater({
                openid:this.auth.openid,
                unionid:this.auth.unionid,
                app:this.auth.app,
                suid:this.auth.suid,
                sn:sn,
                st:"2015-01",
                et:"2015-12"
            }, function (rep) {
                self.list = rep;
            })
        }
    },
    watch:{
      "selectSn": function (sn) {
          this.getWater(sn);
      }
    },
    filters:{
        "format":function(time){
            return time.substring(0,7);
        }
    },
    ready: function () {
        this.render();
    }
});
