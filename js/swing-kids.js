/*Swing Kids Javascript File*/

$(function() {
	console.log('document loaded');

    // make home button button-ey
    $(".navbar-brand").mouseenter(function() {
        $("#logo").attr("src", "images/logo-purple.png");
    }).mouseleave(function() {
        if(!($('.navbar-brand').hasClass('active'))) {
            $("#logo").attr("src", "images/logo-white.png");
        }
    });

    // photo viewer
    Galleria.loadTheme('galleria/themes/classic/galleria.classic.min.js');
    Galleria.run('#galleria', {
        flickr: 'set:72157639983552474',
        flickrOptions: {
            sort: 'date-posted-asc'
        }
    });

    // pull from google calendars and display events for today
	danceOfTheDay();
    // custom easing effect
	scrolling();
    $(window).change(function() {
        scrolling();
    });
    // parallax headers
    $.stellar({
         horizontalScrolling: false
    });


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

    $('a').click(function() {
        if(!$(this).hasClass('event-restore-default')) {
            event.preventDefault();
            $('html,body').animate({
              scrollTop: $($(this).attr('href')).offset().top - 50
            }, 1000);
        }
    });
}