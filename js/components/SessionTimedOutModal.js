var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var SessionTimedOutModal = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore"), Navigation],

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

		this.getFlux().actions.UserAccountActions.dismissSessionTimedOutModal(this.context.router);

	},

	render: function() {

		if (this.state.sessionTimedOut) {
			return (
				<Modal dialogClassName='session-timeout error' animation={false} bsSize="medium" onHide={this.handleModalHide}>
					<p>{this.state.timeoutMessage}</p>
					<button type="button" className="btn btn-primary" onClick={this.handleModalHide}>Ok</button>
				</Modal>
			);
		}
		else {
			return (<div></div>);
		}

	}

});

module.exports = SessionTimedOutModal;