var React = require('react');

var Header = React.createClass({

	render: function() {

		return (
			<header className="container-fluid">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h1 className="logo"><strong>LANWAR</strong> X</h1>

							<ul className="menu">
								<li><a href="#">Login</a></li>
							</ul>
						</div>
					</div>
				</div>
			</header>
		);

	}

});

module.exports = Header;