/**
 * Created by Chenliqiang on 2016/3/22.
 */

var Vue = require("component_modules/vue");
var Router = require("component_modules/director").Router;
var loading = require("components/page/loading/loading");
var FastClick = require("component_modules/fastclick");
require("main/store.js");

window.app = new Vue({
    el:"#app",
    data:{
        currentView:"loading",
        title:"钉钉"
    },
    components:{
        "loading":loading
    },
    ready:function(){
        FastClick.FastClick.attach(document.body);
    }
});

function doRouter(target,page){
    var coms = window.app.$options.components;
    if(!coms[target]){
        coms[target] = page;
    }
    window.app.$data.currentView = target;
}

var routes = {
    "/home":function(){
        require.async(["components/page/home/home"], function (p) {
            doRouter("home",p);
        })
    },
    "/loading":function (){
        require.async(["components/page/loading/loading"], function (p) {
            doRouter("loading",p);
        })
    },
    "/apps":function (){
        require.async(["components/page/apps/apps"], function (p) {
            doRouter("apps",p);
        })
    },
    "/bind":function (){
        require.async(["components/page/bind/bind"], function (p) {
            doRouter("bind",p);
        })
    }
};

var router = new Router(routes);

router.init("/bind");




