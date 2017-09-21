/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
require("navbar/navbar.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("business.html"),
    //methods:{
    //    pay:function(){
    //        var self = this;
    //        var payPage = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx980f07d05dbf8d5d" +
    //                      "&redirect_uri=http%3a%2f%2fweixin2.test.dlmeasure.com%2fstatic%2fduliang%2fweixin%2fapps%2fpay%2f%23pay%3f" +
    //                      "unionid%3d"+ self.auth.unionid +"%26openid%3d" + self.auth.openid + "%26appid%3d" + self.appid + "%26suid%3d" + self.auth.suid +
    //                      "&response_type=code&scope=snsapi_userinfo" +
    //                      "&state=heda#wechat_redirect";
    //        window.location.href = payPage;
    //    }
    //},
    ready: function () {

    }
});