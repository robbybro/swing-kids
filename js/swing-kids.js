/*Swing Kids Javascript File*/

$(function() {
	console.log('document loaded');
	danceOfTheDay();
	scrolling();

	$(window).stellar();

    var links = $('.navigation').find('li');
    slide = $('.slide');
    page = $('.page');
    mywindow = $(window);
    htmlbody = $('html,body');
    button= $('.nav li');
    var offsetDir=0;
    var screenWidth=$(window).width();

    if(screenWidth<600){
        slide.attr('data-stellar-ratio', 1);
        slide.attr('data-stellar-background-ratio', 1);

    }

    // mywindow.scroll(function () {
    //     if (mywindow.scrollTop() == 0) {
    //         $('.nav li[data-slide="1"]').addClass('active');
    //         $('.nav li[data-slide="2"]').removeClass('active');
    //     }
    // });

    // page.each(function() {
    //         if ( $(this).isInViewport({"tolerance": 10}) ){
    //             dataslide = $(this).attr('data-slide');
    //             $('.nav li[data-slide="' + dataslide + '"]').addClass('active');
    //             $(this).find('.title-slide').stop().fadeTo( "fast", 1 );
    //             $(this).find('.content-slide').stop().fadeTo( "fast", 1 );
    //         }
    //         else{
    //             dataslide = $(this).attr('data-slide');
    //             $('.nav li[data-slide="' + dataslide + '"]').removeClass('active');
    //             $(this).find('.title-slide').stop().fadeTo( "fast", 0.2 );
    //             $(this).find('.content-slide').stop().fadeTo( "fast", 0.2 ); 
    //         }
    // });

    $(window).scroll(function() {
            page.each(function() {
                if ( $(this).isInViewport({"tolerance": 100}) ){
                    dataslide = $(this).attr('data-slide');
                    $('.nav li[data-slide="' + dataslide + '"]').addClass('active');
                    $(this).find('.title-slide').stop().animate({opacity:1,top:30},500);
                    $(this).find('.content-slide').stop().animate({opacity:1,top:0},1800,'easeOutCirc');
                }
                else{
                    dataslide = $(this).attr('data-slide');
                    $('.nav li[data-slide="' + dataslide + '"]').removeClass('active');
                    $(this).find('.title-slide').stop().animate({opacity:0.2,top:0},500);
                    $(this).find('.content-slide').stop().animate({opacity:0.2,top:30},1800,'easeOutCirc');

                }
            });
    });
});

// queries google calendars RESTful API to get the day's events from Swing Kids Events Calendar in their gmail account
// reference to google calendar api: https://developers.google.com/google-apps/calendar/v3/reference/events/list
function danceOfTheDay() {
	// set up the url path to the public Swing Kids Calendar
	var calendarUrl = "https://www.googleapis.com/calendar/v3/calendars/";
	var calendarId = "uw.edu_586fk86vac01c9g4dupul2in04@group.calendar.google.com/"
	calendarUrl += (calendarId + "events/");
	var googleAPIKey = "AIzaSyCkbETZTX1Saim3-NW-UEOgyTqEBTXM0qY";

	// set date parameters: today at 12 am until tomorrow at 12 am
	var startDate = new Date();
	// set time to midnight of this morning (this morning being whichever day the page was accessed)
	startDate.setHours(0);
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);
	// end date is exactly 24 hours after start date
	var endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000));
	// convert date parameters to the format that google takes 
	startDate = startDate.toISOString();
	endDate = endDate.toISOString();
	calendarUrl += ("?timeMin=" + startDate + "&timeMax=" + endDate);
	calendarUrl+= ("&key=" + googleAPIKey);

	// ajax request
	$.get(calendarUrl, function(data, status) {
		renderDanceOfTheDay(data);
		console.log('querying Google Calendar API was ' + status);
		console.log('url queried: ' + calendarUrl);
	});
}

// Renders dance of the day in the widget
// Requirements: there must be at least one event, all events must have names and times
// Optional: 	 Description, Place
function renderDanceOfTheDay(data) {
	var calendarData = $('#calendar-data');
	//	console.log('data' + data.items[0].description);
	if(data.items.length == 0) { // check to make sure there are events today
		calendarData.html('No events today');
	} else {
		var numEvents = 0; // keep track of how many events were loaded
		var eventItemTemplate = $('.event-item-template');
		$.each(data.items, function(){
			if(this.summary != undefined) { // no title
				numEvents++;
				var eventItem = eventItemTemplate.clone();
				// craft time stamp
				var startHours = new Date(this.start.dateTime).getHours();
				var startMinutes = new Date(this.start.dateTime).getMinutes();
				var endHours = new Date(this.end.dateTime).getHours();
				var endMinutes = new Date(this.end.dateTime).getMinutes();
				// figure out am or pm and convert pm's down (Google uses 24 hour system instead of 12)
				var start = (startHours % 12) + ":" + startMinutes;
				var end = (endHours % 12) + ":" + endMinutes;
				if(startHours / 12 < 1) {
					start += " am";
				} else {
					start += " pm";
				}
				if(endHours / 12 < 1) {
					end += " am";
				} else {
					end += " pm"; 
				}

				console.log("Event #" +  numEvents + " - start time: " + start + ", end time: " + end + ", title: " + this.summary + ", location: " + this.location + ", description: " + this.description);

				eventItem.find('.event-summary').html(this.summary); // summary = title of event in google speak
				eventItem.find('.event-time').append("When: " + start + "-" + end);
				// location and description optional
				if(this.location != undefined) {
					eventItem.find('.event-location').append("Where: " + this.location)
				}
				if(this.description != undefined) {
					eventItem.find('.event-description').append("Description: " + this.description);
				}
				calendarData.append(eventItem);
			}
		}); // .each
	}
}

