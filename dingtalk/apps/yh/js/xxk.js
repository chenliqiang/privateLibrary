$(function(){		
	$('.title-list li').mouseover(function(){
		var liindex = $('.title-list li').index(this);
		$(this).addClass('on').siblings().removeClass('on');
		$('.product-wrap div.product').eq(liindex).fadeIn(150).siblings('div.product').hide();
		var liWidth = $('.title-list li').width();
		$('.title-list p').stop(false,true).animate({'left' : liindex * liWidth + 'px'},300);
	});
	
	});

$(function(){		
	$('.title-list1 li').mouseover(function(){
		var liindex = $('.title-list1 li').index(this);
		$(this).addClass('on').siblings().removeClass('on');
		$('.product-wrap1 div.product1').eq(liindex).fadeIn(150).siblings('div.product1').hide();
		var liWidth = $('.title-list1 li').width();
		$('.title-list1 p').stop(false,true).animate({'left' : liindex * liWidth + 'px'},300);
	});
	
	});

$(function(){

	$("input[filed='dd']").each(function(i){
		$(this).bind("click",function(){

			var msgdata = {
				touser:"02471412139915|02492126519347",//曹鼎,陈莉强
				toparty:"",
				agentid:"18032301",
				msgtype:"text",
				"text":{
					content: $(this).parent().find("a").html()
				}
			}
			var param = $.extend({corpid:"ding4b41eb92ff23e86e"},{msgdata:msgdata});

			$.ajax({
				type: "POST",
				url: "http://weixin2.test.dlmeasure.com/duliang/1.1/dingtalk/message/send",
				data: JSON.stringify(param),
				dataType:"json",
				contentType:"application/json",
				success: function(rep){
					if(rep.Code == 0){
						if(rep.Response.errcode == 0){
							alert("发送成功");
						}else{
							alert("发送失败");
						}
					}else{
						alert("发送失败");
					}
				},
				error:function(err){
					alert("发送失败");
				}
			});

		})
	})

})
