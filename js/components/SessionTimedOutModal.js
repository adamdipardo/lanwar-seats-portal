var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;
var State = require('react-router').State;
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SessionTimedOutModal = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), History, State],

	contextTypes: {
		location: React.PropTypes.object
	},

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			sessionTimedOut: UserAccountStore.sessionTimedOut,
			timeoutMessage: UserAccountStore.timeoutMessage
		};

	},

	handleModalHide: function() {

		this.getFlux().actions.UserAccountActions.dismissSessionTimedOutModal(this.context.location.pathname);

	},

	render: function() {

		if (this.state.sessionTimedOut) {
			return (
				<Modal.Dialog dialogClassName='session-timeout error' animation={false} onHide={this.handleModalHide}>
					<p>{this.state.timeoutMessage}</p>
					<button type="button" className="btn btn-primary" onClick={this.handleModalHide}>Ok</button>
				</Modal.Dialog>
			);
		}
		else {
			return (<div></div>);
		}

	}

});

module.exports = SessionTimedOutModal;