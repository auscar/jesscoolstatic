
(function($){
	
	var view = {
	    init : function(){
	        this.getUIRef();
	        this.bindEvent();
	    },
	    getUIRef : function(){
	        this.articleType_li = $( '#articleType > li' );
	    },
	    bindEvent : function(){
	    	//script for li of articleType
	        this.articleType_li.hover(function(){
	        	$(this).addClass( 'hover' );
	        },function(){
	        	$(this).removeClass( 'hover' );
	        });
	    }
	}
	
	// init
	$(function(){
		view.init();
	});
	
	
})(jQuery);