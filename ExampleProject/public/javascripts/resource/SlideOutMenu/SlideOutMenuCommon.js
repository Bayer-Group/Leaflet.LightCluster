window.SlideOutMenuCommon = this;

var slideOutMenu = {
daughterTemplates:  [],
getRidOfData: {},

init: function(){
    var slideoutMenu = $('.slideout-menu');
    var map = $('#map');
    var slideoutMenuWidth = slideoutMenu.width();
    slideoutMenu.animate({left: -slideoutMenuWidth - 60},0); //adjust this as needed

    var moveElements = $('.movable-things');
    var mapTop = map.position().top;
    moveElements.animate({top: mapTop - 40}, 0);
    slideoutMenu.animate({top: mapTop}, 0);

    var mapBottom = map.position().bottom;
    slideoutMenu.animate({bottom: mapBottom}, 0);
},


toggleClose: function() {

    var slideoutMenu = $('.slideout-menu');
    var map = $('#map');
    var slideoutMenuWidth = slideoutMenu.width();
    var moveElements = $('.movable-things');

    var animateSpeed = 250;
        slideoutMenu.animate({
            left: -slideoutMenuWidth - 40
        }, animateSpeed);
        map.animate({left: "1px"}, animateSpeed);
        moveElements.animate({left: "10px"}, animateSpeed);
},

toggleOpen: function(){
    var slideoutMenu = $('.slideout-menu');
    var map = $('#map');
    var moveElements = $('.movable-things');
    var slideoutMenuWidth = slideoutMenu.width();

    var animateSpeed = 250;

        slideoutMenu.animate({
            left: "0px"
        }, animateSpeed);
        map.animate({left: slideoutMenuWidth + 20}, animateSpeed);
        moveElements.animate({left: slideoutMenuWidth + 20}, animateSpeed);
}
};
