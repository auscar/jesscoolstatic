(function($){
	
	var view = {
		init: function(){
			this.getUIRef();
			this.bindEvent();
		},
		getUIRef: function(){
			this.forms = $( 'input.text-input' );
		},
		bindEvent: function(){
			this.forms.focus(function(){
				$(this).addClass("focus");
			}).blur(function(){
				$(this).removeClass('focus');
			});
		}
			
	}
	
	$(function(){
	
		view.init();
	
	});
	
})(jQuery);