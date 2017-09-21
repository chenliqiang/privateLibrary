/**
 * Created by jack on 2015/9/28.
 */


//var prefix = "http://weixin2.test.dlmeasure.com";
var prefix = "http://lq1248374924.eicp.net";

function valid(rep,callback,error){
    if(rep.Code == 0){
        return callback.call(this,rep.Response);
    }else{
        return error.call(this,rep);
        //alert(rep.Message);
        //WeixinJSBridge.call('closeWindow');
    }
}

function getJSSDK(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/jssdk1.1/getconfig",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    },"json")
}

function wxpaytest(p,c,e){
    $.post(prefix +"/duliang/1.1/wechat/jssdk1.1/wxpaytest",JSON.stringify(p), function (rep) {
        valid(rep,c, e)
    },"json")
}

module.exports = {
    getJSSDK:getJSSDK,
    wxpaytest:wxpaytest
};