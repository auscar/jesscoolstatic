
function imgCollect(){
	var $article_body = $(".articleBox"),
		imgs = $article_body.find("img[src^='http://s.jesscool.com/upload/']"),
		s_time = 0,
		$body = $('body'),
		imgUrl = "";
	
	//add collectTips
	$body.append('<div class="imgCollectTips"><div class="imgCollectTips_text">我要收藏此图片！</div><div class="imgCollectTips_bg"></div></div>');
	var $imgCollectTips = $('.imgCollectTips'),
		$imgCollectTips_text = $(".imgCollectTips_text"),
		$imgCollectTips_bg = $(".imgCollectTips_bg");
	$imgCollectTips_bg.css({
		'opacity':'0.5',
		'backgroundColor':'#000000'
	});
	
	imgs.hover(function(){//alert('Hover status is OK');
		clearTimeout(s_time);
		var imgPosition = getImgPosition(this);
		//alert('imgTop= ' + $(this).offset().top);
		//alert('imgPosition.x= ' + imgPosition.x + ' imgPosition.y= ' + imgPosition.x);
		$imgCollectTips.css({
			'width': $(this).width() + 'px',
			'left': imgPosition.x,
			'top': imgPosition.y + 'px'
		}).stop(true,true).fadeIn();
		imgUrl = $(this).attr("src");
		imgUrl = imgUrl.substring(imgUrl.lastIndexOf('/')+1); 
	},function(){
		s_time = setTimeout(clearImgTips,200);
	});
	
	$imgCollectTips.hover(function(){
		  clearTimeout(s_time);
	  },function(){
		  s_time = setTimeout(clearImgTips,200);
	}).click(function(){
		var $dialogContent = $('<div class="dialogContent_div"><p class="dialogContent_input"><input type="text" id="dialogInput" name="dialogInput" value="新分类名称" /> (可填直接写新类别)</p><ul class="dialogContent_ul clearFloat"></ul><p class="dialogContent_btm"><input type="submit" id="imgCollectSubmit" value="保存图片" /></p></div>');
			$dialogContent_ul = $dialogContent.find("ul.dialogContent_ul"),
			$dialogInput = $dialogContent.find("input#dialogInput"),
			$imgCollectSubmit = $dialogContent.find("input#imgCollectSubmit");
			
			$dialogInput.focus(function(){
				if($(this).val() == this.defaultValue){
					$(this).val('');
				}
			}).blur(function(){
				if($(this).val() == '' || $(this).val() == this.defaultValue){
					$(this).val(this.defaultValue);
				}
			});
			
			$.ajax({
				type:"post",
				url:"getAllImgTag.do",
				dataType:"json",
				success:function(imgTag_lis){
					if(imgTag_lis.isLogin && imgTag_lis.isLogin == "no"){ 
						$dialogContent_ul.html('<li class="loginLi">抱歉，您还未登录,</li>'
											  +'<li class="loginLi">请先<a href="/views/userLogin.jsp"> <span>登录</span> </a>！</li>');
						$imgCollectSubmit.hide();
						return; 
					}
			
					
					//var obj = {"Ary":[{"imgTagId":"34","imgTagName":"新类别"}]};

					var tagAry = imgTag_lis['Ary'];
					if(tagAry != undefined){
						imgTag_lis = "";
						for(var i = 0; i < tagAry.length; i++){
//						    alert("imgTagId=" + tagAry[i]['imgTagId']);
//						    alert("imgTagName=" + tagAry[i]['imgTagName']);
						    imgTag_lis += "<li class='dialogContent_li' tagId='" + tagAry[i]['imgTagId'] + "'>" + tagAry[i]['imgTagName'] + "</li>";
						}
					}
					
					if(imgTag_lis.isEmpty && imgTag_lis.isEmpty == "yes"){
						imgTag_lis = "<li>您尚未添加任何分类</li>";
					}
					
					$dialogContent_ul.html(imgTag_lis);
					$dialogContent_ul.find("li").click(function(){
						$(this).addClass("selected").siblings().removeClass("selected");
						$dialogInput.val($(this).text());
					});
					$imgCollectSubmit.click(function(){
						//判断用户是否填写新类别名称
						if($dialogInput.val() == ""){
							alert("请填写类别名称或选择已有分类！");
							return false;
						}
						
						var $dialogLiSelected = $dialogContent_ul.find("li.selected"),
							tagId = 0,
							tagName = "";
						if($dialogLiSelected && $dialogLiSelected.text() == $dialogInput.val()){ //用户没有新增分类
							tagId = $dialogLiSelected.attr("tagId");
						}else{  //所选li的值与填写的不一致，说明用户添加了分类
							tagName = $dialogInput.val()
						}
						//alert("tagName= "+tagName);
						//alert("imgName= "+ imgUrl);
						$.ajax({
							type:"post",
							url:"imgCollect.do",
							data:{"tagId":tagId,"tagName":tagName,"imgName":imgUrl},
							dataType:"html/text",
							success:function(){
								var $successTip = $(".successTip");
								//If IE6
								/*if(location.userAgent.indexOf("MSIE 6.0") != -1){
									alert(图片收藏成功！);
								}*/
								//Not IE6
								if($successTip.size() != 0){
									$successTip.show();
								}else{
									var $successTip = $('<div class="successTip"><div class="successTip_text">图片收藏成功！</div><div class="successTip_bg"></div></div>'),
										$successTip_bg = $successTip.find(".successTip_bg");
									$successTip_bg.css({"opacity":"0.5"});
									$successTip.appendTo($("body"));
								}
								$(".boxy-wrapper").remove();
								setTimeout(function(){ $successTip.fadeOut() },3000);
								//alert("图片收藏成功！");
							},
							error:function(){
								alert("抱歉，该图片暂时无法收藏！");
							}
							
						});
					});	
				},
				error:function(){
					alert("Error");
					$dialogContent_ul.html("<li>您尚未添加分类</li>");
				}
			});
			
			
		
		new Boxy($dialogContent, {title: "收藏图片"});
	});
	
	
	function getImgPosition(obj){
		var imgPosition = {};
		imgPosition.x = $(obj).offset().left;
		imgPosition.y = $(obj).offset().top;
		return imgPosition;
	}
	
	function clearImgTips(){
		$imgCollectTips.stop(true,true).fadeOut();
	}
}	
		



