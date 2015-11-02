var React = require('react');
var Fluxxor = require('fluxxor');
var LanwarConstants = require('../constants/LanwarConstants');

var FluxMixin = Fluxxor.FluxMixin(React);

var OptionNotesField = require('./OptionNotesField');

var ChooseTicketOptionsRow = React.createClass({
	mixins: [FluxMixin],

	getInitialState: function() {

		return {
			chosenOptions: this.props.ticket.chosenOptions || [],
			total: this.props.ticket.price
		};

	},

	changeOption: function(option, e) {

		var chosenOptions = this.state.chosenOptions;

		if (e.target.checked)
			chosenOptions.push({id: option.id, notes: ""});
		else {
			for (var i = 0; i < chosenOptions.length; i++) {
				if (chosenOptions[i].id == option.id) {
					chosenOptions.splice(i, 1);	
					break;
				}
			}			
		}

		this.setState({chosenOptions: chosenOptions});
		this.getFlux().actions.BuyTicketsActions.updateTicketOptions(this.props.ticketKey, chosenOptions);

	},

	calculateTicketTotal: function() {

		var total = this.props.ticket.price;

		if (this.props.isStudent)
			total -= LanwarConstants.STUDENT_DISCOUNT;

		for (var i = 0; i < this.state.chosenOptions.length; i++) {
			for (var x = 0; x < this.props.ticket.options.length; x++) {
				if (this.props.ticket.options[x].id == this.state.chosenOptions[i].id)
					total += this.props.ticket.options[x].price;
			}
		}

		return total;

	},

	isOptionChecked: function(optionId) {

		var chosenOptions = this.props.ticket.chosenOptions;

		for (var i = 0; i < chosenOptions.length; i++) {
			if (chosenOptions[i].id == optionId)
				return true;
		}

		return false;

	},

	render: function() {

		var total = this.calculateTicketTotal();

		var ticketPrice = this.props.ticket.price;
		if (this.props.isStudent)
			ticketPrice -= LanwarConstants.STUDENT_DISCOUNT;

		var optionRows = [];
		for (var i = 0; i < this.props.ticket.options.length; i++) {
			var option = this.props.ticket.options[i];
			var isChecked = typeof(this.props.ticket.chosenOptions) != "undefined" && this.isOptionChecked(option.id);
			var optionNotes = isChecked ? <OptionNotesField ticketKey={this.props.ticketKey} optionId={option.id} fieldKey="notes" label="Player IGN name(s)"/> : null;
			var optionNotes2 = isChecked ? <OptionNotesField ticketKey={this.props.ticketKey} optionId={option.id} fieldKey="notes2" label="Player Region (city)"/> : null;
			optionRows.push((
				<tr key={option.id}>
					<td width="65%">
						<span className="title option">{option.name}</span>
						<div className="description option">{option.description}</div>
					</td>
					<td width="15%" className="option-price">
						<label><input type="checkbox" onChange={this.changeOption.bind(this, option)} checked={isChecked}/> ${option.price.toFixed(2)}</label>
					</td>
				</tr>
			));
			optionRows.push((
				<tr key={option.id+"notes"}>
					<td colSpan="2">
						{optionNotes}
					</td>
				</tr>
			));
			optionRows.push((
				<tr key={option.id+"notes2"}>
					<td colSpan="2">
						{optionNotes2}
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
				<td colSpan="2"><span className="title">{this.props.ticket.name} Ticket</span> ${ticketPrice.toFixed(2)} {showOptionRequired}</td>
				<td className="price" rowSpan={(optionRows.length + 1)}><span className="total">Ticket Total</span><span className="price">${total.toFixed(2)}</span></td>
			</tr>
			{optionRows}
			</tbody>
			</table>
		);

	}

});

module.exports = ChooseTicketOptionsRow;