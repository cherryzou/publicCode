/* @author 13011924*/
LTouch.ball = {
   init: function(){
       this.chooseSSC();
       this.delBetList();

   },
    tabHandle: function(opt,callback){ //tab
        var def = {
            event: "click",
            wrap: "",
            tabWrap: "",
            class:"on"

        }
        $.extend(def, opt);
        $(def.wrap).bind(def.event, function(){
            var $this = $(this),
                index = $this.index();
            $this.addClass(def.class).siblings().removeClass(def.class);
            $(def.tabWrap).eq(index).show().siblings(def.tabWrap).hide();
            if(callback && typeof(callback) === "function") {
                callback();
            }
        });

    },
    chooseSSC: function(){ //选择组合彩种
        $(".ssc-nav").each(function(){
            var $this =  $(this);
            $this.find(".li-text").click(function(){
                   var  cWrap = $(".choose-wrap"),
                        arrow = $(this).find(".up-arrows");
                   if(!cWrap.is(":visible")){
                       arrow.addClass("on");
                       cWrap.show();
                   } else{
                       arrow.removeClass("on");
                       cWrap.hide();
                   }
               });
            $this.find(".choose-wrap a").click(function(){
                    $(this).parents(".choose-wrap").hide();
                    $this.find(".up-arrows").removeClass("on");
            });
           });
    },
   delBetList: function(){  //手选彩种删除
       $(".bet-list").each(function(){
           var list =  $(this).find("a");
           list[0].onmousedown = list[0].ontouchstart = start;
           var sPos, mPos;
           function start(e){
            //   e.preventDefault();
               sPos = setPos(e);
               var pos = [list.parent().position().left, list.parent().position().top];
               list[0].onmousemove = list[0].ontouchmove = move;
               function move(e){
                   var n,ePos;
                   e.preventDefault();
                   mPos = setPos(e);
                   if(mPos[0] < sPos[0]){     //判断位移超出指定范围时定死left数据
                       ePos =  Math.abs(mPos[0] - sPos[0]) < 50 + pos[0] ?  (mPos[0] - sPos[0]) + pos[0] : -50;
                   }else{
                       ePos =  Math.abs(mPos[0] - sPos[0]) < 0 - pos[0] ?  (mPos[0] - sPos[0]) + pos[0] : 0;
                   }

                   if (Math.abs(mPos[0] - sPos[0]) - Math.abs(mPos[1] - sPos[1]) > 0 && ePos >= -50 && ePos <= 0) {
                       list.parent()[0].style.left = ePos + "px" ;
                       document.onmouseup = list[0].ontouchend = end;
                   }
               }
               function end(e){
                   e.preventDefault();
                   if((mPos[0] < sPos[0] && Math.abs(list.parent().position().left) <= 50/2) || (mPos[0] > sPos[0])){   //弹起时左右1/2判断
                       list.parent()[0].style.left = 0 + "px" ;
                   }else{
                       list.parent()[0].style.left = -50 + "px" ;
                   }
                   list[0].ontouchmove = list[0].ontouchend = list[0].onmousemove = document.onmouseup = null;
               }
           }
           //获取touchend坐标
           function setPos(e) {
               var pos = [];
               pos[0] = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
               pos[1] = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
               return pos;
           }
       })

   }
}
$(function(){
    LTouch.ball.init();
    LTouch.ball.tabHandle({wrap:".tab-lottery li", tabWrap:".tab-count"},function(){
        $(".choose-wrap").hide();
       $(".ssc-nav").find(".up-arrows").removeClass("on");
    });
	LTouch.ball.tabHandle({wrap:".tab-charge li", tabWrap:".charge-content"});

    LTouch.init();
});