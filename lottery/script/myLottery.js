/**
 * 
 * @author 13030131
 *
 
 * 
 */
 var warns={
 	warnings : function(){
		$(".info-input").each(function(i){
		
            $(this).focus(function(){
				
				$(this).css({"border":"#76abf3 solid 1px"});
			}).blur(function(){
				if(this.value==""||this.value==null){
					$(this).css({"border":"#f55 solid 1px"});
					$(this).next(".info-error").show();
				}else{
					$(this).css({"border":"#bbb solid 1px"});
					$(this).next(".info-error").hide();
				}

			})
        })
		return this;
	},
	LayerShow:function(){
		var _arrow=$(".down-arrow-icon"),
			_layers=$(".reward-nums").children("td");
			
		_arrow.each(function(i){
			$(this).toggle(function(){
			_layers.show();
				$(this).css({"background-image":"url(style/images/arrow-up.png)"});
			},function(){
				_layers.hide();
				$(this).css({"background-image":"url(style/images/arrow-down.png)"});
			});
		});
		return this;
	},
	tips:function(prevs,nexts,child){

		$("."+prevs).each(function(i){
			$(this).click(function(e){
				if($(this).next("."+nexts).css("display")==("none")){
					$(this).next("."+nexts).show().siblings("."+nexts).hide();
					
					$(this).find("a").children("."+child).css({"background-image":"url(style/images/arrow-up.png)"});
					$(this).siblings("."+prevs).find("a").children("."+child).css({"background-image":"url(style/images/arrow-down.png)"});
					
				}else{
					$(this).next("."+nexts).hide();
					$(this).find("a").children("."+child).css({"background-image":"url(style/images/arrow-down.png)"});
				}
				e.stopPropagation();
				e.preventDefault();
				
			});
		});
	}
	

 };
 
$(function(){
	 $("#submit").click(function(){
         var loadMask = new LTouch.Widget.Popbox({
            type: "inner",
            title: "信息提交成功"
        })
   
        return false;
    })
	warns.warnings();
	warns.LayerShow();
	warns.tips("winning-box","reword-box-con","wining-arrow");
	warns.tips("winning-box","result-descript","arrow-time-rig");
});
