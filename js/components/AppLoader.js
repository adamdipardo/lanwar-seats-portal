var React = require('react');
var Fluxxor = require('fluxxor');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var AppLoader = React.createClass({

	mixins: [FluxMixin, StoreWatchMixin("UserAccountStore")],

	getStateFromFlux: function() {

		var flux = this.getFlux();

		UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck
		};

	},

	render: function() {

		var classes = "app-loader";
		if (!this.state.isLoadingSessionCheck)
			classes += " no-load";

		return (
			<div className={classes}>
				<i className="fa fa-circle-o-notch fa-spin fa-4x"></i>
			</div>
		);

	}
});

module.exports = AppLoader;