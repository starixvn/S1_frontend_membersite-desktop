$(function(){
    $('.dropdown > button').click(function() {
        $('.dropdown-container').toggleClass('active')
    })
    $('html').click(function(n) {
		if($(n.target).parents(".function").length==0) {
			$('.country,.cashier,.wallet,.memberfile').removeClass('active');
		}
	});
    $('.country').click(function() {
        $('.function > div').removeClass('active')
        $(this).addClass('active')
    })
    $('.cashier').click(function() {
        $('.function > div').removeClass('active')
        $(this).addClass('active')
    })    
    $('.wallet').click(function() {
        $('.function > div').removeClass('active')
        $(this).addClass('active')
    })    
    $('.memberfile').click(function() {
        $('.function > div').removeClass('active')
        $(this).addClass('active')
    })
    $('.casinobtn').mouseover(function() {
        $('.subMenu-Wrapper').addClass('active')
        $('.subMenu-Wrapper > div').removeClass('active')
        $('.casinoList').addClass('active')
    })
    $('.livecasinobtn').mouseover(function() {
        $('.subMenu-Wrapper').addClass('active')
        $('.subMenu-Wrapper > div').removeClass('active')
        $('.livecasinoList').addClass('active')
    })
    $('.subMenu-Wrapper').mouseleave(function() {
        $('.subMenu-Wrapper').removeClass('active')
        $('.subMenu-Wrapper > div').removeClass('active')
    })
    $('.listTag > button').click(function() {
        $('.listTag > button').removeClass('active')
        $(this).addClass('active')
    })
    $('.menuSelect').click(function() {
        $('.menuSelect').removeClass('active')
        $(this).addClass('active')
    })
    $('.menuHeader').click(function() {
        $(this).toggleClass('active')
        $(this).siblings().toggle()
    })
    $('.quickLink').click(function() {
        $(this).toggleClass('active')
        $('#chat-widget-container').toggleClass('active')
        if ($(".icon").hasClass("icon-arrow-left2")) {
            $(".icon").removeClass("icon-arrow-left2").addClass("icon-cancel-circle")
        }else {
            $(".icon").removeClass("icon-cancel-circle").addClass("icon-arrow-left2")
        }
    })
    $('#popup').click(function(n) {
        if($(n.target).parents("#popup").length==0) {
            $('#popup,.pop>div').removeClass('active')
		}
    })
    $('.listBody .btnGroup .upload-btn').click(function() {
        $('#popup').addClass('active')
        $('.pop > .upload').addClass('active');
    })
    $('.upload .btnGroup .orange').click(function() {
        $('.pop > .upload').removeClass('active');
        $('.pop > .uploadSuccess').addClass('active');
    })
    $('.listBody .btnGroup .update-btn').click(function() {
        $('#popup').addClass('active')
        $('.pop > .update').addClass('active');
    })    
    $('.update .btnGroup .orange').click(function() {
        $('.pop > .update').removeClass('active');
        $('.pop > .updateSuccess').addClass('active');
    })
    $('.subModuleBody .btnGroup .orange').click(function() {
        $('#popup').addClass('active')
        $('.pop > .Submit').addClass('active');
    })
    $('.subModuleBody .btnGroup .gray').click(function() {
        $('#popup').addClass('active')
        $('.pop > .Cancel').addClass('active');
    })
    $('.Submit .btnGroup .orange').click(function() {
        $('.pop > .Submit').removeClass('active');
        $('.pop > .Success').addClass('active');
    })
});