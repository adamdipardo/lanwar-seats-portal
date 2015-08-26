var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('../Header');
var Footer = require('../Footer');
var CheckInModal = require('./CheckInModal');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Scan = React.createClass({

	mixins: [FluxMixin, Navigation, StoreWatchMixin("UserAccountStore", "CheckInStore")],

	getInitialState: function() {

		return {
			isWaitingForCode: true
		};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();
		var CheckInStore = flux.store("CheckInStore").getState();

		return {
			user: UserAccountStore.user,
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck,
			isLoadingCheckIn: CheckInStore.isLoadingCheckIn
		};

	},

	componentDidMount: function() {

		$('#scripts').html('<script src="/js/jsqrcode-combined.min.js"></script><script src="/js/html5-qrcode.js"></script>');

		$('#reader').html5_qrcode(function(data) {
			if (!this.state.isLoadingCheckIn)
				this.getFlux().actions.CheckInActions.checkInTicketByHash(data);
		}.bind(this),
		function(error) {
			console.log('READ ERROR!');
		}, 
		function(videoError) {
			console.log('STREAM ERROR');
		});

	},

	componentWillUnmount: function() {

		$('#reader').html5_qrcode_stop();

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.transitionTo('/login');

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Scan QR Code</h2>
								<div id="reader"></div>
								<p className="summary-text">Hold ticket QR code to webcam to scan.</p>
							</div>
						</div>
					</div>
				</div>
				<Footer />
				<div id="scripts"></div>
				<CheckInModal ref="checkInModal"/>
			</div>
		);

	}

});

module.exports = Scan;