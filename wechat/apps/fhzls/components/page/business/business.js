/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
require("navbar/navbar.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("business.html"),
    methods:{
        pay:function(){
            var self = this;
            //var redirect_uri = "https%3a%2f%2fwww.dlmeasure.com";
            //if(self.debug){
            //    redirect_uri = "http%3a%2f%2fweixin2.test.dlmeasure.com";
            //}

            var payPage = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0fe5e72ab475542b&redirect_uri=" +
                "https%3a%2f%2fwww.dlmeasure.com%2Fstatic%2Fduliang%2Fweixin%2Fapps%2Fpay%2F%23%2Fpay%3Funionid%3D" +
                self.auth.unionid + "%26openid%3D" + self.auth.openid + "%26appid%3D" + self.appid + "%26suid%3D" + self.auth.suid +
                "&response_type=code&scope=snsapi_base&state=dl#wechat_redirect"

            window.location.href = payPage;
        }
    },
    ready: function () {

    }
});