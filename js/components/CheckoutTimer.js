var React = require('react');
var Fluxxor = require('fluxxor');
var moment = require('moment');

var FluxMixin = Fluxxor.FluxMixin(React);

var CheckoutTimer = React.createClass({
	mixins: [FluxMixin],

	interval: null,

	getInitialState: function() {
		return {
			timeoutAt: this.props.timeoutAt
		}
	},

	tick: function() {

		this.forceUpdate();

	},

	componentDidMount: function() {
		
		this.interval = setInterval(this.tick, 1000);

	},

	componentWillUnmount: function() {

		clearInterval(this.interval);

	},

	render: function() {

		var numSecondsLeft = this.state.timeoutAt.diff(moment(), 'seconds');

		if (numSecondsLeft < 0) {
			this.props.onTimeExpired();
			var prettyMinutes = 0;
			var prettySeconds = "00";
			clearInterval(this.interval);
		}
		else {
			var prettyMinutes = Math.floor(numSecondsLeft / 60);
			var prettySeconds = numSecondsLeft % 60;
			prettySeconds = prettySeconds < 10 ? "0" + prettySeconds : prettySeconds;
		}

		return (
			<div className="checkout-timer"><span>Reservations held for:</span> <span className="time-left">{prettyMinutes}:{prettySeconds}</span></div>
		);

	}
});

module.exports = CheckoutTimer;