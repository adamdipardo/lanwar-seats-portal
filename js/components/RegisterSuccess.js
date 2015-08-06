var React = require('react');
var Fluxxor = require('fluxxor');

var Header = require('./Header');

var FluxMixin = Fluxxor.FluxMixin(React);

var RegisterSuccess = React.createClass({

	mixins: [FluxMixin],

	render: function() {

		return (
			<div>
				<Header />
				<div className="container-fluid body">
					<div className="container">
						<div className="row">
							<div className="col-md-2"></div>
							<div className="col-md-8">
								<h1>Thank You!</h1>

								<p className="summary-text">Your registration is complete. You may now login using the link above.</p>

								<br />
								<br />
								<br />
								<br />
							</div>
							<div className="col-md-2"></div>
						</div>
					</div>
				</div>
			</div>
		);

	}

});

module.exports = RegisterSuccess;