(function($){
    $(document).ready(function(){
    	 var hh=$(window).height()*0.4;
        $("#tablelist").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y", 
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#tablelist').height($(window).height()*0.40);
        $('#tablelist').find('.mCustomScrollBox').height($(window).height()*0.40+10);
        
        
        var hh=$(window).height()*0.4;
        $("#tablelist_hl").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#tablelist_hl').height($(window).height()*0.30);
        $('#tablelist_hl').find('.mCustomScrollBox').height($(window).height()*0.30+10);
        
        var hh=$(window).height()*0.4;
        $("#ssxtable").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#ssxtable').height($(window).height()*0.52);
        $('#ssxtable').find('.mCustomScrollBox').height($(window).height()*0.52+10);
        
        var hh=$(window).height()*0.4;
        $("#xcztable").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#xcztable').height($(window).height()*0.52);
        $('#xcztable').find('.mCustomScrollBox').height($(window).height()*0.52+10);
        
        
        var hh=$(window).height()*0.4;
        $("#spabottom").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#spabottom').height($(window).height()*0.52);
        $('#spabottom').find('.mCustomScrollBox').height($(window).height()*0.52+10);
        
        var hh=$(window).height()*0.4;
        $("#warlist").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#warlist').height($(window).height()*0.53);
        $('#warlist').find('.mCustomScrollBox').height($(window).height()*0.53 + 10);
        
         var hh=$(window).height()*0.4;
        $("#nfdiv").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#nfdiv').height($(window).height()*0.18);
        $('#nfdiv').find('.mCustomScrollBox').height($(window).height()*0.18 + 10);
        
        
        var hh=$(window).height()*0.4;
        $("#xzqhdiv").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#xzqhdiv').height($(window).height()*0.18);
        $('#xzqhdiv').find('.mCustomScrollBox').height($(window).height()*0.18 + 10);
        
        //这个部分加在 xztree。js中执行，读取数据后在执行
        var hh=$(window).height()*0.4;
        $("#mllist").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:150,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#mllist').height($(window).height()*0.80);
        $('#mllist').find('.mCustomScrollBox').height($(window).height()*0.80 - 10);
        
      //这个部分加在 xztree。js中执行，读取数据后在执行
        var hh=$(window).height()*0.4;
        $("#mllist01").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#mllist01').height($(window).height()*0.80);
        $('#mllist01').find('.mCustomScrollBox').height($(window).height()*0.80 - 10);
        
        
        var hh=$(window).height()*0.4;
        $("#protablist").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#protablist').height($(window).height()*0.69);
        $('#protablist').find('.mCustomScrollBox').height($(window).height()*0.69 - 10);
        
        var hh=$(window).height()*0.4;
        $("#sertablist").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#sertablist').height($(window).height()*0.75);
        $('#sertablist').find('.mCustomScrollBox').height($(window).height()*0.75 + 10);
        
        var hh=$(window).height()*0.4;
        $("#serlist").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#serlist').height($(window).height()*0.62);
        $('#serlist').find('.mCustomScrollBox').height($(window).height()*0.62 + 10);
        
        var hh=$(window).height()*0.4;
        $("#cptblist").mCustomScrollbar({
            setWidth: 'false',            
            setHeight: hh,          
            setTop: 0,          
            setLeft: 0,                 
            axis: "y",             
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#cptblist').height($(window).height()*0.26);
        $('#cptblist').find('.mCustomScrollBox').height($(window).height()*0.26 - 10);

        var hh=$(window).height()*0.4;
        $("#fjxlist").mCustomScrollbar({
            setWidth: 'false',
            setHeight: hh,
            setTop: 0,
            setLeft: 0,
            axis: "y",
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#fjxlist').height($(window).height()*0.34);
        $('#fjxlist').find('.mCustomScrollBox').height($(window).height()*0.34 - 10);

        var hh=$(window).height()*0.4;
        $("#dxlist").mCustomScrollbar({
            setWidth: 'false',
            setHeight: hh,
            setTop: 0,
            setLeft: 0,
            axis: "y",
            scrollInertia:0,
            scrollbarPosition: "inside",
            autoDraggerLength:false,
            autoExpandScrollbar:true,
            alwaysShowScrollbar:0,
            mouseWheel:{
                enable:true,
                scrollAmount:10,
                preventDefault:true,
                invert:false
            },
            scrollButtons:{
                enable:false,
                scrollType:"continuous",
                scrollSpeed:20,
                scrollAmount:40
            },
            advanced:{
                updateOnBrowserResize:true,
                updateOnContentResize:true,
                autoExpandHorizontalScroll:false,
                autoScrollOnFocus:true
            },
            callbacks:{
                onScrollStart:function(){},
                onScroll:function(){},
                onTotalScroll:function(){},
                onTotalScrollBack:function(){},
                onTotalScrollOffset:0,
                whileScrolling:false,
                whileScrollingInterval:30
            }
        });
        $('#dxlist').height($(window).height()*0.72);
        $('#dxlist').find('.mCustomScrollBox').height($(window).height()*0.72 + 5);

    });   
})(jQuery);