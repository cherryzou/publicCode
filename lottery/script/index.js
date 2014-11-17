/* @author 13011924*/
LTouch.index = {
    init: function(){
        this.leftOpenHandle();
        this.topScroll();
    },
    leftOpenHandle: function(){   //首页左侧收
        $('.menu-choose li').each(function(){
            var index = $(this).index();
            (function(obj){
                obj.onclick = function(){
                    LTouch.rBlur();
                    var $this = $(this),
                        links = $(".menu-links"),
                        wrap = $(".index-left-menu");
                    if(!$this.hasClass("on")){
                        $this.addClass("on").siblings().removeClass("on");
                        wrap.css({"left": 0});
                        links.eq(index).show().siblings(".menu-links").hide();

                    }else{
                        if(parseInt(wrap.css("left")) < 0){
                            wrap.css({"left": 0});
                        }else{
                            wrap.css({"left": -links.eq(index).width()});
                        }
                    }

                }
            })(this);
        });
    },
    topScroll: function(){  //顶部信息上下滚动
         var wrap = $(".index-top"),
             ul = wrap.find("ul"),
             li = ul.find("li"),
             len = li.size(),
             h = li.height(),
             index = 1;
            if(len > 1){
                var first = li.first().clone();
                ul.append(first);
                ul.height(h * (len + 1));
                setInterval(function() {
                   scroll();
                }, 3000)
            }
        var scroll = function(){
            ul.animate({"marginTop" : [-(index++) * h, "easeOutQuad"] }, function(){
                if(index == len + 1){
                    ul.css({"marginTop": 0});
                    index = 1;
                }
            });

        }





    }
}

$(function(){
    LTouch.index.init();
    //首页三联版
    LTouch.Widget.SNCarousel({
        hook : "#L_index_slide",
        slideBox : ".flash-wrap",
        slideUl : ".flash-ul",
        slideLi: ".flash-ul li",
        counter: ".num"
    });

});