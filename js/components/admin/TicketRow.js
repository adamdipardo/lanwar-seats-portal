var React = require('react');
var moment = require('moment');

var LanwarLib = require('../../LanwarLib');

var TicketRow = React.createClass({

	handleCheckInClick: function(ticketId, e) {

		this.props.checkInClick(ticketId);

	},

	render: function() {

		var ticket = this.props.ticket;

		if (ticket.isLoadingCheckIn) {
			var checkedIn = <span className="checked-in loading">Checking In... <i className="fa fa-circle-o-notch fa-spin"></i></span>;
		}
		else if (ticket.isCheckedIn) {
			var checkedIn = LanwarLib.getNiceCheckInTime(ticket.checkInDate);
		}
		else if (this.props.allowClick) {
			var checkedIn = <span className="checked-in not"><a onClick={this.handleCheckInClick.bind(this, ticket.id)}>Not Checked In, Click to Check In</a></span>;
		}
		else {
			var checkedIn = <span className="checked-in not">Not Checked In</span>;
		}

		// get options
		var options = [];
		if (ticket.options.length > 0) {
			for (var i = 0; i < ticket.options.length; i++)
				options.push(ticket.options[i].name);
		}

		// show seat description
		var seat;
		if (ticket.seat.name)
			seat = ticket.seat.name;
		else if (ticket.canBookSeat == true)
			seat = "No Seat Assigned";
		else
			seat = "Not available";

		return (
			<tr key={ticket.id}>
				<td>{ticket.id}</td>
				<td>{ticket.type}</td>
				<td>{options.join(', ')}</td>
				<td>{ticket.label || "No Label Set"}</td>
				<td>{seat}</td>
				<td>{checkedIn}</td>
			</tr>
		);

	}

});

module.exports = TicketRow;