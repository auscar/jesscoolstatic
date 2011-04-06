(function($){
	var loader = {
		curSet : [],
		loadArtls : function(id){
			var This = this;
			$.ajax({
				url : 'http://www.jesscool.com/moreLook.do?tagId='+id,
				dataType : 'json',
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
			this.box = $( 'div.articleBox', $('#main') );
			console.log(this.box[ 0 ]);
	    },
	    bindEvent : function(){
	    	//script for li of articleType
	        this.articleType_li.hover(function(){
	        	$(this).addClass( 'hover' );
	        },function(){
	        	$(this).removeClass( 'hover' );
	        });
	    },
		renderArtlsList : function(ary){
			var i = 0;
			var html = '';
			for( ; i<ary.length ;i++ ){
				html += this.makeAArtls(ary[i]);	
			}
			this.box.html(html);
		},
		makeAArtls : function(art){
			var t = art.intime.split('-');
			var url = '/viewLook.do?lookId='+ art.id +'&tagId='+art.tagId;
			return [
				'<div class="article">',
					'<h2 class="articleTitle">',
						'<a target="_blank" href="'+ url +'">'+ art.title +'</a>',
					'</h2>',
					'<div class="articleDec">',
						'<a target="_blank" href="'+ url +'">'+ art.content +'</a>',
					'</div>',
					'<div class="articleImg">',
						'<a target="_blank" href="'+ url +'">'+ art.firstImg +'</a>',
						'<dl class="articleDate">',
							'<dt>'+ t[1]+'-'+t[2] +'</dt>',
							'<dd>'+ t[0] +'</dd>',
						'</dl>',
					'</div>',
				'</div>'
			].join('');		
		}
	}
	
	// init
	$(function(){
		view.init();
		loader.loadArtls(2);
	});
	
	
})(jQuery);
