var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);

var ChooseTicketOptionsRow = React.createClass({
	mixins: [FluxMixin],

	getInitialState: function() {

		return {
			chosenOptions: [],
			total: this.props.ticket.price
		};

	},

	changeOption: function(option, e) {

		var chosenOptions = this.state.chosenOptions;

		if (e.target.checked)
			chosenOptions.push(option.id);
		else {
			chosenOptions.splice(chosenOptions.indexOf(option.id), 1);
		}

		this.setState({chosenOptions: chosenOptions});
		this.calculateTicketTotal();
		this.getFlux().actions.BuyTicketsActions.updateTicketOptions(this.props.ticketKey, chosenOptions);

	},

	calculateTicketTotal: function() {

		var total = this.props.ticket.price;

		for (var i = 0; i < this.state.chosenOptions.length; i++) {
			for (var x = 0; x < this.props.ticket.options.length; x++) {
				if (this.props.ticket.options[x].id == this.state.chosenOptions[i])
					total += this.props.ticket.options[x].price;
			}
		}

		this.setState({total: total});

	},

	render: function() {

		var optionRows = [];
		for (var i = 0; i < this.props.ticket.options.length; i++) {
			var option = this.props.ticket.options[i];
			optionRows.push((
				<tr>
					<td width="65%">
						<span className="title option">{option.name}</span>
						<div className="description option">{option.description}</div>
					</td>
					<td width="15%" className="option-price">
						<label><input type="checkbox" onChange={this.changeOption.bind(this, option)}/> ${option.price.toFixed(2)}</label>
					</td>
				</tr>
			));
		}

		if (optionRows.length == 0) {
			optionRows.push((
				<tr>
					<td colspan="2" width="80%"><div className="description option">No options available for this ticket.</div></td>
				</tr>
			));
		}

		var hasNoOptions = this.props.ticket.options.length == 0 ? 'no-options' : '';
		var showOptionRequired = this.props.ticket.isOptionRequired == true ? (<span className="option-required">* option required</span>) : null;

		return (
			<table className={hasNoOptions + " table table-ticket-options"}>
			<tbody>
			<tr>
				<td colSpan="2"><span className="title">{this.props.ticket.name} Ticket</span> ${this.props.ticket.price.toFixed(2)} {showOptionRequired}</td>
				<td className="price" rowSpan={(optionRows.length + 1)}><span className="total">Ticket Total</span><span className="price">${this.state.total.toFixed(2)}</span></td>
			</tr>
			{optionRows}
			</tbody>
			</table>
		);

	}

});

module.exports = ChooseTicketOptionsRow;