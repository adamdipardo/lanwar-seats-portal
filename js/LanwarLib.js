var moment = require('moment');
var React = require('react');

var LanwarLib = {
	getNiceCheckInTime: function(time) {
		var checkInMoment = moment(time, "X");

		if (checkInMoment.isSame(moment(), 'day'))
			var checkInNice = "Today @ ";
		else if (checkInMoment.isSame(moment().subtract(1, 'days'), 'd'))
			var checkInNice = "Yesterday @ ";
		else
			var checkInNice = checkInMoment.format("MMM D, YYYY @ ");

		checkInNice += checkInMoment.format("h:mm a");

		return <span className="checked-in">{checkInNice}</span>;
	}
};

module.exports = LanwarLib;