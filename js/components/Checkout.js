var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var CheckoutTicket = require('./CheckoutTicket');
var CheckoutTimer = require('./CheckoutTimer');
var ReservationLoading = require('./ReservationLoading');
var Header = require('./Header');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Checkout = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore"), Navigation],

	stripeCheckInterval: null,

	getInitialState: function() {
		return {
			timerHasExpired: false,
			hasStripe: false
		}
	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		return {
			tickets: BuyTicketsStore.tickets,
			formData: BuyTicketsStore.formData,
			checkoutExpireTime: BuyTicketsStore.checkoutExpireTime,
			totalPrice: BuyTicketsStore.totalPrice,
			checkoutSuccess: BuyTicketsStore.checkoutSuccess,
			checkoutError: BuyTicketsStore.checkoutError,
			reserveSessionId: BuyTicketsStore.reserveSessionId,
			isLoadingCheckout: BuyTicketsStore.isLoadingCheckout
		};

	},

	handleClickBack: function() {

		this.transitionTo('/select-seats');

	},

	handleTimeExpired: function() {

		if (!this.state.isLoadingCheckout && !this.state.checkoutSuccess)
		{
			alert('Your reservation time has expired. Please go back and start your order again.');
			this.transitionTo('/');
		}
		else
		{
			this.setState({timerHasExpired: true});
		}

	},

	handleCheckoutCompletd: function() {
		this.transitionTo('/checkout-finish');
	},

	handleCheckout: function() {

		var handler = StripeCheckout.configure({
			key: 'pk_test_4XeVhaeYMMQeeQPayeee7e8R',
			token: function(token) {
				// Use the token to create the charge with a server-side script.
				// You can access the token ID with `token.id`

				// init checkout
				this.getFlux().actions.BuyTicketsActions.checkout(this.state.formData, this.state.tickets, this.state.totalPrice, token.id, this.state.reserveSessionId);

			}.bind(this)
		});

		handler.open({
			name: 'LAN WAR X',
			description: 'Tickets',
			amount: this.state.totalPrice * 100,
			email: this.state.formData.email
		});

	},

	redirectToStart: function() {

		this.transitionTo('/');

	},

	checkForStripe: function() {

		if (typeof(StripeCheckout) != "undefined") {
			clearInterval(this.stripeCheckInterval);
			this.setState({hasStripe: true});
		}

	},
	
	componentDidMount: function() {

		$('#scriptContainer').append('<script type="text/javascript" src="https://checkout.stripe.com/checkout.js"></script>');
		this.getFlux().actions.BuyTicketsActions.initCheckout();
		this.stripeCheckInterval = setInterval(this.checkForStripe, 3000);

	},

	render: function() {

		if (this.state.checkoutSuccess === true)
			this.handleCheckoutCompletd();

		// if (this.state.checkoutError && this.state.timerHasExpired === true)
		// 	this.redirectToStart();

		// if (!this.state.isLoadingCheckout && this.state.timerHasExpired && !this.state.checkoutSuccess)
		// 	this.handleTimeExpired();

		var ticketRows = [];
		var firstName = this.state.formData.firstName;
		var lastName = this.state.formData.lastName;
		var email = this.state.formData.email;

		$.each(this.state.tickets, function(index, ticket) {
			ticketRows.push(<CheckoutTicket ticket={ticket}/>);
		});

		if (!ticketRows.length || !firstName || !lastName || !email)
			this.transitionTo('/');

		var checkoutButton;
		if (!this.state.hasStripe) {
			checkoutButton = <button className="btn btn-primary disabled">Checkout</button>;
		}
		else {
			checkoutButton = <button className="btn btn-primary" onClick={this.handleCheckout}>Checkout</button>;
		}

		return (
			<div>
				<Header />
				<div className="container">
					<div className="row">
						<div className="col-md-2"></div>
						<div className="col-md-8">
							<h2>Order Summary</h2>

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

							<h2>Tickets</h2>
							<table className="table">
							<thead>
							<tr>
								<th>Ticket Type</th>
								<th>Price</th>
								<th>Seat</th>
							</tr>
							</thead>
							<tbody>
								{ticketRows}
							</tbody>
							<tfoot>
							<tr>
								<th>Total</th>
								<th>${this.state.totalPrice.toFixed(2)}</th>
								<th></th>
							</tr>
							</tfoot>
							</table>
						</div>
						<div className="col-md-2"></div>
					</div>
					<div className="row">
						<div className="col-md-2"></div>
						<div className="col-md-4">
							<CheckoutTimer onTimeExpired={this.handleTimeExpired} timeoutAt={this.state.checkoutExpireTime}/>
						</div>
						<div className="col-md-4 buttons-container">
							<button className="btn btn-default" onClick={this.handleClickBack}>Back</button>
							{checkoutButton}
						</div>
						<div className="col-md-2"></div>
					</div>
				</div>
				<div id="scriptContainer"></div>
				<ReservationLoading show={this.state.isLoadingCheckout && !this.state.checkoutSuccess && !this.state.checkoutError } text="Checking out&hellip;" />
			</div>
		)

	}

});

module.exports = Checkout;