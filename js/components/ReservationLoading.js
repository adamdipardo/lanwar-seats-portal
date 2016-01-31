var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var ReservationLoading = React.createClass({

	render: function() {

		if (this.props.show == false)
			return <span />;

		return (
			<Modal.Dialog dialogClassName='loading-modal' animation={false} bsSize="small">
				<i className="fa fa-circle-o-notch fa-spin fa-4x"></i>
				<p>{this.props.text}</p>
			</Modal.Dialog>
		);

	}

});

module.exports = ReservationLoading;