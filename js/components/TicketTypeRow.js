var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
// var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var TicketTypeRow = React.createClass({
	mixins: [FluxMixin],

	propTypes: {
		ticketType: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			quantity: 0
		};
	},

	handleQuantityChange: function(e) {
		this.getFlux().actions.BuyTicketsActions.changeTicketQuantity(this.props.ticketType, e.target.value);
		this.setState({quantity: e.target.value});
	},

	render: function() {
		var quantities = [];
		for (var i = 0; i < 11; i++)
		{
			var isSelected = this.state.quantity == i ? 'selected' : '';
			quantities.push(<option key={i} value={i} isSelected>{i}</option>);
		}

		return (
			<tr>
				<td>{this.props.ticketType.name}</td>
				<td>
					<select onChange={this.handleQuantityChange}>{quantities}</select>
				</td>
				<td>{this.state.quantity} x ${this.props.ticketType.price.toFixed(2)}</td>
			</tr>
		);
	}
});

module.exports = TicketTypeRow;