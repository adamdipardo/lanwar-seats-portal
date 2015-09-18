var React = require('react');
var Fluxxor = require('fluxxor');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TicketRow = require('./TicketRow');

var CheckInModal = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("CheckInStore")],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var CheckInStore = flux.store("CheckInStore").getState();

		return {
			isLoadingCheckIn: CheckInStore.isLoadingCheckIn,
			checkInError: CheckInStore.checkInError,
			checkInTicket: CheckInStore.checkInTicket,
			checkInOrder: CheckInStore.checkInOrder
		};

	},

	dismiss: function() {

		this.getFlux().actions.CheckInActions.dismissCheckIn();

	},

	componentWillUnmount: function() {

		this.getFlux().actions.CheckInActions.dismissCheckIn();

	},

	render: function() {

		if (!this.state.isLoadingCheckIn && !this.state.checkInError && typeof(this.state.checkInTicket.id) == "undefined")
			return <div></div>;

		if (this.state.isLoadingCheckIn) {
			return (
				<Modal dialogClassName='loading-modal' animation={false} bsSize="small">
					<i className="fa fa-circle-o-notch fa-spin fa-4x"></i>
					<p>Checking In...</p>
				</Modal>
			);
		}

		if (this.state.checkInError) {

			var orderInfo;
			if (typeof(this.state.checkInOrder) != "undefined" && typeof(this.state.checkInOrder.tickets) != "undefined") {
				var ticketRows = [];

				for (var i = 0; i < this.state.checkInOrder.tickets.length; i++) {
					ticketRows.push(<TicketRow ticket={this.state.checkInOrder.tickets[i]} allowClick={false}/>);
				}

				orderInfo = (
					<div>
						<h4>Tickets in Order #{this.state.checkInOrder.id}</h4>

						<table className="table">
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

						<div className="modal-buttons">
							<a href={"/#/admin/orders/" + this.state.checkInOrder.id} className="pull-right btn btn-primary">View Order #{this.state.checkInOrder.id}</a> 
							<a onClick={this.dismiss} className="pull-right btn btn-default">Scan Again</a>
							<div className="clearfix"></div>
						</div>
					</div>
				);
			}
			else {
				orderInfo = (
					<div className="modal-buttons">
						<a onClick={this.dismiss} className="pull-right btn btn-default">Scan Again</a>
						<div className="clearfix"></div>
					</div>
				);
			}

			return (
				<Modal dialogClassName='check-in error' animation={false}>
					<p>ERROR: {this.state.checkInError}</p>
					{orderInfo}
				</Modal>
			);
		}

		if (typeof(this.state.checkInTicket.id) != "undefined") {

			// get options
			var options = [];
			if (this.state.checkInTicket.options.length > 0) {
				for (var i = 0; i < this.state.checkInTicket.options.length; i++)
					options.push(this.state.checkInTicket.options[i].name);
			}

			return (
				<Modal dialogClassName='check-in success' animation={false}>
					<i className="fa fa-check-circle fa-4x"></i>
					<h3>Check in successful</h3>
					<table className="table table-striped">
					<tbody>
					<tr>
						<td>Order #</td>
						<td>{this.state.checkInTicket.orderId}</td>
					</tr>
					<tr>
						<td>Is Student?</td>
						<td>{this.state.checkInTicket.order.isStudent ? 'Yes' : 'No'}</td>
					</tr>
					<tr>
						<td>Ticket #</td>
						<td>{this.state.checkInTicket.id}</td>
					</tr>
					<tr>
						<td>Seat</td>
						<td>{this.state.checkInTicket.seat.name || "No seat assigned"}</td>
					</tr>
					<tr>
						<td>Type</td>
						<td>{this.state.checkInTicket.type}</td>
					</tr>
					<tr>
						<td>Options</td>
						<td>{options.join(', ')}</td>
					</tr>
					<tr>
						<td>Label</td>
						<td>{this.state.checkInTicket.label || "No Label"}</td>
					</tr>
					<tr>
						<td>First Name</td>
						<td>{this.state.checkInTicket.order.user.firstName}</td>
					</tr>
					<tr>
						<td>Last Name</td>
						<td>{this.state.checkInTicket.order.user.lastName}</td>
					</tr>
					</tbody>
					</table>

					<div className="modal-buttons">
						<a href={"/#/admin/orders/" + this.state.checkInTicket.orderId} className="pull-right btn btn-primary">View Order #{this.state.checkInTicket.orderId}</a> 
						<a onClick={this.dismiss} className="pull-right btn btn-default">Scan Another</a>
						<div className="clearfix"></div>
					</div>
				</Modal>
			);
		}

	}

});

module.exports = CheckInModal;