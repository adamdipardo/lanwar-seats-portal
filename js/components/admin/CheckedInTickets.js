var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var LanwarLib = require('../../LanwarLib');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Header = require('../Header');
var PagingButtons = require('../PagingButtons');

var CheckedInTickets = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminTicketsStore"), Navigation],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var AdminTicketsStore = flux.store("AdminTicketsStore").getState();
		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoadingTickets: AdminTicketsStore.isLoadingTickets,
			tickets: AdminTicketsStore.tickets,
			ticketsPaging: AdminTicketsStore.ticketsPaging,
			user: UserAccountStore.user,
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck
		};

	},

	componentDidMount: function() {

		this.getFlux().actions.AdminTicketsActions.getTickets(1);

	},

	handleClickNewPage: function(newPage) {

		this.getFlux().actions.AdminTicketsActions.getTickets(newPage);

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.transitionTo('/');

		var ticketRows = [];
		if (this.state.isLoadingTickets == true) {
			ticketRows.push(<tr key={"title-row"}><td colSpan="6" className="loading-row">Loading... <i className="fa fa-circle-o-notch fa-spin"></i></td></tr>)
		}
		else {		
			for (var i = 0; i < this.state.tickets.length; i++) {
				var ticket = this.state.tickets[i];
				var niceCheckInTime = LanwarLib.getNiceCheckInTime(ticket.checkInDate);
				ticketRows.push(<tr key={i}><td>{ticket.id}</td><td>{ticket.user.lastName}</td><td>{ticket.user.firstName}</td><td>{ticket.seat}</td><td>{niceCheckInTime}</td><td><a href={"/#/admin/orders/" + ticket.orderId}>View Order</a></td></tr>);
			}
		}

		var paging = null;
		if (this.state.ticketsPaging.from) {
			paging = (
				<div className="paging">
					<div className="pull-left">
						<p>Showing {this.state.ticketsPaging.from} to {this.state.ticketsPaging.to} of {this.state.ticketsPaging.count}</p>
					</div>
					<div className="pull-right">
						<PagingButtons currentPage={this.state.ticketsPaging.currentPage} lastPage={this.state.ticketsPaging.lastPage} onClickNewPage={this.handleClickNewPage} />
					</div>
				</div>
			);
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Checked-In Tickets</h2>

								{paging}

								<table className="table table-striped">
								<thead>
								<tr>
									<th width="10%">Ticket #</th>
									<th width="15%">Last</th>
									<th width="15%">First</th>
									<th width="25%">Seat</th>
									<th width="25%">Checked-In</th>
									<th width="10%"></th>
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
		);

	}

});

module.exports = CheckedInTickets;