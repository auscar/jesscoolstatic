
(function($){
	
	var imgManager = {
		changeImg: function(tagId){
			$.ajax({
				type:'post',
				url:'changeImg.do',
				data:{'tagId':tagId},
				cache:false,
				beforeSend:function(){
					view.detailText.html( '<img class="loading" src="http://s.jesscool.com/imgpro/wait.gif" />' );
				},
				success: function(data){
					view.renderImg(data);
					view.bindDragAndDrop();
					view.bingImgDel();
				},
				error: function(){
					alert( '抱歉，请求出错！' );
				}
			});
		},
		delImgTag: function(imgTagId,currentObj){
			$.ajax({
				type:'post',
				url:'deleteTag.do',
				data:{"imgTagId":imgTagId},
				cache:false,
				success: function(){
					view.clickNextTag(currentObj);
				},
				error: function(){
					//alert( '抱歉，无法删除该图片！' );
				}
			});
		},
		updateTag: function(imgTagId,imgTagText,currentObj){
			$.ajax({
				type:'post',
				url:'updateImgTag.do',
				data:{"imgTagId":imgTagId,"imgTagName":imgTagText},
				cache:false,
				success: function(){
					currentObj.html(imgTagText);
				},
				error: function(){
					//alert( '抱歉，无法删除该图片！' );
				}
			});
		},
	}
	
	var view = {
		init: function(){
			this.getUIRef();
			this.bindEvent();
			this.renderInit();
			this.bindDragAndDrop();
		},
		getUIRef: function(){
			this.imgNav1_ul = $( '#articleType' );
			this.imgNav1_li = $( '#articleType > li' );
			this.detailText = $( '#detailText' );
			this.editAndDel = $('<div id="imgTagEditAndDel"><img src="http://s.jesscool.com/imgpro/delete.gif" class="imgTagDelBtm" alt="删除" /><img src="http://s.jesscool.com/imgpro/edit.gif" class="imgTagEditBtm" alt="编辑" /></div>');
			this.imgTagDelBtm = this.editAndDel.find(".imgTagDelBtm");
			this.imgTagEditBtm = this.editAndDel.find(".imgTagEditBtm");
		},
		bindEvent: function(){
			view.imgNav1_li.find( 'a' ).click(function(){
				imgManager.changeImg($(this).attr( 'tagId' ));
				$(this).addClass( 'selected' ).siblings().removeClass( 'selected' );
			});
			view.imgNav1_li.hover(function(){
				//追加到当前对象
				view.editAndDel.appendTo($(this)).show().click(function(){ $(this).hide(); });
			},function(){
				view.editAndDel.hide();
			});
			view.imgTagDelBtm.click(function(){
				var sureToDel = confirm("真的要删除该分类吗?");
				if(sureToDel){
					imgManager.delImgTag( $(this).parents('li').find(' > a').attr('tagId'), $(this).parents('li.imgNav1_li') );
				}
			});
			view.imgTagEditBtm.click(function(){
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
						imgManager.updateTag(imgTagId,imgTagText,$imgTagText_a);
					}
					$imgBox_h2_input.remove();
					$imgTagText_a.show();
				});
			});
			
		},
		bindDragAndDrop : function(){
			var $imgs = $('#detailText img[src^="http://s.jesscool.com/upload/"]'); 
			$imgs.draggable({
		    	revert: true,
		    	helper: 'original',
		    	start:function(){
					img = $(this);
					var imgUrl = img.attr("src");
					img.imgId = img.attr("imgId");
					img.imgName = imgUrl.substring(imgUrl.lastIndexOf('/')+1);
					img.css({'opacity':'0.5'});
		    	},
		    	stop:function(){
		    		$(this).css({'opacity':'1'});
		        }
		    });
			this.imgNav1_li.droppable({
			    drop: function() { 
					var isSure = confirm('真的要将此图片移动到"' + $(this).text() + '"分类下吗');
					if(isSure){ //sure fo move
						$.ajax({
							type:'post',
							url:'updateImg.do',
							data:{'imgTagId':$(this).find("a").attr('tagId'),'imgId':img.imgId},
							dataType:"html/text",
							cache:false,
							beforeSend:function(){
								//add waiting imgUrl
							},
							success:function(){
								//$(this).trigger("click");
								img.parent().slideUp();
							},
							error:function(){
								alert("抱歉，更新失败！");
							}
						});
					}
				},
			    hoverClass: 'dropHover',
			    tolerance: 'pointer'
		    });
		},
		renderImg: function(data){
			view.detailText.html(data);
		},
		clickNextTag: function(currentObj){
			//删除当前类比后，显示下一个Tag的内容
			if(view.imgNav1_li){
				currentObj.slideUp(function(){
					if($(this).next().size() != 0){
						$(this).next().find(" > a").trigger("click");
					}else{
						$(this).prev().find(" > a").trigger("click");
					}
					$(this).find(' > div').appendTo($('body'));
					$(this).remove();
					if($('#articleType > li').size() == 0){
						view.detailText.empty();
						view.imgNav1_ul.html( '<li>您还没有添加分类呢！</li>' );
					}
				});
			}
		},
		bingImgDel : function(){
			//script for detialText img
			var $detialText = $("#detailText"),
				$detialText_imgs = $detialText.find("img");
			//script for removing img
			$detialText_imgs.each(function(){
				$(this).wrap("<div class='imgWrap'></div>");
				var $imgWrap = $(this).parent();
				$imgWrap.append("<img src='http://s.jesscool.com/imgpro/delete.gif' class='imgOperation' />");
				$(".imgOperation").css({"left":$(this).width() + "px"});	
			});
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
		},
		renderInit: function(){
			this.imgNav1_li.eq(0).addClass( 'selected' );
			this.bingImgDel();
		}
	}
	
	$(function(){
		view.init();
	});
	
	
	
	
		
})(jQuery);
