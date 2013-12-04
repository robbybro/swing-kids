/*Swing Kids Javascript File*/

$(function() {
	console.log('document loaded');
	danceOfTheDay();
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
	// set time to midnight on the morning of the day the page is accessed
	startDate.setHours(0);
	startDate.setMinutes(0);
	startDate.setSeconds(0);
	startDate.setMilliseconds(0);

	console.log('start date: ' + startDate);
	var endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000));
	console.log('end date: ' + endDate);
	// convert date parameters to the format that google takes
	startDate = startDate.toISOString();
	endDate = endDate.toISOString();
	calendarUrl += ("?timeMin=" + startDate + "&timeMax=" + endDate);
	calendarUrl+= ("&key=" + googleAPIKey);

	// ajax request
	$.get(calendarUrl, function(data, status) {
		renderDanceOfTheDay(data);
		console.log('querying Google Calendar API was ' + status);
	});


	// console.log(calendarUrl);
}

// renders dance of the day on the page.
function renderDanceOfTheDay(data) {
	var calendarData = $('#calendar-data');
	//	console.log('data' + data.items[0].description);
	if(data.items.length == 0) { // check to make sure there are events today
		calendarData.html('No events today');
	} else {
		var eventItemTemplate = $('.event-item-template');
		$.each(data.items, function(){
			var eventItem = eventItemTemplate.clone();
			// craft time stamp
			var startHours = new Date(this.start.dateTime).getHours();
			var startMinutes = new Date(this.start.dateTime).getMinutes();
			var endHours = new Date(this.end.dateTime).getHours();
			var endMinutes = new Date(this.end.dateTime).getMinutes();
			var start = (startHours % 12) + ":" + startMinutes;
			var end = (endHours % 12) + ":" + endMinutes;

			if(startHours / 12 < 1) {
				start += " am";
			} else {
				// pm
				start += " pm";
			}

			if(endHours / 12 < 1) {
				// am
				end += " am";
			} else {
				// pm
				end += " pm";
			}
			console.log("start: " + start + ", end: " + end);

			eventItem.find('.event-time').append(start + "-" + end);
			eventItem.find('.event-location').append(this.location)
			eventItem.find('.event-summary').html(this.summary);
			eventItem.find('.event-description').append(this.description);
			calendarData.append(eventItem);
		}); // .each
	}
}