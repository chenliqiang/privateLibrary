/**
 * Created by Chenliqiang on 2016/4/18.
 */

window.appstore = {
    appid:"wx8e3f800a1ec51085",
    auth:{
        openid:"",
        unionid:"",
        suid:"",
        app:"yhsl"
    },
    info:{
        name:"",
        type:""
    },
    news:{
        id:"",
        title:"",
        date:""
    },
    config:{
    },
    edit_auth:function(obj){
        this.auth.openid = obj.openid;
        this.auth.unionid = obj.unionid;
        this.auth.suid = obj.suid;
        //window.app.$broadcast("detailId-change",detailid);
    },
    edit_config:function(obj){
        this.config = obj;
    }
}