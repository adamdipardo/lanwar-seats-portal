var React = require('react');
var Fluxxor = require('fluxxor');
var History = require('react-router').History;

var Header = require('../Header');
var Footer = require('../Footer');
var CheckInModal = require('./CheckInModal');

var FluxMixin = Fluxxor.FluxMixin(React);
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Scan = React.createClass({

	mixins: [FluxMixin, History, StoreWatchMixin("UserAccountStore", "CheckInStore")],

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
			isLoadingCheckIn: CheckInStore.isLoadingCheckIn,
			ticketId: CheckInStore.ticketId
		};

	},

	componentDidMount: function() {

		$('#scripts').html('<script src="/js/jsqrcode-combined.min.js"></script><script src="/js/html5-qrcode.min.js"></script>');

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

		setTimeout(function() {
			$('#ticketId').focus();
		}, 300);

	},

	componentWillUnmount: function() {

		try {
			$('#reader').html5_qrcode_stop();
			$('#reader').remove();
		}
		catch (e) {
			// do nothing, just need to catch error in case QR-code scanner is not running and we try to stop it
		}

	},

	handleTicketIdChange: function(e) {

		// this.setState({ticketId: e.target.value});
		this.getFlux().actions.CheckInActions.setTicketId(e.target.value);

	},

	handleTicketIdCheckIn: function(e) {

		e.preventDefault();

		if (this.state.ticketId) {
			this.getFlux().actions.CheckInActions.checkInTicketById(this.state.ticketId);
		}

	},

	resetFocus: function() {

		$('#ticketId').focus();

	},

	render: function() {

		// permission
		if ((!this.state.isLoggedIn || this.state.user.type != 'admin') && !this.state.isLoadingSessionCheck)
			this.history.pushState(null, '/login', {expired: true, return: this.props.location.pathname});

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-12">
								<h2>Check In Tickets</h2>
							</div>
							<div className="col-md-6">
								<div className="check-in-box">
									<div className="content">
										<h3 className="ticket-id"><i className="fa fa-ticket"></i> By Ticket ID</h3>

										<div className="row">
											<div className="col-md-1"></div>
											<div className="col-md-10">
												<form onSubmit={this.handleTicketIdCheckIn}>
												<div className="form-group">
													<label htmlFor="ticketId" className="sr-only">Ticket ID</label>
													<input type="number" name="ticketId" id="ticketId" placeholder="Type Ticket ID and hit Enter" onChange={this.handleTicketIdChange} className="form-control" value={this.state.ticketId}/>
												</div>
												<div className="form-group">
													<button type="submit" className="btn btn-primary btn-block">Check In</button>
												</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-6">
								<div className="check-in-box">
									<div className="content">
										<h3><i className="fa fa-qrcode"></i> By QR Code</h3>
										<div id="reader"></div>
										<p className="summary-text">Hold ticket QR code to webcam to scan.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Footer />
				<div id="scripts"></div>
				<CheckInModal ref="checkInModal" onClose={this.resetFocus}/>
			</div>
		);

	}

});

module.exports = Scan;