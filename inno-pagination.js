;(function($, doc, win) {

  function InnoPagination(element,settings) {
	  
	this.$element = $(element);
	this.currentIndex = settings.startPage;
    this.settings = $.extend({}, $.fn.innoPagination.default, settings);
	this.checkParameter(this.settings);
	this.renderIndex();
  }
 	
  InnoPagination.prototype = {

	/****************************************
	 check user parameter is valid 
	****************************************/
	checkParameter: function(settings)
	{
		
		if (settings.startPage < 1 || settings.startPage > settings.totalPages) {
            throw new Error('Start page option is incorrect');
        }

		settings.totalPages = parseInt(settings.totalPages);
        if (isNaN(settings.totalPages)) {
            throw new Error('Total pages option is not correct!');
        }
		
		settings.visiblePages = parseInt(settings.visiblePages);
        if (isNaN(settings.visiblePages)) {
            throw new Error('Visible pages option is not correct!');
        }
		
        if (settings.visiblePages/2 == 0) {
            throw new Error('Visible pages must be odd number!');
        }
		
		if(settings.pagingMode != 'index' && settings.pagingMode != 'dropdown' )
			throw new Error('paganation mode not exist!');

	},
	
	
	/****************************************
		render  indexMode Paganation
	****************************************/
	renderIndex : function() {
			
			this.$element.append(this.makeActionBtn("first_index"));
			this.$element.append(this.makeActionBtn("prev_index"));
			this.$element.append("<li class=prev_dot><a class = prev_dot_link>...</a></li>");
		
			for(var i =1; i<=this.settings.totalPages; i++)
			{	
				this.$element.append(this.makeIndex(i));
			}
			
			this.$element.append("<li class=next_dot><a class = next_dot_link>...</a></li>");
			this.$element.append(this.makeActionBtn("next_index"));
			this.$element.append(this.makeActionBtn("last_index"));
			
			this.updatePageStatus(this.settings.startPage);
			
		return this;
	},
	
	/****************************************
		make dufault paganation item
	****************************************/
	makeActionBtn : function(className) {
		
		var $itemContainer = $('<li></li>'),
            $itemContent = $('<a></a>'),
            itemText = "";
		var onPageSwitch = this.switchPage;

        $itemContainer.addClass('action_item');
		var save = this;
		switch(className)
		{

		    case 'first_index':
				itemText = this.settings.first;
				$itemContent.click(function(){
				save.switchPage(1,save)});
		        break;
		    
			case 'prev_index':
				itemText = this.settings.prev;
				$itemContent.click(function(){
				save.switchPage(
				parseInt(save.currentIndex)-1,save)});
		        break;
		    case 'next_index':
				itemText = this.settings.next;
				$itemContent.click(function(){
				save.switchPage(parseInt(save.currentIndex)+1,save)});
		        break;
		  
			case 'last_index':
				itemText = this.settings.last;
				
		    	$itemContent.click(function(){
				save.switchPage(save.settings.totalPages,save)});
		        break;
		  
		}
			$itemContent.attr('href', "#nothing").addClass(className).html(itemText);
			$itemContainer.append($itemContent);
		
            return $itemContainer;
			
		
	},
	
	/****************************************
		make dufault page item
	****************************************/
	makeIndex : function(page) {
		
			var onPageSwitch = this.switchPage;
			var save = this;
			var $itemContainer = $('<li></li>'),
                $itemContent = $('<a></a>'),
                itemText = page;

            $itemContainer.addClass('page_item');
			
			if(page == this.settings.startPage)
				$itemContent.addClass('current');

			$itemContainer.append($itemContent.attr('href', "#nothing").click(function(){
			onPageSwitch($(this).html(),save)}).addClass('').html(itemText));
	
            return $itemContainer;
	},
	
		
	/****************************************
		item satatus when page switching
	****************************************/
	switchPage : function(current,save)
	{

		save.currentIndex = current;
			
		$(".page_item").each(
			function() {
				if($(this).children().html() == current)
					$(this).children().addClass('current');
				else
					$(this).children().removeClass();
		});
	
		save.settings.onPaging();
		save.updatePageStatus(current);
		
	},
	
	
	/****************************************
		update all item satatus when page switching
	****************************************/
	updatePageStatus : function(current_index){
			
		var save = this;
		var pageOffset = Math.floor(parseInt(save.settings.visiblePages)/2);
		
		$(".page_item" ).each(
				function()
				{
					if(save.settings.totalPages == save.settings.visiblePages){
						$(".next_dot" ).css("display","none");
						$(".prev_dot" ).css("display","");
					}
					
					if( current_index == save.settings.totalPages)
					{
						if(parseInt($(this).children().html())<=(save.settings.totalPages-save.settings.visiblePages))
							$(this).css("display","none");
						else
							$(this).css("display","");

						$(".next_index" ).css("display","none");
						$(".last_index" ).css("display","none");
						$(".next_dot" ).css("display","none");

						$(".first_index" ).css("display","");
						$(".prev_index" ).css("display","");
						$(".prev_dot" ).css("display","");

					}

					else if( current_index == 1)
					{
						
						$(".first_index" ).css("display","none");
						$(".prev_index" ).css("display","none");
						$(".prev_dot" ).css("display","none");
						
						if(parseInt($(this).children().html())>save.settings.visiblePages)
							$(this).css("display","none");
						else
							$(this).css("display","");
						
						if(save.settings.totalPages==1)
						{
							$(".next_index" ).css("display","none");
							$(".last_index" ).css("display","none");
							$(".next_dot" ).css("display","none");
						}
						else
						{
							$(".next_index" ).css("display","");
							$(".last_index" ).css("display","");
							$(".next_dot" ).css("display","");
						}
					}
					
					else if (current_index <=(parseInt(pageOffset)+1))
					{
						if(parseInt($(this).children().html())<= save.settings.visiblePages)
							$(this).css("display","");
						else
							$(this).css("display","none");

						$(".first_index" ).css("display","");
						$(".prev_index" ).css("display","");
						$(".prev_dot" ).css("display","none");

						$(".next_index" ).css("display","");
						$(".last_index" ).css("display","");
						$(".next_dot" ).css("display","");
					}
					
					else if (current_index >= (save.settings.totalPages-parseInt(pageOffset)))
					{
						if(parseInt($(this).children().html()) > (save.settings.totalPages-save.settings.visiblePages))
							$(this).css("display","");
						else
							$(this).css("display","none");

						$(".first_index" ).css("display","");
						$(".prev_index" ).css("display","");
						$(".prev_dot" ).css("display","");

						$(".next_index" ).css("display","");
						$(".last_index" ).css("display","");
						$(".next_dot" ).css("display","none");
					}
				
					else{
						var intCurrent =  parseInt(current_index);
							
						if( parseInt($(this).children().html()) >= (intCurrent-pageOffset) && parseInt($(this).children().html()) <= (intCurrent+pageOffset))
							$(this).css("display","");
						else
							$(this).css("display","none");	
						
						$(".first_index" ).css("display","");
						$(".prev_index" ).css("display","");
						$(".prev_dot" ).css("display","");

						$(".next_index" ).css("display","");
						$(".last_index" ).css("display","");
						$(".next_dot" ).css("display","");
				
					}

				}
		);
	}
  };


  $.fn.innoPagination = function(setting) {
	var settings = typeof setting === 'object' ? setting : {};
    return this.each(function() {
      new InnoPagination(this,settings);
    });
  };

  $.fn.innoPagination.default = {
		 totalPages: 1,
		 startPage: 1,
		 visiblePages: 5,
		 pagingMode: 'index', //dropdown 
		 first: 'first',
		 prev: 'previous',
		 next: 'next',
		 last: 'last',
		 onPaging : function() {
			return false;
		}
   };

   123


})(jQuery, document, window);