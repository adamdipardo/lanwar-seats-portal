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
			quantity: this.props.initialChosen,
			selectedOptions: []
		};
	},

	handleQuantityChange: function(e) {
		this.getFlux().actions.BuyTicketsActions.changeTicketQuantity(this.props.ticketType, e.target.value);
		this.setState({quantity: e.target.value});
	},

	handleOptionChange: function(e, option) {

		// 

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
				<td><span className="ticket-title">{this.props.ticketType.name}</span><div className="description">{this.props.ticketType.description}</div></td>
				<td>
					<select onChange={this.handleQuantityChange} value={this.state.quantity}>{quantities}</select>
				</td>
				<td>{this.state.quantity} x ${this.props.ticketType.price.toFixed(2)}</td>
			</tr>
		);
	}
});

module.exports = TicketTypeRow;