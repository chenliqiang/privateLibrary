/**
 * Created by jack on 2015/9/28.
 */


var prefix = "http://weixin2.test.dlmeasure.com";
//var prefix = "https://www.dlmeasure.com";
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

function getConfig(p,c){
    $.post(prefix +"/duliang/1.1/wechat/config",JSON.stringify(p), function (rep) {
        valid(rep,c)
    });
}

function getTypes(p,c){
    $.post(prefix +"/duliang/1.1/wechat/content/types",JSON.stringify(p), function (rep) {
        valid(rep,c)
    });
}

function getBindForm(p,c){
    $.post(prefix +"/duliang/1.1/wechat/binding/config",JSON.stringify(p), function (rep) {
        valid(rep,c)
    });
}

function getBindList(p,c){
    $.post(prefix +"/duliang/1.1/wechat/binding/list",JSON.stringify(p), function (rep) {
        valid(rep,c)
    });
}

function unBind(p,c){
    $.post(prefix+"/duliang/1.1/wechat/unbinding",JSON.stringify(p), function (rep) {
        valid(rep,c)
    });
}

function bind(p,c,error){
    $.post(prefix+"/duliang/1.1/wechat/binding",JSON.stringify(p), function (rep) {
        valid(rep,c,error)
    });
}

function business(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/business",JSON.stringify(p), function (rep) {
        valid(rep,c,e)
    })
}

function report(p,c){
    $.post(prefix +"/duliang/1.1/wechat/report",JSON.stringify(p), function (rep) {
        valid(rep,c)
    })
}

function getList(p,c){
    $.post(prefix +"/duliang/1.1/wechat/content/list",JSON.stringify(p), function (rep) {
        valid(rep,c)
    })
}


function getDetail(p,c){
    $.post(prefix +"/duliang/1.1/wechat/content/detail",JSON.stringify(p), function (rep) {
        valid(rep,c)
    })
}


function getFee(p,c){
    $.post(prefix +"/duliang/1.1/wechat/fee/detail",JSON.stringify(p), function (rep) {
        valid(rep,c)
    })
}


function getDot(p,c){
    $.post(prefix +"/duliang/1.1/wechat/station/list",JSON.stringify(p), function (rep) {
        valid(rep,c)
    })
}

function getJSSDK(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/jssdk1.1/getconfig",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}

function wxPay(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/jssdk/chooseWXPay",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}

function wxPay1_1(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/jssdk1.1/chooseWXPay",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}

function verfiy(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/sn/verfiy",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}

function verfiySMS(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/sn/sms/send",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    })
}

function query(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/query",JSON.stringify(p), function (rep) {
        valid(rep,c,e)
    })
}

function feeback(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/feeback",JSON.stringify(p), function (rep) {
        valid(rep,c,e)
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


function getUserInfo(p,c){
    $.ajax({
        url:prefix +"/duliang/1.1/wechat/user/info",
        data:JSON.stringify(p),
        dataType:"json",
        type:"POST",
        contentType:"application/json",
        async:false,
        success:function(rep){
            valid(rep,c)
        },
        error:function(e){
            //alert(JSON.stringify(e))
        }
    })

    /*
     $.post(prefix +"/duliang/1.1/wechat/user/info",JSON.stringify(p), function (rep) {
     valid(rep,c)
     })*/
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
    getConfig:getConfig,
    getTypes:getTypes,
    getBindForm:getBindForm,
    getBindList:getBindList,
    unBind:unBind,
    bind:bind,
    business:business,
    report:report,
    getList:getList,
    getDetail:getDetail,
    getFee:getFee,
    getDot:getDot,
    getUserInfo:getUserInfo,
    GetQueryString:GetQueryString,
    bindUser:bindUser,
    getJSSDK:getJSSDK,
    wxPay:wxPay,
    wxPay1_1:wxPay1_1,
    verfiy:verfiy,
    verfiySMS:verfiySMS,
    query:query,
    feeback:feeback
};