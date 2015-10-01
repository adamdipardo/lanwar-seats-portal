var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var OptionNotesField = React.createClass({
	mixins: [FluxMixin, StoreWatchMixin("BuyTicketsStore")],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var BuyTicketsStore = flux.store("BuyTicketsStore").getState();

		var thisTicket = BuyTicketsStore.tickets[this.props.ticketKey];
		for (var i = 0; i < thisTicket.chosenOptions.length; i++) {
			if (thisTicket.chosenOptions[i].id == this.props.optionId)
				var thisOption = i;
		}

		return {
			notes: thisTicket.chosenOptions[thisOption].notes
		};

	},

	handleNotesChange: function(e) {

		this.getFlux().actions.BuyTicketsActions.updateTicketOptionsNotes(this.props.ticketKey, this.props.optionId, e.target.value);

	},

	render: function() {

		return (
			<div className="form-group">
				<label className="sr-only">Player IGN name(s)</label>
				<input type="text" name="notes" className="form-control" placeholder="Player IGN name(s)" onChange={this.handleNotesChange} value={this.state.notes}/>
			</div>
		);

	}

});

module.exports = OptionNotesField;