/**
 * Created by Chenliqiang on 2016/3/22.
 */


//var prefix = "http://weixin2.test.dlmeasure.com";
var prefix = "https://www.dlmeasure.com";
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

function getBindList(p,c){
    $.post(prefix +"/duliang/1.1/wechat/binding/list",JSON.stringify(p), function (rep) {
        valid(rep,c)
    });
}

function getFee(p,c){
    $.post(prefix +"/duliang/1.1/wechat/fee/detail",JSON.stringify(p), function (rep) {
        valid(rep,c)
    })
}

function getJSSDK1_1(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/jssdk1.1/getconfig",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}
function wxPay1_1(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/jssdk1.1/chooseWXPay",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
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

function getUserAuth(p,c) {
    $.ajax({
        url: prefix + "/duliang/1.1/wechat/user/auth",
        data: JSON.stringify(p),
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        async: false,
        success: function (rep) {
            valid(rep, c)
        },
        error: function (e) {
            //alert(JSON.stringify(e))
        }
    })
}


function GetQueryString(name,type)
{
    var target;
    if(type == "mobile"){
        target =  window.location.hash.split("?")[1];
    }
    else if(type == "wxtool"){
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
    getBindList:getBindList,
    bindUser:bindUser,
    getJSSDK1_1:getJSSDK1_1,
    wxPay1_1:wxPay1_1,
    getUserAuth:getUserAuth,
    getFee:getFee
};