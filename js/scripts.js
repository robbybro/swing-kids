$(document).ready(function ($) {


    $(window).stellar();

    var links = $('.navigation').find('li');
    slide = $('.slide');
    button = $('.button');
    mywindow = $(window);
    htmlbody = $('html,body');


    slide.waypoint(function (event, direction) {

        dataslide = $(this).attr('data-slide');

        if (direction === 'down') {
            $('.nav li[data-slide="' + dataslide + '"] a').addClass('active').prev().removeClass('active');
        }
        else {
            $('.nav li[data-slide="' + dataslide + '"] a').addClass('active').next().removeClass('active');
        }

    });

 
    mywindow.scroll(function () {
        if (mywindow.scrollTop() == 0) {
            $('.nav li[data-slide="1"]').addClass('active');
            $('.nav li[data-slide="2"]').removeClass('active');
        }
    });



});