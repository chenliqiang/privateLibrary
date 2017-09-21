/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Router = require("component_modules/director").Router;
var Service = require("main/service.js");
var Layer = require("component_modules/layer.m").layer;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("loading.html"),
    methods:{
        init:function(){
            var self = this;
            if(self.debug){
                var router = new Router();
                router.setRoute("pay");
            }else{
                self.getAuth();
            }
        },
        getAuth:function(){
            var self = this,code = Service.GetQueryString("code",self.runing);
            self.appid = Service.GetQueryString("appid","mobile");
            self.auth.suid = Service.GetQueryString("suid","mobile");
            //获取当前公众号用户信息
            Service.getUserAuth({code:code,appid:self.appid}, function (rep) {
                if(rep.code != 0){
                    self.auth = JSON.parse(localStorage[self.appid]);
                }else{
                    self.auth.unionid = rep.auth.unionid;
                    self.auth.openid = rep.auth.openid;

                    localStorage[self.appid] = JSON.stringify(self.auth);

                    Service.bindUser({
                        unionid: self.auth.unionid,
                        openid: self.auth.openid,
                        suid: self.auth.suid,
                        app: "yhsl"
                    },function(rep){})
                }

                var authUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + self.pay.appid +
                                    "&redirect_uri=http%3a%2f%2fweixin2.test.dlmeasure.com%2fstatic%2fduliang%2fweixin%2fapps%2fpay%2f%23pay%3f" +
                                    "unionid%3d"+ self.auth.unionid +"%26openid%3d" + self.auth.openid + "%26appid%3d" + self.appid + "%26suid%3d" + self.auth.suid +
                                    "&response_type=code&scope=snsapi_base&state=heda#wechat_redirect";
                window.location.href = authUrl;
            });
        }
    },
    ready: function () {
        this.init();
    }
});