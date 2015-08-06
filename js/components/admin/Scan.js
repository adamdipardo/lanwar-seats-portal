var React = require('react');
var Fluxxor = require('fluxxor');
var Navigation = require('react-router').Navigation;

var Header = require('../Header');

var FluxMixin = Fluxxor.FluxMixin(React);

var Scan = React.createClass({

	mixins: [FluxMixin, Navigation],

	getInitialState: function() {

		return {};

	},

	getStateFromFlux: function() {

		var flux = this.getFlux();

		var UserAccountStore = flux.store("UserAccountStore").getState();

		return {
			user: UserAccountStore.user,
			isLoggedIn: UserAccountStore.isLoggedIn,
			isLoadingSessionCheck: UserAccountStore.isLoadingSessionCheck
		};

	},

	componentDidMount: function() {

		$('#scripts').html('<script src="/js/html5-qrcode.js"></script>');

		$('#reader').html5_qrcode(function(data) {
			console.log('READ!');
		},
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
		// if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
		// 	this.transitionTo('/');

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<div id="reader"></div>
							</div>
						</div>
					</div>
				</div>
				<div id="scripts"></div>
			</div>
		);

	}

});

module.exports = Scan;