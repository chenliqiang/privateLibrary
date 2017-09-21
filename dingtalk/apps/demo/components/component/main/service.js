/**
 * Created by Chenliqiang on 2016/3/22.
 */

var prefix = "http://weixin2.test.dlmeasure.com";
//var prefix = "";

function valid(rep,callback,error){
    if(rep.Code == 0){
        return callback.call(this,rep.Response);
    }else{
        return error.call(this,rep);
        //alert(rep.Message);
        //WeixinJSBridge.call('closeWindow');
    }
}

function getjsapi(p,c,e){
    $.post(prefix +"/duliang/1.1/dingtalk/jsapi/getconfig",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}

function sendmsg(p,c,e){
    $.post(prefix +"/duliang/1.1/dingtalk/message/send",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}

function getuserauth(p,c,e){
    $.post(prefix +"/duliang/1.1/dingtalk/user/auth",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}

function getBindForm(p,c){
    $.post(prefix +"/duliang/1.1/wechat/binding/config",JSON.stringify(p), function (rep) {
        valid(rep,c)
    });
}


function bindUser(p,c){
    $.ajax({
        url:prefix +"/duliang/1.1/wechat/app/binding",
        data:JSON.stringify(p),
        dataType:"json",
        type:"POST",
        contentType:"application/json",
        async:false,
        success:function(rep){
            valid(rep,c)
        },
        error:function(e){

        }
    })
}

function GetQueryString(name,type)
{
    var target;
    if(type == "hash"){
        target =  window.location.hash.split("?")[1];
    }else{
        target = window.location.search.substr(1);
    }
    if(!target){
        return null;
    }
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = target.match(reg);
    if(r!=null)return  r[2]; return null;
}

module.exports = {
    GetQueryString:GetQueryString,
    getjsapi:getjsapi,
    sendmsg:sendmsg,
    getuserauth:getuserauth,
    bindUser:bindUser,
    getBindForm:getBindForm
};