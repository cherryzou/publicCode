/* 
* @Author: 12050231
* @Date:   2013-11-05 11:01:29
* @Last Modified by:   ued
* @Last Modified time: 2013-11-18 08:49:02
* depend on jQuery 1.7.2+, only for android 2.2+ and ios 4.3.5+ , webkit only
*/

//easeOutQuint   easeOutExpo  easeOutCirc   easeInOutCirc
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
    def: 'easeOutQuad',
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeOutQuad: function (x, t, b, c, d) {return c*((t=t/d-1)*t*t + 1) + b;}
});
//
(function(){
    var sn = this;
    if(typeof LTouch === "undefined"){
        sn.LTouch = {};
    }

    LTouch.VERSION = "0.5";
    LTouch.AUTHOR = "PPanda";
    LTouch = Object.create({
        //初始化Touch事件
        init: function(){
            return this.TouchReady();
        },
        //默认初始载入公用方法, 仅适用于此项目
        TouchReady : function(){
            //
            this.hideBar();
            //
            this.backTop();
            //
            // this.placeHolder("#keywordsBottom");
            this.inputTouch();
        },
        //only ios6- and android 2.3+
        hideBar : function(){
            if(window.location.href.indexOf("#") < 0){
                setTimeout(scrollTo, 0, 0, 1);
            }
        },
        //简单的检测设备方法
        checkDetect : function(){
            var Detect = {
                webkit: /(AppleWebKit)[ \/]([\w.]+)/,
                ipad: /(ipad).+\sos\s([\d+\_]+)/i,
                windows: /(windows\d*)\snt\s([\d+\.]+)/i,
                iphone: /(iphone)\sos\s([\d+\_]+)/i,
                ipod: /(ipod).+\sos\s([\d+\_]+)/i,
                android: /(android)\s([\d+\.]+)/i
            };

            var ua = window.navigator.userAgent,
                browser = Detect.webkit.exec(ua),
                ios = /\((iPhone|iPad|iPod)/i.test(ua),
                //["iPhone OS 5_1", "iPhone", "5_1"]
                tmp = [],
                N = {},
                match = [];
                for(i in Detect){
                    match = Detect[i].exec(ua);
                    if(match){
                        tmp = Detect[i].exec(ua);
                    }  
                }
                N = {
                    system : tmp[1].toLowerCase(),
                    version : tmp[2].replace(/(\_|\.)/ig, '.').toLowerCase(),
                    browser : browser ? browser[1].toLowerCase() : 'apple/webkit',
                    ios: ios
                }
                return N;
        },
        // 页面定位
        jumpTo: function(top){
            setTimeout(scrollTo, 100, 0, document.querySelector(top).offsetTop);
            // top.scrollIntoView(true);
        },
        // 返回顶部
        backTop : function(){
            if(!document.querySelector("#backTop")){return;}
            document.querySelector("#backTop").addEventListener("click", function(){
               setTimeout(scrollTo, 100, 0, 1);
                return false;
            }, false);
        },
        // 
        placeHolder: function(elem, all){
            if(!document.querySelector(elem)){return;}
            var elem = all ? document.querySelectorAll(elem) : document.querySelector(elem);
            var dValue = elem.defaultValue;
            elem.addEventListener("focus", function(){
                if(elem.value == dValue){
                    elem.value = "";
                }
            }, false);
            elem.addEventListener("blur", function(){
                if(elem.value == ""){
                    elem.value = dValue;
                }
            }, false);

        },
        // 简单的获取dom结构的方法
        D: function(){
            if(arguments.length == 0){return}
            return typeof arguments[0] == "string" ? document.querySelector(arguments[0]) : arguments[0];
        },
        DA: function(){
            if(arguments.length == 0){return}
            return typeof arguments[0] == "string" ? document.querySelectorAll(arguments[0]) : arguments[0];
        },
        dEach: function(){
            if(arguments.length == 0){return}
            if(typeof arguments[0] == "string"){
                if(arguments[0].indexOf(",") > -1){
                    var str = arguments[0].split(",");
                    var arr = [];
                    for(var i = 0; i < str.length; i++){
                        arr.push(document.querySelector(str[i]));
                    }
                    return arr;
                }else{
                    return document.querySelectorAll(arguments[0]);
                }
            }else{
                return arguments[0]
            }
        },
        find: function(el,tag){
            var a = arguments[0], t = [];
            if(typeof a == "string"){
                t = document.querySelector(el).querySelectorAll(tag);
            }else{
               for(var k = 0;k < a.length; k++){
                    for(var j = 0; j < a[k].querySelectorAll(tag).length; j++){
                        t.push(a[k].querySelectorAll(tag)[j]);
                    }
                } 
            }
            return t;
        },
        // 事件代理
        proxyEvent: function(){
            if(!arguments[0]){return;}
            var d = {
                eq: 0,
                elemA: "",
                elemB: "",
                typeA: "click",
                typeB: "click",
                Fntype: "Fn"
            }
            $.extend(d, arguments[0]);
            var tmpObj = {
                index: d.eq,
                Fn: function(){
                    $(d.elemB).eq(d.eq)[d.typeB]();
                },
                Fnform: function(){
                    $(d.elemB).eq(d.eq)[d.typeB]
                }
            }
            $(d.elemA)[d.typeA]($.proxy(tmpObj, d.Fntype));
        },
        // 安卓透光问题
        rBlur: function(){
            if(this.checkDetect().system == "android"){
                var style = document.createElement("style");
                style.type = "text/css";
                style.id = "rBlur";
                style.innerHTML = "*{-webkit-tap-highlight-color:rgba(0,0,0,0)}";
                document.body.appendChild(style);
            }
        },
        // 全局绑定input事件，需根据项目的html结构修改
        inputTouch:function(){
            $(".label-bind").find("label").each(function(){
                var _this = $(this);
                LTouch.proxyEvent({
                    elemA: _this,
                    elemB: _this.find("input"),
                    Fntype: "Fnform",
                    eq: 0
                })
            })
        },
        // 绑定select事件，需根据项目的html结构修改
        selectBind: function(){
            $(".select-choose").each(function(){
                var _this = $(this);
                $(this).change(function(){
                    _this.prev().html(_this.find("option:selected").html());
                })
            })
        }
    });

    //自定义的调试事件
    LTouch.log = function(){
        var para = arguments[0];
        if(!window.console){
                alert(arguments[0])
            }
        if(arguments.length < 2){
            console.log(para);
        }else {
            for(var i in para){
                console.log(i)
            }  
        }
    };
    LTouch.NS = function(str){
        var arr = str.split("."), o = window;
        for(var i = 0; i < arr.length; i++){
            o = o[arr[i]] = {};
        }
    }

    /**
     * [Validator description]
     * 
     * @example: new LTouch.Validator().email
     *
     * @return {[Boolean]} 
     */
    
    LTouch.Validator = function(){
        this.emailPattern = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        this.mobilePattern = /^1[3458]\d{9}$/;
        this.passwordPattern = /^[a-zA-Z]*$|^[^a-zA-Z]*$|^\d*$/;
    }
    LTouch.Validator.prototype = {

        email:function(){
            return this.emailPattern.test(arguments[0]);
        },
        mobile: function(){
            return this.mobilePattern.test(arguments[0]);
        },
        password: function(){
            return this.passwordPattern.test(arguments[0]) && arguments[0].length > 5 && arguments[0].length < 21;
        }
    }

    LTouch.loading = function(){
        var loadMask = new LTouch.Widget.Popbox({
            type: "inner",
            title: "加载中...",
            loadTime: 10000
        })
    }

/**
 * [tmpl模板]
 * @param  {[String]} cache [缓存的id]
 * @param  {[object]} $     [得到的数据] JSON.stringify();
 * @return {[String]}       [解析完毕的模板]
 */
    LTouch.tmpl2 = (function (cache, $T) {

    return function (str, data) {
        var fn = !/\s/.test(str)
        ? cache[str] = cache[str]
            || LTouch.tmpl2(document.getElementById(str).innerHTML)
     
        : function (data) {
            var i, variable = [$T], value = [[]];
            for (i in data) {
                variable.push(i);
                value.push(data[i]);
            };
            return (new Function(variable, fn.$T))
            .apply(data, value).join("");
        };

        fn.$T = fn.$T || $T + ".push('"
        + str.replace(/\\/g, "\\\\")
             .replace(/[\r\t\n]/g, " ")
             .split("<%").join("\t")
             .replace(/((^|%>)[^\t]*)'/g, "$1\r")
             .replace(/\t=(.*?)%>/g, "',$1,'")
             .split("\t").join("');")
             .split("%>").join($T + ".push('")
             .split("\r").join("\\'")
        + "');return " + $T;
     
        return data ? fn(data) : fn;
    }})({}, '$' + (+ new Date));
    /**
     * [自用LTouch简单的数据模板]
     * @type {[String]}
     */
    //LTouch.HTMLTemplate('<div class=${id}></div>', {id: 1})
    LTouch.HTMLTemplate = function(string, o) {
        var o = o || {};
        var html = [string].join('');
        if (o) {
            for (var i in o) {
                //替换${var}变量
                var re = new RegExp('\\$\\{' + i + '\\}', 'g');
                html = html.replace(re, o[i]);
            }
            return html;
        }
        return html;
    };

    //封装功能
    LTouch.Widget = {
        /**
         * [滚动组件]
         * @param {[type]} settings [description]
         * 
         * 现在我也忘了自己都写了一堆神马
         */
        SNCarousel : function(settings){
            /**
             * 默认参数
             * @type {Object}
             * @by PPanda
             * @version 1.0
             * @example
             * LTouch.Widget.SNSlide({
             *     hook: "#id"
             * })
             * @兼容多种浏览器，未使用webkitAnimationEvent
             * 
             */
            var S = this;
            var defaults = {
                hook : "#J_index_slide",
                direction: "X",
                slideBox: ".index-slide-box",
                slideUl: ".slide_ul",
                slideLi: ".slide_ul li",
                prev: ".prev",
                next: ".next",
                disable: "disabled",
                counter: ".trigger",
                effect: "scroll",
                current: 1,
                timer: 450,
                autoplay: 1,
                cycle: 1,
                touch : true,
                asyncLoad: false
            };
            //继承参数
            if (settings) {
                $.extend(defaults, settings);
            }
            if(!S.D(defaults.hook)){
                return;
            }
            function N(defaults){
                var c = defaults;
                var p = $(c.hook);
                var uid = c.hook;
                var cur = c.current;
                var w = 0,
                    h = 0,
                    width = 0,
                    height = 0;
                    //var len = Math.ceil(p.find(c.slideLi).length);
                    len = Math.ceil(S.DA(uid + " " +c.slideLi).length),
                    //var Li = p.find(c.slideLi);
                    Li = S.DA(uid + " " +c.slideLi),
                    Ul = S.DA(uid + " " +c.slideUl),
                    $Li = $(Li),
                    $Ul = $(Ul),
                    width = p.find(c.slideBox).width(),
                    height = p.find(c.slideBox).height(),
                    //判断横屏
                    X = c.direction == "X" ? true : false,
                    autoplay = c.autoplay,
                    flag = false,
                    N = null;
                //end var
                
                if(len == 1){
                    Ul[0].onmousedown = Ul[0].ontouchstart = null;
                    trig();
                    return;
                }
                if(c.cycle == 1){
                    var lastLi = $(Li[len - 1]).clone();
                    var fstLi = $(Li[0]).clone();
                    $Ul.append(fstLi);
                    $Ul.append(lastLi);
                    //Ul.width(width * (len + 2))
                    Ul[0].style.width = width * (len + 2) + "px";
                    //lastLi.css("left", -width * (len + 2));
                    lastLi.get(0).style.left = -width *(len + 2) + "px";
                }
                if (X) {
                    for (var i = 0; i < len; i++) {
                        //计算图片总宽度
                        w += $Li.eq(i).width();
                    }
                    //Ul.width(w);
                    //设置图片当前位置
                    //p.find(c.slideUl).css("left", -(width * (cur - 1)));
                } else {
                    for (var i = 0; i < len; i++) {
                        h += $Li.eq(i).height()
                    }
                    //Ul.height(h);
                   // p.find(c.slideUl).css("top", -(height * (cur - 1)));
                }
                trig();
                switch (c.effect) {
                case "ctrl":
                    ctrl();
                    
                    break;
                case "scroll":
                    Scroll();
                    break;
                case "both":
                    ctrl();
                    Scroll();
                }
                function Scroll() {
                    if (X) {
                        //剩余移动距离
                        var dis = -w + width
                    } else {
                        var dis = -h + height
                    }
                    //绑定开始事件
                    if(c.touch){
                        Ul[0].onmousedown = Ul[0].ontouchstart = Start;
                    }else{
                        Ul.hover(function(){
                            auto.dispose();
                        },function(){
                            auto.process();
                        })
                    }

                    function Start(para) {
                        
                        //para.preventDefault();
                        
                        //初始位置、移动位置、
                        var sPos, mPos;
                        // if (autoplay) {
                        //     auto.process()
                        // }
                        //双击可能失效
                        auto.dispose();
                        //初始容器静止坐标
                        //获取匹配元素相对父元素的偏移坐标
                        var pos = [$Ul.position().left, $Ul.position().top];
                        //点击初始坐标位置
                        sPos = setPos(para);
                        Ul[0].ontouchmove = Ul[0].onmousemove = Move;
                        
                        function Move(e) {

                            //移动坐标位置
                            mPos = setPos(e);
                            if (X) {
                                //移动的距离差
                                
                                var ePos = (mPos[0] - sPos[0]) + pos[0];

                                if (Math.abs(mPos[0] - sPos[0]) - Math.abs(mPos[1] - sPos[1]) > 0) {
                                    e.preventDefault();
                                    getPos();
                                    Ul[0].ontouchend = document.onmouseup = EndMove;
                                }
                            } else {
                                var ePos = (mPos[1] - sPos[1]) + pos[1];
                                e.preventDefault();
                                getPos();
                                Ul[0].ontouchend = document.onmouseup = EndMove;
                            }
                            //移动位置
                            function getPos() {
                                //排除头尾
                                //if (ePos <= 0 && ePos >= dis) {
                                    if (X) {
                                        Ul[0].style.left = ePos + "px"
                                    } else {
                                        Ul[0].style.top = ePos + "px"
                                    }
                                //} //else {}
                            }
                            if(flag){Ul[0].ontouchmove = Ul[0].ontouchend = Ul[0].onmousemove = document.onmouseup = null;}
                        }
                        //事件完毕执行
                        function EndMove(e) {
                            //e.preventDefault();
                            //方向位移
                            var dirPos, ePos = setPos(e);
                            if (autoplay) {
                                auto.process()
                            }
                            if (X) {
                                dirPos = ePos[0] - sPos[0];
                                adjustPos(e);
                            } else {
                                dirPos = ePos[1] - sPos[1];
                                adjustPos(e);
                            }
                            //移动方向调整
                            function adjustPos() {
                                if (dirPos < -width/6) {
                                    dirLeft()
                                    //go.process(dirLeft);
                                } else {
                                    if(dirPos < 0 && dirPos > -width/5){
                                        resetPos();
                                    }else{
                                        if (dirPos > width/5) {
                                            dirRight()
                                            //go.process(dirRight);
                                        }else{
                                            resetPos();
                                        }   
                                    }
                                    
                                }
                            }
                            trig();
                            Ul[0].ontouchmove = Ul[0].ontouchend = Ul[0].onmousemove = document.onmouseup = null;
                        }
                    }
                    //获取touchend坐标
                    function setPos(e) {
                        var pos = [];
                        pos[0] = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
                        pos[1] = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
                        return pos;
                    }
                }
                var resetPos = function(){
                    $Ul.animate({
                        left: [-(width * (cur - 1)),"easeOutQuad"]
                    })
                    if(c.cycle == 1){

                    }else{

                    }
                }
                //判断向右移动
                var dirRight = function() {
                        if (autoplay) {
                            auto.process();
                        }   
                        //无缝滚动
                        if (c.cycle == 1) {
                            if (cur != 1) {
                                r();
                                return false;
                            } else {
                                r();
                                //Li.eq(len - 1).css("left", -(width * len));
                                Li[len - 1].style.left = -(width * len) + "px";
                                Li[0].style.left = 0;
                                //Li[0].style.left = 0;
                                //Li.eq(0).css("left", 0);
                                return false;
                            }
                        } else {
                            if (cur != 1) {
                                r();
                                return false;
                            }else{
                                resetPos();
                            }
                        }
                    };
                //向右移动
                function r() {
                    if(flag){return}
                    if (X) {
                        p.find(c.slideUl).animate({
                            left: [-(width * (cur - 2)), "easeOutQuad"]
                        }, c.timer, function() {
                            trig();
                            Ul[0].style.left = -(width * (cur - 1)) + "px";
                            //p.find(c.slideBox).find("ul").css("left", -(width * (cur - 1)));
                            Li[len - 1].style.left = 0;
                            //Li.eq(len - 1).css("left", 0);
                            flag = false;
                        })
                    } else {
                        $Ul.animate({
                            top: -(height * (cur - 2))
                        }, c.timer, function() {
                            flag = false;
                        })
                    }
                    cur == 1 ? cur = len : cur--;
                    flag = true;
                    if(!c.touch || c.asyncLoad){
                        asyncLoad();
                    }
                    
                }
                //判断向左移动
                var dirLeft = function() {
                        if (c.autoplay == 1) {
                            auto.process();
                        }
                        if (c.cycle == 1) {
                            if (cur != len) {
                                l();
                                return false;
                            } else {
                                l();
                                Li[0].style.left = width * len + "px";
                                //Li.eq(0).css("left", width * len);
                                //p.find(c.slideBox).css("left", 0);
                                return false;
                            }
                        } else {
                            if (cur != len) {
                                l();
                                return false;
                            }else{
                                resetPos();
                            }
                        }
                    };
                //向左移动
                function l() {
                    if(flag){return}

                    if (c.direction == "X") {
                        p.find(c.slideUl).animate({
                            left: [-(width * cur), "easeOutQuad"]
                        }, c.timer, function() {

                            trig();
                            Ul[0].style.left = -(width * (cur - 1));
                            //p.find(c.slideBox).find("ul").css("left", -(width * (cur - 1)));
                            Li[0].style.left = 0;
                            //Li.eq(0).css("left", 0);
                            flag = false;
                        })
                    } else {
                        $Ul.animate({
                            top: -(height * cur)
                        }, c.timer, function(){
                            flag = false;
                        });
                    }

                    flag = true;
                    cur == len ? cur = 1 : cur++;
                    if(!c.touch || c.asyncLoad){
                        asyncLoad();
                    }
                }
                //简单异步加载
                var asyncLoad = function(){
                    try{
                        $Li.eq(cur - 1).find("img").attr("src", $Li.eq(cur - 1).find("img").attr("data-src")).removeAttr("data-src");
                    }catch(e){
                        //alert(e);
                    }
                    
                }
                //执行移动
                var go = {
                    timerid: null,
                    //回调执行方法
                    action: function(x) {
                        try{
                            x()
                        }catch(e){

                        }
                    },
                    //
                    process: function(x) {
                        clearTimeout(this.timerid);
                        this.timerid = setTimeout(function() {
                            go.action(x)
                        }, 0)
                    }
                };
                //如果可控
                function ctrl() {
                    p.find(c.prev).click(function(x) {
                        if (c.cycle == 1) {
                            go.process(dirRight)
                        } else {
                            if (cur != 1) {
                                go.process(dirRight)
                            }
                        }
                    });
                    p.find(c.next).click(function(x) {
                        if (c.cycle == 1) {
                            go.process(dirLeft);
                        } else {
                            if (cur != len) {
                                go.process(dirLeft);
                            }
                        }
                    })

                }
                
                //控制索引
                function trig() {

                    var x = p.find(c.counter);
                    if (x.length > 0) {
                        x.find("li").eq(cur - 1).addClass("cur").siblings().removeClass("cur");
                        //Li.eq(cur - 1).addClass("cur").siblings().removeClass("cur");
                    }else{
                        if (c.cycle != 1) {
                            var B = p.find(c.prev),
                                A = p.find(c.next);
                            B.removeClass(c.disable);
                            A.removeClass(c.disable);
                            if(len == 1){
                                B.addClass(c.disable);
                                A.addClass(c.disable);
                                return;
                            }
                            if (cur == 1) {
                                B.addClass(c.disable);
                            } else {
                                if (cur == len) {
                                    A.addClass(c.disable);
                                }
                            }
                        }
                    }

                }
                //自动执行方法
                var auto = {
                    timeoutId: null,
                    //自动执行
                    performProcessing: function() {
                        try{
                            dirLeft();
                        }catch(e){

                        }
                    },
                    process: function() {
                        clearInterval(this.timeoutId);
                        
                        this.timeoutId = setInterval(function() {
                                auto.performProcessing();
                            
                        }, 3000)
                    },
                    //中断执行
                    dispose: function() {
                        clearInterval(this.timeoutId);
                        return;
                    }
                };
                if (c.autoplay == 1) {
                    auto.process();
                }
            };
            
            return N(defaults); 
        
        }
    }

    //选项卡
    /**
     * [SNTabs for touch]
     * @para settings: {object} 传入的对象参数
     * @para uid: {String} 总控制的id，为更好拓展而设，可选，默认为空
     * @para tabBtn: {String} 切换选项卡控制触发容器id，必须存在
     * @para tabBtnElem: {String} 选项卡控制触发器元素，默认为"li"
     * @para tabBtnClass: {String} 选项卡控制触发器当前样式，默认为"cur"
     * @para tabType: {String} 选项卡控制触发器触发事件，默认为"click"
     * @para tabBox: {String} 选项卡内容总控制id，初始为空，建议选项卡所有内容用id包裹
     * @para tabBoxClass: {String} 选项卡每块内容class，默认为".tabBox"
     * @para show: {String} 选项卡每块内容展示效果，默认为"show"
     * @para show: {String} 选项卡每块内容收起效果，默认为"hide"
     * @para callback: {Fucntion} 选项卡触发容器元素，即tabBtnElem触发效果回调函数
     * @para ajaxData: {Array} ajax方法参数数组，如有ajax数据抓取，必须存在
     * @para ajaxType: {String} ajax获取数据方法，默认为GET
     * @para ajaxDataType: {String} ajax获取数据的格式，默认为html
     * @para delay: {Boolean} 是否延迟触发，默认false
     * @para delaytTime: {Number} 默认300
     * @example  new LTouch.Widget.SNTabs({
     *    uid: {String} 总控制id （可选）
     *    tabBtn: {String} 控制触发器容器
     *    tabBox: {String} 内容总包裹
     *    //下面为ajax内置参数方法
     *    
     *    ajaxData: [{
     *            //默认第二个选项卡不异步加载，即四级页面参数
     *         disabled: true;
     *      },{
     *          //异步的页面地址
     *          ajaxUrl: "url.html",
     *          callback: function(){
     *              ajax数据回调后的方法
     *          }
     *                
     *      },{
     *          ajaxUrl: "url2.html"
     *      }
     *    ],
     *    //触发回调方法
     *    callback: function(){}
     * })
     */
    LTouch.Widget.SNTabs = function(settings){
        this.settings = settings || {};
        this.uid = this.settings.uid || "";
        this.tabBtn = this.settings.tabBtn || "#tab";
        this.tabBtnElem = this.settings.tabBtnElem || "li";
        this.tabBtnClass = this.settings.tabBtnClass || "cur";
        this.tabType = this.settings.tabType || "click";
        this.tabBox = this.settings.tabBox || "";
        this.tabBoxClass = this.settings.tabBoxClass || ".tabBox";
        this.tabMore = this.settings.tabMore || ".tab-more";
        this.show = this.settings.show || "show";
        this.hide = this.settings.hide || "hide";
        this.callback = this.settings.callback || function(){};
        this.ajaxData = this.settings.ajaxData || [];
        this.ajaxType = this.settings.ajaxType || "GET";
        this.ajaxDataType = this.settings.ajaxDataType || "html";
        this.delay = this.settings.delay || false;
        this.delayTime = this.settings.delayTime || 300;
        this.eq = this.settings.eq || 0;
        this.initializer();
       
    }

    LTouch.Widget.SNTabs.prototype = {
        loadHtml : "<div class='loading' style='padding:20px 0'></div>",
        timer: null,
        initializer : function(){
            this.startFn();
        },
        ajax: function(i){
            var self = this;
            var ajax_self = this.ajaxPara;
            var tabBox = $(self.tabBox) || $(self.uid);
            var selectedTab = tabBox.find(self.tabBoxClass).eq(i);
            if(self.ajaxData.length == 0){return;}

            if(self.ajaxData.length > 0 && !selectedTab.hasClass("done") && i > 0){

                $.ajax({
                    url: self.ajaxData[i-1].ajaxUrl + "?" + new Date().getTime(),
                    type: self.ajaxType,
                    dataType : self.ajaxDataType,
                    beforeSend: function(){
                		selectedTab.html(self.loadHtml); 
                        //selectedTab.addClass("loading");
                    },
                    success: function(data){
                    	selectedTab.html(data);
                    },
                    error: function(){
                        alert("网络连接失败，请检测您的网络环境稍后重试");
                    },
                    complete: function(){
                    	selectedTab.addClass("done");//.removeClass("loading")
                        if(typeof self.ajaxData[i-1].callback == "function"){
                            self.ajaxData[i-1].callback(selectedTab);
                        }
                    }
                })
            }
        },
        startFn: function(){
            this.bind();
            this.eqFn();
        },
        bind: function(){
            if(this.delay){
                this.delayFn();
                return;
            }
            var self = this;
            var tabBtn = $(self.tabBtn);
            var tabBox = $(self.tabBox) || $(self.uid);
            tabBtn.find(self.tabBtnElem).bind(self.tabType, function(){
                self.tabFn(self, $(this), tabBox);
            });

        },
        delayFn: function(){

            var self = this;
            var tabBtn = $(self.tabBtn);
            var tabBox = $(self.tabBox) || $(self.uid);
            tabBtn.find(self.tabBtnElem).bind(self.tabType, function(){
                var _this = $(this);
                self.timer = setTimeout(function(){
                    self.tabFn(self, _this, tabBox);
                }, self.delayTime)
                
            });
            tabBtn.find(self.tabBtnElem).mouseout(function(){
                clearTimeout(self.timer);
            });
        },
        clearDelay: function(){
            
        },
        unbind: function(){

        },
        tabFn: function(self, _this, _tabBox){

            var index = _this.index();
            _this.addClass(self.tabBtnClass).siblings().removeClass(self.tabBtnClass);
            _this.find(self.tabMore).eq(index).show().siblings().hide();
            _tabBox.find(self.tabBoxClass).eq(index).show().siblings(self.tabBoxClass).hide();
            if(self.callback && typeof self.callback == "function"){
                self.callback(index, self);
            }
            self.ajax(index);

        },
        eqFn: function(){
            if(this.eq == 0){return}
            if(this.eq != 0){
                var tabBtn = $(this.tabBtn);
                tabBtn.find(this.tabBtnElem).eq(this.eq).trigger(this.tabType);
            }
        }
    }
    //touch弹出框
    /**
     * [Popbox for touch]
     * @para settings: {object} 传入的对象参数
     * @para html: {String} 弹出框html容器，默认已配置
     * @para contentId: {String} 加入到弹窗容器页面内DOM的id
     * @para effect: {String} 默认为"pop"，基于CSS3动画创建 ios下使用，安卓下使用生硬效果
     * @para title: {String} 弹窗提示文字，最好存在
     * @para type: {String} 弹窗类型，默认为全屏，即三级筛选样式，"inner"为小弹窗样式
     * @para callback: {Function} 弹窗类型，默认为全屏，即三级筛选样式，"inner"为小弹窗样式
     * @para submitCallback: {Function} 全屏弹窗确认按钮回调函数
     * @para cls: {String} 弹窗新增样式
     * @para system: {Boolean} 是否调用系统弹窗，默认为否
     * @para systemSettings: {object} 系统弹窗设置
     * @example new LTouch.Widget.Popbox({
     *          //弹窗提示文字
     *          title:"弹窗提示文字",
     *          //小弹窗
     *          type: "inner"
     * })
     * @example new LTouch.Widget.Popbox({
     *          //使用系统弹窗
     *          system: true,
     *          systemSettings：{
     *              //弹窗提示文字
     *              str: "弹窗提示文字",
     *              //点击系统弹窗确认触发函数
     *              ok: function(){
     *                  alert("点击了确定")
     *              }
     *          }
     *          
     *          
     * })
     * 
     */
    LTouch.Widget.Popbox = function(settings){
       this.settings = settings || {};
       this.html = this.settings.html || '';
       this.contentId = this.settings.contentId || '';
       this.effect = this.settings.effect || 'pop';
       this.title = this.settings.title || "提示框";
       this.type = this.settings.type || "fullscreen";
       this.callback = this.settings.callback || function(){};
       this.submitCallback = this.settings.submitCallback || function(){};
       this.cls = this.settings.cls || "";
       this.system = this.settings.system || false;
       this.systemSettings = this.settings.systemSettings || {};
       this.loadTime = this.settings.loadTime || 800;
       this.initializer();
    }

    LTouch.Widget.Popbox.prototype = {
        initializer : function(){
            var self = this;
            self.winH = document.documentElement.offsetHeight;
            var tpl = self.type == "fullscreen" ? '<div id="Touch_Popbox" class="touch-popbox"><div class="title-ui-a"><div class="back-ui-a"><a href="###">返回</a></div> <div class="header-title">${title}</div><div class="title-submit-ui-a"><a id="popsubmit" href="###">确定</a></div></div><div id="Pop_Cotent"></div></div>' : '<div id="Touch_Popbox" class="touch-inner-popbox hide"><div id="Pop_Cotent">${title}</div></div>';
            self.html = LTouch.HTMLTemplate(tpl,{title: self.title});
            this.systemComfirm();
            if(this.system){return}
            if($("#Touch_Popbox").length < 1){
                $("body").append(self.html);
                LTouch.rBlur();
            }
            if(self.type != "fullscreen"){
                self.mini();
            }else{
                self.start();
                $("#Touch_Popbox").find(".back-ui-a").click(function(){
                    self.end();
                })
                if(self.callback){
                    self.callback();
                }
                self.submit();
            }    
        },
        start: function(){
            var self = this;
            var box = $("#Touch_Popbox");
            box.css("-webkit-transform-origin", "50% " + ($(window).height()/2) + "px");
            if(LTouch.checkDetect().ios || LTouch.checkDetect().browser == "applewebkit"){
                box.addClass(self.effect).removeClass(self.effect+"Out").addClass(self.effect+"In")
            }else{
                box.show();
            }
            //box.addClass(self.effect).removeClass(self.effect+"Out").addClass(self.effect+"In")//.show();
            $("#Pop_Cotent").html($(self.contentId).show());
            document.querySelector("#Touch_Popbox").style.minHeight = self.winH + "px";
        },
        end: function(){
            var self = this;
            if(LTouch.checkDetect().ios || LTouch.checkDetect().browser == "applewebkit"){
                $("#Touch_Popbox").addClass(self.effect+"Out").removeClass(self.effect)//.hide();
            }else{
                $("#Touch_Popbox").hide();
            }
            
            $("#for-android").remove();
        },
        submit: function(){
            var self = this;
            $("#popsubmit").click(function(){
                self.end();
                if(self.submitCallback){
                    self.submitCallback();
                }
            })
        },
        mini: function(){
            var self = this;
            var box = $("#Touch_Popbox");
            if(self.cls){
                box.addClass(self.cls);
            }
            //$("#Pop_Cotent").html($(self.contentId).show());
            box.css({
                left: document.body.offsetWidth/2 - box.width()/2,
                top: document.body.scrollTop + $(window).height()/2 - box.height()/2
            });
            box.fadeIn(500).delay(1000).fadeOut(self.loadTime, function(){
                box.remove();
            });

        },
        systemComfirm: function(){
            var o = this.systemSettings;
            if(!this.system){return}
            var d = {
                str: "",
                ok: function(){},
                cancel: function(){}
            }
            $.extend(d,o);
            if(confirm(d.str)){
                d.ok();
            }else{
                d.cancel();
            }
        }
        
    }

    //倒计时
    LTouch.Widget.Countdown = function(opt){
        var T = new Date();
        this.opt = opt || {};
        this.year = this.opt.year || T.getFullYear();
        this.month = this.opt.month || T.getMonth();
        this.day = this.opt.day || T.getDate();
        this.hour = this.opt.hour || T.getHours();
        this.minute = this.opt.minute || T.getMinutes();
        this.second = this.opt.second || T.getSeconds();
        this.Msecond = this.opt.Msecond || T.getMilliseconds();
        this.time = this.opt.time || T.getTime();
        this.yId = this.opt.yId || "#Year";
        this.mId = this.opt.mId || "#Month";
        this.dId = this.opt.dId || "#Day";
        this.hId = this.opt.hId || "#Hour";
        this.minuteId = this.opt.minuteId || "#Minute";
        this.sId = this.opt.sId || "#Second";
        this.MsId = this.opt.MsId || "#Msecond";
        this.speed = this.opt.speed || 1000;
        this.callback = this.opt.callback || function(){};
    }

    LTouch.Widget.Countdown.prototype = {
        timer: null,
        M: function(){

        },
        parse: function(){
            var t = this.time/this.speed;
            this.second = parseInt(t%60);
            this.minute = parseInt((t/60)%60);
            this.hour = parseInt((t/60/60)%24);
            this.day = parseInt(t/60/60/24);
            if(this.second < 10){this.second = "0" + this.second;}
            if(this.minute < 10){this.minute = "0" + this.minute;}
        },
        start: function(){
            var self = this;
            self.parse();
            this.timer = setTimeout(function(){
                self.run()
                self.changeDom();
            },self.speed);
        },
        run: function(){
            this.time -= this.speed;
            this.start();  
        },
        changeDom: function(){
            if(this.time >= 0 ){
                $(this.yId).html(this.year);
                $(this.mId).html(this.month);
                $(this.dId).html(this.day);
                $(this.hId).html(this.hour);
                $(this.minuteId).html(this.minute);
                $(this.sId).html(this.second);
                $(this.MsId).html(this.Msecond);
            }else{
                this.cb();
                clearTimeout(this.timer);
                timer = null;
            }   
        },
        cb: function(){
            if(typeof this.callback == "function"){
                this.callback();
            }
        }
    }
    $.extend(LTouch.Widget, LTouch);

    window.LTouch = window.SN = LTouch;

    // return LTouch;

})(window);




