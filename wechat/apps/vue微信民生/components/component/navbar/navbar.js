/**
 * Created by jack on 2015/9/28.
 */


var Vue = require("component_modules/vue.js");
var Router = require("component_modules/director.js").Router;

module.exports = Vue.component("c-nav",{
   inherit:true,
    template:__inline("navbar.html"),
    props:["target"],
    methods:{
        onClick: function (url) {
            var router = new Router;
            router.setRoute("")
        }
    }
});