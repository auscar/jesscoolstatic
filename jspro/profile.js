
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
		}
	}
	
	var view = {
		init: function(){
			this.getUIRef();
			this.bindEvent();
			this.renderInit();
		},
		getUIRef: function(){
			this.imgNav1_ul = $( '.imgNav1_ul' );
			this.imgNav1_li = $( '#articleType > li' );
			this.detailText = $( '.detailText' );
		},
		bindEvent: function(){
			this.imgNav1_li.click(function(){
				imgManager.changeImg($(this).find( 'a' ).attr( 'tagId' ));
				$(this).addClass( 'selected' ).siblings().removeClass( 'selected' );
			});
		},
		renderImg: function(data){
			this.detailText.html(data);
		},
		renderInit: function(){
			this.imgNav1_li.eq(0).addClass( 'selected' );
		}
	}
	
	$(function(){
		
		view.init();
	});
	
	
	
	
		
})(jQuery);
