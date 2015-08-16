var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var ReactTooltip = require("react-tooltip");

var CheckoutTicket = require('./CheckoutTicket');
var Header = require('./Header');
var SetTicketLabelModal = require('./SetTicketLabelModal');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CheckoutFinish = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore", "UserAccountStore", "OrderStore"), Navigation],

	getInitialState: function() {

		return {
			showLabelModal: false,
			labelTicket: null
		};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();
		var UserAccountStore = flux.store("UserAccountStore").getState();
		var OrderStore = flux.store("OrderStore").getState();

		return {
			isLoggedIn: UserAccountStore.isLoggedIn,
			isAdminGuestCheckout: BuyTicketsStore.isAdminGuestCheckout,
			order: OrderStore.order,
			isLoadingOrder: OrderStore.isLoadingOrder
		};

	},

	handleLabelClick: function(ticket) {

		this.setState({showLabelModal: true, labelTicket: ticket});

		setTimeout(function(){$('#label').focus();$('#label').select();}, 100);

	},

	handleCancelSetLabel: function() {

		this.setState({showLabelModal: false, labelTicket: null});

	},

	handleSetLabel: function(ticket, label) {

		this.setState({showLabelModal: false, labelTicket: null});
		this.getFlux().actions.OrderActions.setLabel(this.context.router.getCurrentParams().orderHash, ticket.id, label);

	},

	getTicketsPDF: function() {

		var pdfWindow = window.open('/api/orders/' + this.context.router.getCurrentParams().orderHash + '/tickets/pdf/read');

	},

	componentDidMount: function() {

		if (this.context.router.getCurrentParams().orderHash)
		{
			this.getFlux().actions.OrderActions.getOrder(this.context.router.getCurrentParams().orderHash);
		}

	},

	render: function() {

		if (!this.state.order.user || this.state.isLoadingOrder) {
			return (
				<div>
					<Header />
					<div className="container-fluid body">
						<div className="container">
							<div className="row">
								<div className="col-md-2"></div>
								<div className="col-md-8">
									<div className="loading-circle padding"><i className="fa fa-circle-o-notch fa-spin fa-4x"></i></div>
								</div>
								<div className="col-md-2"></div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		var checkoutMessage;
		if (this.context.router.getCurrentQuery().checkout == 'true') {
			checkoutMessage = (<div className="checkout-box"><h2>Thanks!</h2><p>Below is a summary of your order. We have also emailed you a link to this page, along with a PDF copy of your tickets. Be sure to print and bring ALL tickets with you to the event.</p></div>);
		}

		var ticketRows = [];
		var firstName = this.state.order.user.firstName;
		var lastName = this.state.order.user.lastName;
		var email = this.state.order.user.email;

		var totalPrice = 0.0;
		$.each(this.state.order.tickets, function(index, ticket) {
			ticketRows.push(<CheckoutTicket ticket={ticket} onLabelClick={this.handleLabelClick}/>);
			totalPrice += ticket.price;
		}.bind(this));

		// can user book seats?
		var chooseSeatsButton;
		for (var i = 0; i < this.state.order.tickets.length; i++) {
			if (this.state.order.tickets[i].canBookSeat) {
				chooseSeatsButton = (<a href={"/#/order/"+this.context.router.getCurrentParams().orderHash+"/select-seats"} className="btn btn-primary pull-right choose-tickets-button">Choose or Change Seats</a>);
				break;
			}
		}

		var registerSummary = null;
		if (!this.state.isLoggedIn || this.state.isAdminGuestCheckout) {
			registerSummary = (
				<table className="table">
				<tr>
					<td>First Name: </td>
					<td>{firstName}</td>
				</tr>
				<tr>
					<td>Last Name: </td>
					<td>{lastName}</td>
				</tr>
				<tr>
					<td>Email: </td>
					<td>{email}</td>
				</tr>
				</table>
			);
		}

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8">
								{checkoutMessage}
								<h1>LANWAR X Order #{this.state.order.id}</h1>

								<h2>Order Summary</h2>

								{registerSummary}

								<div className="row">
									<div className="col-sm-6">
										<h2>{this.state.order.tickets.length} Tickets</h2>
									</div>
									<div className="col-sm-6">										
										{chooseSeatsButton}
										<a onClick={this.getTicketsPDF} className="btn btn-primary pull-right choose-tickets-button">Print Tickets</a>
									</div>
								</div>

								<table className="table">
								<thead>
								<tr>
									<th>ID #</th>
									<th>Ticket Type</th>
									<th>Label <i className="fa fa-question-circle" data-tip={"If you have multiple tickets, you can label each to keep track of them."} data-place="top"></i></th>
									<th>Seat</th>
								</tr>
								</thead>
								<tbody>
									{ticketRows}
								</tbody>
								</table>
								<ReactTooltip />
							</div>
							<div className="col-md-2"></div>
						</div>
					</div>
				</div>
				<SetTicketLabelModal show={this.state.showLabelModal} ticket={this.state.labelTicket} onCancelSetLabel={this.handleCancelSetLabel} onLabelSet={this.handleSetLabel}/>
			</div>
		);

	}

});

module.exports = CheckoutFinish;