var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var OrderNumberLookUpModal = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("AdminOrdersStore"), History],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var AdminOrdersStore = flux.store("AdminOrdersStore").getState();

		return {
			isLoadingOrderNumberLookup: AdminOrdersStore.isLoadingOrderNumberLookup,
			orderNumberLookupError: AdminOrdersStore.orderNumberLookupError,
			showLookupOrderNumberModal: AdminOrdersStore.showLookupOrderNumberModal,
			orderNumberLookup: AdminOrdersStore.orderNumberLookup
		};

	},

	handleHide: function() {

		this.setState({orderNumber: null});
		// this.props.onHide();
		this.getFlux().actions.AdminOrdersActions.dismissLookupOrderNumberModal();

	},

	handleSubmit: function(e) {

		e.preventDefault();

		// this.props.onSubmitOrderNumber(this.state.orderNumber);
		this.getFlux().actions.AdminOrdersActions.lookupOrderNumber(this.state.orderNumber);
		// this.setState({orderNumber: null});

	},

	handleOrderNumberChange: function(e) {

		this.setState({orderNumber: e.target.value});

	},

	render: function() {

		if (!this.state.showLookupOrderNumberModal || this.state.orderNumberLookupError === "")
			return (<div></div>);

		var lookUpButton;
		if (this.state.isLoadingOrderNumberLookup)
			lookupButton = (<button type="submit" className="btn btn-primary" disabled="disabled">Looking Up... <i className="fa fa-circle-o-notch fa-spin"></i></button>);
		else
			lookupButton = (<button type="submit" className="btn btn-primary">Lookup</button>);

		var lookUpError;
		if (this.state.orderNumberLookupError)
			lookUpError = (<div className="form-group has-error"><span className="help-block">{this.state.orderNumberLookupError}</span></div>);

		return (
			<Modal.Dialog dialogClassName='lookup-order-number' bsSize="small" animation={false} onHide={this.handleHide}>
				<p>Lookup Order by Number</p>

				<form className="form" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="order-number" className="sr-only">Order Number</label>
					<input type="text" id="order-number" name="order-number" className="form-control" placeholder="order #" value={this.state.orderNumber} onChange={this.handleOrderNumberChange} autoComplete="off"/>
				</div>
				{lookUpError}
				<div className="form-group">
					<button type="button" className="btn btn-default" onClick={this.handleHide}>Cancel</button>
					{lookupButton}
				</div>
				</form>
			</Modal.Dialog>
		);

	},

});

module.exports = OrderNumberLookUpModal;