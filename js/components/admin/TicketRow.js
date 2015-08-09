var React = require('react');
var moment = require('moment');

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
			var checkInMoment = moment(ticket.checkInDate, "X");

			if (checkInMoment.isSame(moment(), 'day'))
				var checkInNice = "Today @ ";
			else if (checkInMoment.isSame(moment().subtract(1, 'days'), 'd'))
				var checkInNice = "Yesterday @ ";
			else
				var checkInNice = checkInMoment.format("MMM D, YYYY @ ");

			checkInNice += checkInMoment.format("h:mm a");

			var checkedIn = <span className="checked-in">{checkInNice}</span>;
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
				<td>{ticket.user.firstName} {ticket.user.lastName}</td>
				<td>{ticket.seat}</td>
				<td>{checkedIn}</td>
			</tr>
		);

	}

});

module.exports = TicketRow;