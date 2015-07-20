var React = require('react');
var Fluxxor = require('fluxxor');

var CheckoutTicket = require('./CheckoutTicket');
var Header = require('./Header');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CheckoutFinish = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore")],

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		return {
			tickets: BuyTicketsStore.tickets,
			formData: BuyTicketsStore.formData,
			totalPrice: BuyTicketsStore.totalPrice
		};

	},

	render: function() {

		var ticketRows = [];
		var firstName = this.state.formData.firstName;
		var lastName = this.state.formData.lastName;
		var email = this.state.formData.email;

		$.each(this.state.tickets, function(index, ticket) {
			ticketRows.push(<CheckoutTicket ticket={ticket}/>);
		});

		return (
			<div>
				<Header />
				<div className="container">
					<div className="row">
						<div className="col-md-2"></div>
						<div className="col-md-8">
							<h1>Thank You!</h1>

							<p className="summary-text">Your order is complete. Please check your email to find your tickets. Print and bring each ticket to the event.</p>

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
								<td style={{textAlign: 'right'}}>Total</td>
								<td><strong>${this.state.totalPrice.toFixed(2)}</strong></td>
								<td></td>
							</tr>
							</tfoot>
							</table>
						</div>
						<div className="col-md-2"></div>
					</div>
				</div>
			</div>
		);

	}

});

module.exports = CheckoutFinish;