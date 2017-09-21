/**
 * Created by jack on 2015/9/28.
 */

var Vue = require("component_modules/vue.js");
var Service = require("main/service.js");
var Router = require("component_modules/director.js").Router;

module.exports = Vue.extend({
    inherit:true,
    template:__inline("progress.html"),
    data:function(){
        return{
            form:{
                id:""
            },
            history:[]
        }
    },
    methods:{
        init:function(){
            this.validator();
            this.renderHistory("progress");
        },
        validator: function () {
            var form =  $("#form-progress");
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
            self.progress.id = self.form.id;
            var router = new Router();
            router.setRoute("/business/query/progress/detail");
        },
        bindDelete:function(id){
            this.delItem("progress", id);
            this.renderHistory("progress");
        },
        bindQuery:function(id){
            var self = this;
            self.progress.id = id;
            var router = new Router();
            router.setRoute("/business/query/progress/detail");
        },
        getItem: function (key) {
            return JSON.parse(localStorage.getItem(key) || "[]");
        },
        setItem: function (key, list) {
            localStorage[key] = JSON.stringify(list);
        },
        delItem: function (key, obj) {
            var list = this.getItem(key);
            if (list.length > 0) {
                var b = [];
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id != obj) {
                        b.push(list[i]);
                    }
                }
                this.setItem(key, b);
            }
        },
        renderHistory:function(key){
            this.history = this.getItem(key);
        }
    },
    events:{
        "progress-history-reload":function(){
            this.renderHistory("progress");
        }
    },
    ready: function () {
        this.init();
    }
});