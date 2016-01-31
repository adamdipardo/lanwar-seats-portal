var React = require('react');
var Fluxxor = require('fluxxor');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ReSendEmail = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminOrdersStore")],

	getInitialState: function() {

		return {
			email: ""
		}

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var AdminOrdersStore = flux.store("AdminOrdersStore").getState();

		return {
			show: AdminOrdersStore.showReSendEmailModal,
			isLoading: AdminOrdersStore.isLoadingReSendEmail
		};

	},

	handleEmailChange: function(e) {

		this.setState({email: e.target.value});

	},

	handleSubmit: function(e) {

		e.preventDefault();
		// this.props.onReSendEmail(this.props.order, this.state.email);
		// this.setState({label: ""});
		this.getFlux().actions.AdminOrdersActions.reSendEmail(this.props.order.id, this.state.email);

	},

	handleHide: function() {

		this.getFlux().actions.AdminOrdersActions.dismissReSendEmailModal();

	},

	render: function() {

		if (!this.state.show)
			return (<div></div>);

		var sendButton;
		if (this.state.isLoading)
			sendButton = <button type="submit" className="btn btn-primary" disabled>Sending... <i className="fa fa-circle-o-notch fa-spin"></i></button>;
		else
			sendButton = <button type="submit" className="btn btn-primary">Send</button>;

		return (
			<Modal.Dialog dialogClassName='set-label' bsSize="sm" animation={false} onHide={this.handleHide}>
				<p>Re-send email confirmation for {this.props.order.user.firstName} {this.props.order.user.lastName} to</p>

				<form className="form" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="email" className="sr-only">Email</label>
					<input type="email" id="email" name="email" className="form-control" placeholder="label" value={this.state.email || this.props.order.user.email} onChange={this.handleEmailChange}/>
				</div>
				<div className="form-group">
					<button type="button" className="btn btn-default" onClick={this.handleHide}>Cancel</button>
					{sendButton}
				</div>
				</form>
			</Modal.Dialog>
		);

	}

});

module.exports = ReSendEmail;