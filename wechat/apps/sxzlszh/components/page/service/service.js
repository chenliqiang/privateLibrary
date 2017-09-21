/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
require("navbar/navbar.js");

module.exports = Vue.extend({
    inherit:true,
    template:__inline("service.html"),
    methods:{
        quit:function(){
            WeixinJSBridge.call('closeWindow');
        }
    },
    ready: function () {
    }
});