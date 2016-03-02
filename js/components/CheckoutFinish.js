var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;
var Link = require('react-router').Link;
var ReactTooltip = require("react-tooltip");
var moment = require('moment');

var CheckoutTicket = require('./CheckoutTicket');
var Header = require('./Header');
var Footer = require('./Footer');
var SetTicketLabelModal = require('./SetTicketLabelModal');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CheckoutFinish = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore", "UserAccountStore", "OrderStore"), History],

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

		var pdfWindow = window.open('/api/orders/' + this.props.params.orderHash + '/tickets/pdf/read');

	},

	componentDidMount: function() {

		if (this.props.params.orderHash)
		{
			this.getFlux().actions.OrderActions.getOrder(this.props.params.orderHash);
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
					<Footer />
				</div>
			);
		}

		var checkoutMessage;
		if (this.props.location.query.checkout == 'true') {
			checkoutMessage = (<div className="checkout-box"><h2>Thanks!</h2><p>Below is a summary of your order. We have also emailed you a link to this page, along with a PDF copy of your tickets. Be sure to print and bring ALL tickets with you to the event.</p></div>);
		}

		var ticketRows = [];
		var firstName = this.state.order.user.firstName;
		var lastName = this.state.order.user.lastName;
		var email = this.state.order.user.email;
		var date = moment(this.state.order.created, "X").format("MMMM D, YYYY h:mm a");

		var totalPrice = 0.0;
		$.each(this.state.order.tickets, function(index, ticket) {
			ticketRows.push(<CheckoutTicket key={index} ticket={ticket} onLabelClick={this.handleLabelClick}/>);
			totalPrice += ticket.price;
		}.bind(this));

		// can user book seats?
		var chooseSeatsButton;
		for (var i = 0; i < this.state.order.tickets.length; i++) {
			if (this.state.order.tickets[i].canBookSeat) {
				chooseSeatsButton = (<Link to={"/order/"+this.props.params.orderHash+"/select-seats"} className="btn btn-primary choose-tickets-button">Choose or Change Seats</Link>);
				break;
			}
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

								<table className="table">
								<tbody>
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
								<tr>
									<td>Date: </td>
									<td>{date}</td>
								</tr>
								</tbody>
								</table>

								<div className="row">
									<div className="col-sm-6">
										<h2>{this.state.order.tickets.length} Tickets</h2>
									</div>
									<div className="col-sm-6 checkout-finish-buttons">										
										{chooseSeatsButton}
										<a onClick={this.getTicketsPDF} className="btn btn-primary choose-tickets-button">Print Tickets</a>
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
				<Footer />
				<SetTicketLabelModal show={this.state.showLabelModal} ticket={this.state.labelTicket} onCancelSetLabel={this.handleCancelSetLabel} onLabelSet={this.handleSetLabel}/>
			</div>
		);

	}

});

module.exports = CheckoutFinish;