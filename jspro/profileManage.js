
(function(){
	
	$(function(){
		//script for menu
		var $articleType = $("#articleType"),
			$articleType_li = $articleType.find("li"),
			$editAndDel = $('<div id="imgTagEditAndDel"><img src="http://s.jesscool.com/imgpro/delete.gif" class="imgTagDelBtm" alt="删除" /><img src="http://s.jesscool.com/imgpro/edit.gif" class="imgTagEditBtm" alt="编辑" /></div>'),
			$imgTagDelBtm = $editAndDel.find(".imgTagDelBtm"),
			$imgTagEditBtm = $editAndDel.find(".imgTagEditBtm"),
			time_editAndDel = 0;
		$editAndDel.appendTo($("body"));
		
		$articleType_li.hover(function(){
			//追加到当前对象
			$editAndDel.appendTo($(this)).show().click(function(){ $(this).hide(); });
		},function(){
			$editAndDel.hide();
		});
		
		
		//删除、编辑功能
			$imgTagDelBtm.click(function(){
				var com_imgTagDel = confirm("真的要删除该分类吗?"),
					$thisLi = $(this).parents("li");
					imgTagId = $thisLi.find(" > a").attr("tagId");
					
				if(com_imgTagDel){
					$editAndDel.appendTo($("body"));
					$.ajax({
						type:"post",
						url:"deleteTag.do",
						data:{"imgTagId":imgTagId},
						dataType:"html/text",
						cache:false,
						beforeSend:function(){
							//add waiting imgUrl
						},
						success:function(){
							//清空数组中当前tag的内容
							for(var li in menuShowAry){
								if(menuShowAry[li] == $thisLi[0]){
									menuShowAry.splice(li,1);
								}
							}
							//删除当前类比后，显示下一个Tag的内容
							if($thisLi.next()){
								$thisLi.next().find(" > a").trigger("click");
							}else{
								$imgBox_div.empty();
							}
							//清空页面上对应的内容
							$thisLi.remove();
						},
						error:function(){
							alert("抱歉，删除失败！");
						}
					});
				}
			});
			$imgTagEditBtm.click(function(){
				var $thisLi = $(this).parents("li"),
					$imgTagText_a = $thisLi.find(" > a");
					$imgTagText_div = $thisLi.find(" > div"),
					imgTagId = $imgTagText_a.attr("tagId");
				$imgTagText_a.hide();
				$imgTagText_div.hide();
				$thisLi.append('<input type="text" id="imgBox_h2_input" name="imgBox_h2_input" value="'+ $imgTagText_a.text() +'">');
				$imgBox_h2_input = $("#imgBox_h2_input");
				$imgBox_h2_input.focus().blur(function(){
					imgTagText = $imgBox_h2_input.val();
					
					if( imgTagText != $imgTagText_a.text()){
						$.ajax({
							type:"post",
							url:"updateImgTag.do",
							data:{"imgTagId":imgTagId,"imgTagName":imgTagText},
							dataType:"html/text",
							cache:false,
							beforeSend:function(){
								//add waiting imgUrl
							},
							success:function(){
								$imgTagText_a.find('span').html(imgTagText);
								if($thisLi.hasClass("selected")){
									$imgBox_h2_m.html(imgTagText);
								}
							},
							error:function(){
								alert("抱歉，更新失败！");
							}
						});
					}
					
					$imgBox_h2_input.remove();
					$imgTagText_a.show();
					//$imgTagText_div.show();
				});
			});
			
			
			
			//script for detialText img
			var $detialText = $(".detialText"),
				$detialText_imgs = $detialText.find("img");
			
			$detialText_imgs.each(function(){
				$(this).wrap("<div class='imgWrap'></div>");
				var $imgWrap = $(this).parent();
				$imgWrap.append("<img src='http://s.jesscool.com/imgpro/delete.gif' class='imgOperation' />");
				$(".imgOperation").css({"left":$(this).width() + "px"});	
			});
			
			
			//script for removing img
			$detialText.find('.imgWrap').each(function(){
				var	$imgDelTip = $(this).find(".imgOperation"),
					$thisImg = $(this).find("img").not(".imgOperation");
				$imgDelTip.click(function(){
					var imgId = $thisImg.attr('imgId');
					var com_imgDel = confirm('真的要删除这张图片吗？');
					if(com_imgDel){
						$.ajax({
							type:'post',
							url:'deleteImg.do',
							data:{'imgId':imgId},
							dataType:"html/text",
							cache:false,
							success:function(){
								$thisImg.parent().slideUp();
							},
							error:function(){
								alert("抱歉，无法删除该图片！");
							}
						});
					}
				});
			});
		
		
	});
		
})(jQuery);
