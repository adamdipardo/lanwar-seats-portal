var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var moment = require("moment");

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Header = require('../Header');
var Footer = require('../Footer');
var TicketRow = require('./TicketRow');

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

		if (this.context.router.getCurrentQuery()['from-cache'] != 'true' || this.state.orderDetail.id != this.context.router.getCurrentParams().orderId)
			this.getFlux().actions.AdminOrdersActions.getOrderDetail(this.context.router.getCurrentParams().orderId);

	},

	handleCheckInClick: function(ticketId) {

		var confirmCheckIn = window.confirm("Are you sure you want to check in ticket #" + ticketId + "?");

		if (confirmCheckIn == true) {
			this.getFlux().actions.AdminOrdersActions.checkInTicketById(ticketId);
		}

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.transitionTo('/login', {}, {expired: true, return: this.context.router.getCurrentPathname()});

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
					<Footer />
				</div>
			);
		}

		var orderDetail = this.state.orderDetail;

		orderDetail.createdMoment = moment(orderDetail.created, "X");
		orderDetail.createdNice = orderDetail.createdMoment.format("MMM Do, YYYY @ h:mm a");

		var ticketRows = [];
		for (var i = 0; i < orderDetail.tickets.length; i++) {
			ticketRows.push(<TicketRow ticket={orderDetail.tickets[i]} checkInClick={this.handleCheckInClick} allowClick={true} />);
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
											<th>Student Order?</th>
											<td>{orderDetail.isStudent ? 'Yes' : 'No'}</td>
										</tr>
										</table>
									</div>
								</div>

								<div className="row">
									<div className="col-md-8">
										<h3>Tickets</h3>
										<table className="table table-striped">
										<thead>
										<tr>
											<th>Ticket #</th>
											<th>Type</th>
											<th>Options</th>
											<th>Label</th>
											<th>Seat</th>
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
				<Footer />
			</div>
		);

	}

});

module.exports = OrderDetail;