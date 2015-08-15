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

		return (
			<tr key={ticket.id}>
				<td>{ticket.id}</td>
				<td>{ticket.type}</td>
				<td>{ticket.label || "No Label Set"}</td>
				<td>{ticket.seat.name || "No Seat Assigned"}</td>
				<td>{checkedIn}</td>
			</tr>
		);

	}

});

module.exports = TicketRow;