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

		if (!this.state.isLoadingSessionCheck)
			return <div></div>;

		return (
			<div className="app-loader">
				<div className="loader">Loading...</div>
			</div>
		);

	}
});

module.exports = AppLoader;