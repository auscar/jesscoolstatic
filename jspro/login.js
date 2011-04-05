
(function($){
	var view = {
	    init : function(){
	        this.getUIRef();
	        this.bindEvent();
	    },
	    getUIRef : function(){
	        this.regEmail = $( '#regEmail' );
	    },
	    bindEvent : function(){
	        this.regEmail.blur(function(){
				if($(this).val() == this.defaultValue || $(this).val() == ''){
					$(this).val(this.defaultValue);
				}
			}).focus(function(){
				if($(this).val() == this.defaultValue ){
					$(this).val("");
				}
			});
	       
	    }
	}
		
	// init
	$(function(){
		view.init();
	});
	
	
})(jQuery);