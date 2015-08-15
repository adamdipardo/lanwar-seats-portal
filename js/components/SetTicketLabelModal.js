var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Modal = ReactBootstrap.Modal;

var SetTicketLabelModal = React.createClass({

	getInitialState: function() {

		return {
			label: ""
		};

	},

	handleLabelChange: function(e) {

		this.setState({label: e.target.value});

	},

	handleSubmit: function(e) {

		e.preventDefault();
		this.props.onLabelSet(this.props.ticket, this.state.label);
		this.setState({label: ""});

	},

	handleHide: function() {

		this.props.onCancelSetLabel();
		this.setState({label: ""});

	},

	render: function() {

		if (!this.props.show)
			return (<div></div>);

		return (
			<Modal dialogClassName='set-label' bsSize="small" animation={false} onHide={this.handleHide}>
				<p>Set label for Ticket #{this.props.ticket.id}</p>

				<form className="form" onSubmit={this.handleSubmit}>
				<div className="form-group">
					<label htmlFor="label" className="sr-only">Label</label>
					<input type="text" id="label" name="label" className="form-control" placeholder="label" value={this.state.label || this.props.ticket.label} onChange={this.handleLabelChange}/>
				</div>
				<div className="form-group">
					<button type="button" className="btn btn-default" onClick={this.handleHide}>Cancel</button>
					<button type="submit" className="btn btn-primary">Set Label</button>
				</div>
				</form>
			</Modal>
		);

	}

});

module.exports = SetTicketLabelModal;