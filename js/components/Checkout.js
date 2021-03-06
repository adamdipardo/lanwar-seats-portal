var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;
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

	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore", "UserAccountStore"), History],

	stripeCheckInterval: null,

	getInitialState: function() {
		return {
			timerHasExpired: false,
			hasStripe: true,
			coupon: ""
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
			isStudentCheckout: BuyTicketsStore.isStudentCheckout,
			isLoadingCouponCheck: BuyTicketsStore.isLoadingCouponCheck,
			couponDiscount: BuyTicketsStore.couponDiscount
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
			this.history.pushState(null, '/choose-options', {back: true});
		else
			this.history.pushState(null, '/', {back: true});

	},

	handleCheckout: function() {

		if (this.state.isAdminGuestCheckout) {
			this.getFlux().actions.BuyTicketsActions.checkout(null, this.state.formData, this.state.tickets, this.state.totalPrice, null, this.state.isAdminGuestCheckout, this.state.isStudentCheckout, this.state.coupon);
			return;
		}
		else if (this.state.totalPrice == 0) {

			var areAllTicketsFree = true;
			$.each(this.state.tickets, function(index, ticket) {
				if (ticket.name != "Spectator") {
					areAllTicketsFree = false;
					return false;
				}
			});

			if (areAllTicketsFree) {
				this.getFlux().actions.BuyTicketsActions.checkout(null, this.state.formData, this.state.tickets, this.state.totalPrice, "free", this.state.isAdminGuestCheckout, null, this.state.coupon);
				return;
			}

		}

		var handler = StripeCheckout.configure({
			key: LanwarConfig.stripePK,

			token: function(token) {
				
				var userId = null;
				// if (this.state.isLoggedIn && this.state.user && !this.isAdminGuestCheckout)
				//	userId = this.state.user.userId;

				// init checkout
				this.getFlux().actions.BuyTicketsActions.checkout(userId, this.state.formData, this.state.tickets, this.state.totalPrice, token.id, this.state.isAdminGuestCheckout, null, this.state.coupon);

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

		this.history.pushState(null, '/');

	},

	checkForStripe: function() {

		if (typeof(StripeCheckout) != "undefined") {
			clearInterval(this.stripeCheckInterval);
			this.setState({hasStripe: true});
		}

	},
	
	componentDidMount: function() {

		// $('#scriptContainer').append('<script type="text/javascript" src="https://checkout.stripe.com/checkout.js"></script>');
		this.getFlux().actions.BuyTicketsActions.initCheckout();
		// this.stripeCheckInterval = setInterval(this.checkForStripe, 3000);

	},

	getChosenOptionIndexInList: function(chosenOptions, optionId) {

		for (var i = 0; i < chosenOptions.length; i++) {
			if (chosenOptions[i].id == optionId)
				return i;
		}

		return -1;

	},

	handleCouponChange: function(e) {

		this.setState({coupon: e.target.value});

	},

	handleCouponApply: function(e) {

		e.preventDefault();
		this.getFlux().actions.BuyTicketsActions.checkCoupon(this.state.coupon);

	},

	componentWillUnmount: function() {

		this.getFlux().actions.BuyTicketsActions.resetCoupon();

	},

	render: function() {

		var ticketRows = [];
		var firstName = this.state.formData.firstName;
		var lastName = this.state.formData.lastName;
		var email = this.state.formData.email;
		var studentNumber = this.state.formData.studentNumber;

		$.each(this.state.tickets, function(index, ticket) {
			
			// get names of chosen options and total price
			var options = [];
			var price = ticket.price;
			if (this.state.isStudentCheckout && ticket.price != 0)
				price -= LanwarConstants.STUDENT_DISCOUNT;
			if (this.state.couponDiscount && ticket.price != 0)
				price -= this.state.couponDiscount;
			for (var i = 0; i < ticket.options.length; i++) {
				var chosenOptionIndex = this.getChosenOptionIndexInList(ticket.chosenOptions, ticket.options[i].id);
				if (chosenOptionIndex > -1) {
					options.push(ticket.options[i].name + " (" + ticket.chosenOptions[chosenOptionIndex].notes + ")");
					price += ticket.options[i].price;
				}
			}

			ticketRows.push(<tr key={index}>
				<td>{ticket.name} {options.length ? '– '+options.join(', ')+'' : ''}</td>
				<td>${price.toFixed(2)}</td>
			</tr>);
		}.bind(this));

		if (!ticketRows.length || ((!firstName || !lastName || !email) && !this.state.isLoggedIn))
			this.history.pushState(null, '/');

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
					<td>Student Number: </td>
					<td>{studentNumber}</td>
				</tr>
				<tr>
					<td>Email: </td>
					<td>{email}</td>
				</tr>
				</tbody>
				</table>
			);
		}

		if (this.state.isStudentCheckout) {
			var couponForm = null;
		}
		else if (this.state.couponDiscount > 0) {
			var couponForm = (
				<div className="row coupon-form">
					<div className="col-md-12">
						<p>Coupon code "{this.state.coupon}" applied. ${this.state.couponDiscount.toFixed(2)} off each ticket.</p>
					</div>
				</div>
			);
		}
		else {

			if (this.state.isLoadingCouponCheck)
				var applyButton = <button type="submit" className="btn btn-primary" disabled="disabled">Checking...</button>;
			else
				var applyButton = <button type="submit" className="btn btn-primary">Apply</button>;

			var couponForm = (
				<div className="row coupon-form">
					<div className="col-md-12">
					<form onSubmit={this.handleCouponApply} className="form-inline">					
						<div className="form-group">
							<label htmlFor="coupon">Have a coupon?</label>
							<input type="text" id="coupon" value={this.state.coupon} onChange={this.handleCouponChange} placeholder="coupon code" className="form-control" />
						</div>
						<div className="form-group">
							{applyButton}
						</div>
					</form>
					</div>
				</div>
			);
		}

		return (
			<div>
				<Header/>
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<h2>Order Summary</h2>

								{couponForm}

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
				<Footer/>
				<div id="scriptContainer"></div>
				<ReservationLoading show={this.state.isLoadingCheckout && !this.state.checkoutSuccess && !this.state.checkoutError } text="Checking out..." />
			</div>
		)

	}

});

module.exports = Checkout;