function scrolling() {
	'use strict';

    // Feature Test
    if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

            // Function to animate the scroll
            var smoothScroll = function (anchor, duration, easing) {

                    // Functions to control easing
                    var easingPattern = function (type, time) {
                            if ( type == 'easeInQuad' ) return time * time; // accelerating from zero velocity
                            if ( type == 'easeOutQuad' ) return time * (2 - time); // decelerating to zero velocity
                            if ( type == 'easeInOutQuad' ) return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
                            if ( type == 'easeInCubic' ) return time * time * time; // accelerating from zero velocity
                            if ( type == 'easeOutCubic' ) return (--time) * time * time + 1; // decelerating to zero velocity
                            if ( type == 'easeInOutCubic' ) return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
                            if ( type == 'easeInQuart' ) return time * time * time * time; // accelerating from zero velocity
                            if ( type == 'easeOutQuart' ) return 1 - (--time) * time * time * time; // decelerating to zero velocity
                            if ( type == 'easeInOutQuart' ) return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
                            if ( type == 'easeInQuint' ) return time * time * time * time * time; // accelerating from zero velocity
                            if ( type == 'easeOutQuint' ) return 1 + (--time) * time * time * time * time; // decelerating to zero velocity
                            if ( type == 'easeInOutQuint' ) return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
                            return time; // no easing, no acceleration
                    };

                    // Calculate how far and how fast to scroll
                    // http://www.quirksmode.org/blog/archives/2008/01/using_the_assig.html
                    var startLocation = window.pageYOffset;
                    var endLocation = function (anchor) {
                            var distance = 0;
                            if (anchor.offsetParent) {
                                    do {
                                            distance += anchor.offsetTop;
                                            anchor = anchor.offsetParent;
                                    } while (anchor);
                            }
                            return distance;
                    };
                    var distance = endLocation(anchor) - startLocation;
                    var increments = distance / (duration / 16);
                    var timeLapsed = 0;
                    var percentage, position, stopAnimation;

                    // Scroll the page by an increment, and check if it's time to stop
                    var animateScroll = function () {
                            timeLapsed += 16;
                            percentage = ( timeLapsed / duration );
                            percentage = ( percentage > 1 ) ? 1 : percentage;
                            position = startLocation + ( distance * easingPattern(easing, percentage) );
                            window.scrollTo(0, position);
                            stopAnimation();
                    };

                    // Stop the animation
                    if ( increments >= 0 ) { // If scrolling down
                            // Stop animation when you reach the anchor OR the bottom of the page
                            stopAnimation = function () {
                                    var travelled = window.pageYOffset;
                                    if ( (travelled >= (endLocation(anchor) - increments)) || ((window.innerHeight + travelled) >= document.body.offsetHeight) ) {
                                            clearInterval(runAnimation);
                                    }
                            };
                    } else { // If scrolling up
                            // Stop animation when you reach the anchor OR the top of the page
                            stopAnimation = function () {
                                    var travelled = window.pageYOffset;
                                    if ( travelled <= (endLocation(anchor) || 0) ) {
                                            clearInterval(runAnimation);
                                    }
                            };
                    }

                    // Loop the animation function
                    var runAnimation = setInterval(animateScroll, 16);

            };

            // For each smooth scroll link
            var scrollToggle = document.querySelectorAll('.scroll');
            [].forEach.call(scrollToggle, function (toggle) {

                    // When the smooth scroll link is clicked
                    toggle.addEventListener('click', function(e) {

                            // Prevent the default link behavior
                            e.preventDefault();

                            // Get anchor link and calculate distance from the top
                            var dataID = toggle.getAttribute('href');
                            var dataTarget = document.querySelector(dataID);
                            var dataSpeed = toggle.getAttribute('data-speed');
                            var dataEasing = toggle.getAttribute('data-easing'); // WL: Added easing attribute support.

                            // If the anchor exists
                            if (dataTarget) {
                                    // Scroll to the anchor
                                    smoothScroll(dataTarget, dataSpeed || 500, dataEasing || 'easeInOutCubic');
                            }

                    }, false);

            });

    }

}