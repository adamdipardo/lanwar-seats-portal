var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var LanwarConstants = require('../constants/LanwarConstants');
var LanwarConfig = require('../LanwarConfig');

var CheckoutTicket = require('./CheckoutTicket');
var CheckoutTimer = require('./CheckoutTimer');
var ReservationLoading = require('./ReservationLoading');
var Header = require('./Header');
var Footer = require('./Footer');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Checkout = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore", "UserAccountStore"), Navigation],

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
		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			tickets: BuyTicketsStore.tickets,
			formData: BuyTicketsStore.formData,
			checkoutExpireTime: BuyTicketsStore.checkoutExpireTime,
			totalPrice: BuyTicketsStore.totalPrice,
			checkoutSuccess: BuyTicketsStore.checkoutSuccess,
			checkoutError: BuyTicketsStore.checkoutError,
			reserveSessionId: BuyTicketsStore.reserveSessionId,
			isLoadingCheckout: BuyTicketsStore.isLoadingCheckout,
			isLoggedIn: UserAccountStore.isLoggedIn,
			user: UserAccountStore.user,
			isAdminGuestCheckout: BuyTicketsStore.isAdminGuestCheckout,
			isStudentCheckout: BuyTicketsStore.isStudentCheckout
		};

	},

	handleClickBack: function() {

		var shouldGoToOptions = false;
		$.each(this.state.tickets, function(index, ticket) {
			if (ticket.options.length > 0) {
				shouldGoToOptions = true;
				return false;
			}
		});

		if (shouldGoToOptions)
			this.transitionTo('/choose-options', {}, {back: true});
		else
			this.transitionTo('/', {}, {back: true});

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

	// handleCheckoutCompleted: function() {
	// 	this.transitionTo('/checkout-finish');
	// },

	handleCheckout: function() {

		if (this.state.isAdminGuestCheckout) {
			this.getFlux().actions.BuyTicketsActions.checkout(this.context.router, null, this.state.formData, this.state.tickets, this.state.totalPrice, null, this.state.isAdminGuestCheckout, this.state.isStudentCheckout);
			return;
		}

		var handler = StripeCheckout.configure({
			key: LanwarConfig.stripePK,

			token: function(token) {
				// Use the token to create the charge with a server-side script.
				// You can access the token ID with `token.id`

				var userId = null;
				if (this.state.isLoggedIn && this.state.user && !this.isAdminGuestCheckout)
					userId = this.state.user.userId;

				// init checkout
				this.getFlux().actions.BuyTicketsActions.checkout(this.context.router, userId, this.state.formData, this.state.tickets, this.state.totalPrice, token.id, this.state.isAdminGuestCheckout);

			}.bind(this)
		});

		handler.open({
			name: 'LANWAR X',
			description: 'Tickets',
			amount: this.state.totalPrice * 100,
			email: this.state.formData.email,
			allowRememberMe: false,
			image: 'img/icon-196.png'
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

		// if (this.state.checkoutSuccess === true)
		// 	this.handleCheckoutCompleted();

		var ticketRows = [];
		var firstName = this.state.formData.firstName;
		var lastName = this.state.formData.lastName;
		var email = this.state.formData.email;

		$.each(this.state.tickets, function(index, ticket) {
			
			// get names of chosen options and total price
			var options = [];
			var price = ticket.price;
			if (this.state.isStudentCheckout)
				price -= LanwarConstants.STUDENT_DISCOUNT;
			for (var i = 0; i < ticket.options.length; i++) {
				if (ticket.chosenOptions.indexOf(ticket.options[i].id) > -1) {
					options.push(ticket.options[i].name);
					price += ticket.options[i].price;
				}
			}

			ticketRows.push(<tr key={index}>
				<td>{ticket.name} {options.length ? '('+options.join(', ')+')' : ''}</td>
				<td>${price.toFixed(2)}</td>
			</tr>);
		}.bind(this));

		if (!ticketRows.length || ((!firstName || !lastName || !email) && !this.state.isLoggedIn))
			this.transitionTo('/');

		var checkoutButton;
		if (!this.state.hasStripe) {
			checkoutButton = <button className="btn btn-primary disabled">Initializing Checkout <i className="fa fa-circle-o-notch fa-spin"></i></button>;
		}
		else {
			checkoutButton = <button className="btn btn-primary" onClick={this.handleCheckout}>Checkout</button>;
		}

		var registerFieldsSummary = null;
		if (!this.state.isLoggedIn || this.state.isAdminGuestCheckout) {
			registerFieldsSummary = (
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
								<h2>Order Summary</h2>

								{registerFieldsSummary}

								<h2>Tickets</h2>
								<table className="table">
								<thead>
								<tr>
									<th>Ticket Type</th>
									<th>Price</th>
								</tr>
								</thead>
								<tbody>
									{ticketRows}
								</tbody>
								<tfoot>
								<tr>
									<th>Total</th>
									<th>${this.state.totalPrice.toFixed(2)}</th>
								</tr>
								</tfoot>
								</table>
							</div>
							<div className="col-md-2"></div>
						</div>
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8 buttons-container">
								<button className="btn btn-default" onClick={this.handleClickBack}>Back</button>
								{checkoutButton}
							</div>
							<div className="col-md-2"></div>
						</div>
					</div>
				</div>
				<Footer />
				<div id="scriptContainer"></div>
				<ReservationLoading show={this.state.isLoadingCheckout && !this.state.checkoutSuccess && !this.state.checkoutError } text="Checking out..." />
			</div>
		)

	}

});

module.exports = Checkout;