(function($){
	var loader = {
		curSet : [],
		loadArtls : function(id){
			var This = this;
			$.ajax({
				url : 'http://www.jesscool.com/moreLook.do?tagId='+id,
				dataType : 'json',
				beforeSend: function(){
					view.showLoading();
				},
				success : function(obj){
					This.curSet = obj.ary;		
					view.renderArtlsList(This.curSet);
				}
			});		
		}	
	
	};	
	var view = {
	    init : function(){
	        this.getUIRef();
	        this.bindEvent();
	    },
	    getUIRef : function(){
	        this.articleType_li = $( '#articleType > li' );
			this.box = $( '#articleBox');
			console.log(this.box[ 0 ]);
	    },
	    bindEvent : function(){
	    	//script for li of articleType
	        this.articleType_li.hover(function(){
	        	$(this).addClass( 'hover' );
	        },function(){
	        	$(this).removeClass( 'hover' );
	        }).click(function(){
	        	loader.loadArtls( $(this).find( 'a' ).attr('tagId') );
	        	$(this).addClass('selected').siblings().removeClass('selected');
	        });
	    },
		renderArtlsList : function(ary){
			var i = 0;
			var html = '';
			for( ; i<ary.length ;i++ ){
				html += this.makeAArtls(ary[i]);	
			}
			this.box.html(html);
			imgCollect();
		},
		makeAArtls : function(art){
			var t = art.intime.split('-');
			var url = '/viewLook.do?lookId='+ art.id +'&tagId='+art.tagId;
			return [
				'<div class="article">',
					'<h2 class="articleTitle">',
						'<a href="'+ url +'">'+ art.title +'</a>',
					'</h2>',
					'<div class="articleDec">',
						'<a href="'+ url +'">'+ art.content +'</a>',
					'</div>',
					'<div class="articleImg">',
						'<a href="'+ url +'">'+ art.firstImg +'</a>',
						'<dl class="articleDate">',
							'<dt>'+ t[1]+'-'+t[2] +'</dt>',
							'<dd>'+ t[0] +'</dd>',
						'</dl>',
					'</div>',
				'</div>'
			].join('');		
		},
		showLoading : function(){
			this.box.html('<img src="http://s.jesscool.com/imgpro/wait.gif" />');
		},
		goTop : function(){
			var $goTop = $(' <div class="goTop"><div>TOP</div></div> ');
			$goTop.css({'opacity':'0.7'}).appendTo($('body')).click(function(){
				$('html,body').animate({'scrollTop':'0px'});
			});
			
			/*$(window).scroll(function(){
				alert($(window).scollTop);
				if($(document).scollTop() > 300){
					$goTop.show();
				}
			});*/
		}
		
	}
	
	// init
	$(function(){
		view.init();
		view.goTop();
		
		//init data for index.jsp
		if(view.box.size() != 0){
			loader.loadArtls(7);
		}
		
	});
	
	
})(jQuery);
