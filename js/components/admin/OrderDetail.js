var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var moment = require("moment");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Header = require('../Header');

var OrderDetail = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminOrdersStore"), Navigation],

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var AdminOrdersStore = flux.store("AdminOrdersStore").getState();
		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			user: UserAccountStore.user,
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoadingOrderDetail: AdminOrdersStore.isLoadingOrderDetail,
			orderDetail: AdminOrdersStore.orderDetail
		};

	},

	componentDidMount: function() {

		this.getFlux().actions.AdminOrdersActions.getOrderDetail(this.context.router.getCurrentParams().orderId);

	},

	handleCheckInClick: function(ticketId, e) {

		var confirmCheckIn = window.confirm("Are you sure you want to check in ticket #" + ticketId + "?");

		if (confirmCheckIn == true) {
			this.getFlux().actions.AdminOrdersActions.checkInTicketById(ticketId);
		}

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.transitionTo('/');

		if (this.state.isLoadingOrderDetail) {
			return (
				<div>
					<Header />
					<div className="container-fluid body">
						<div className="container">
							<div className="row">
								<div className="col-md-12">
									<h2>Order #{this.context.router.getCurrentParams().orderId}</h2>

									<div className="loading-circle padding"><i className="fa fa-circle-o-notch fa-spin fa-4x"></i></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		var orderDetail = this.state.orderDetail;

		orderDetail.createdMoment = moment(orderDetail.created, "X");
		orderDetail.createdNice = orderDetail.createdMoment.format("MMM Do, YYYY @ h:mm a");

		var ticketRows = [];
		for (var i = 0; i < orderDetail.tickets.length; i++) {
			var ticket = orderDetail.tickets[i];

			if (ticket.isLoadingCheckIn) {
				var checkedIn = <span className="checked-in loading">Checking In... <i className="fa fa-circle-o-notch fa-spin"></i></span>;
			}
			else if (ticket.isCheckedIn) {
				var checkInMoment = moment(ticket.checkInDate, "X");

				if (checkInMoment.isSame(moment(), 'day'))
					var checkInNice = "Today @ ";
				else if (checkInMoment.diff(moment(), 'days') == -1)
					var checkInNice = "Yesterday @ ";
				else
					var checkInNice = checkInMoment.format("MMM D, YYYY @ ");

				checkInNice += checkInMoment.format("h:mm a");

				var checkedIn = <span className="checked-in">{checkInNice}</span>;
			}
			else {
				var checkedIn = <span className="checked-in not"><a onClick={this.handleCheckInClick.bind(this, ticket.id)}>Not Checked In, Click to Check In</a></span>;
			}

			ticketRows.push(<tr key={ticket.id}><td>{ticket.id}</td><td>{ticket.type}</td><td>{ticket.user.firstName} {ticket.user.lastName}</td><td>{checkedIn}</td></tr>);
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Order #{this.context.router.getCurrentParams().orderId}</h2>

								<div className="row">
									<div className="col-md-4">
										<h3>Order Details</h3>
										<table className="table table-striped">
										<tr>
											<th>Date Created:</th>
											<td>{orderDetail.createdNice}</td>
										</tr>
										<tr>
											<th>First Name:</th>
											<td>{orderDetail.user.firstName}</td>
										</tr>
										<tr>
											<th>Last Name:</th>
											<td>{orderDetail.user.lastName}</td>
										</tr>
										<tr>
											<th>Gamer Tag:</th>
											<td>{orderDetail.user.gamerTag}</td>
										</tr>
										</table>
									</div>
								</div>

								<div className="row">
									<div className="col-md-6">
										<h3>Tickets</h3>
										<table className="table table-striped">
										<thead>
										<tr>
											<th>Ticket #</th>
											<th>Type</th>
											<th>Assigned To</th>
											<th>Checked In?</th>
										</tr>
										</thead>
										<tbody>
											{ticketRows}
										</tbody>
										</table>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		);

	}

});

module.exports = OrderDetail;