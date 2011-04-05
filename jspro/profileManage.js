
(function($){
	
	var imgManager = {
		changeImg: function(tagId){
			$.ajax({
				type:'post',
				url:'changeImg.do',
				data:{'tagId':tagId},
				cache:false,
				beforeSend:function(){
					view.detailText.append( '<img class="loading" src="http://s.jesscool.com/imgpro/wait.gif" />' );
				},
				success: function(data){
					view.renderImg(data);
				},
				error: function(){
					alert( '抱歉，请求出错！' );
				}
			});
		},
		delImgTag: function(imgTagId){
			$.ajax({
				type:'post',
				url:'deleteTag.do',
				data:{"imgTagId":imgTagId},
				cache:false,
				success: function(data){
					view.clickNextTag();
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
		}
	}
	
	var view = {
		init: function(){
			this.getUIRef();
			this.bindEvent();
			this.renderInit();
		},
		getUIRef: function(){
			this.imgNav1_ul = $( '#articleType' );
			this.imgNav1_li = $( '#articleType > li' );
			this.detailText = $( '.detailText' );
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
					imgManager.delImgTag( $(this).parents('li').find(' > a').attr('tagId') );
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
		renderImg: function(data){
			view.detailText.html(data);
		},
		clickNextTag: function(){
			//删除当前类比后，显示下一个Tag的内容
			if(view.imgNav1_li){
				view.imgNav1_li.next().find(" > a").trigger("click");
			}else{
				view.detailText.empty();
				view.imgNav1_ul.html( '<li>您还没有添加分类呢！</li>' );
			}
		},
		renderInit: function(){
			view.imgNav1_li.eq(0).addClass( 'selected' );
		}
	}
	
	$(function(){
		view.init();
	});
	
	
	
	
		
})(jQuery);
