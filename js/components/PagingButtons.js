var React = require('react');
var classNames = require('classnames');

var PagingButtons = React.createClass({

	handleClick: function(toPage, e) {		

		var newPage;

		if (toPage == 'prev')
			newPage = this.props.currentPage - 1;
		else if (toPage == 'next')
			newPage = this.props.currentPage + 1;
		else
			newPage = toPage;

		if (newPage > 0 && newPage <= this.props.lastPage && newPage != this.props.currentPage)
			this.props.onClickNewPage(newPage);

	},

	render: function() {

		var lastPage = this.props.lastPage;
		var currentPage = this.props.currentPage;

		var pagesBefore = [];
		var pagesAfter = [];

		if (currentPage > 1) {
			var iterations = 0;
			for (var pageNum = currentPage - 1; pageNum > 0; pageNum--) {
				pagesBefore.unshift(pageNum);

				if (++iterations >= 5) break;
			}
		}

		if (currentPage < lastPage) {
			var iterations = 0;
			for (var pageNum = currentPage + 1; pageNum <= lastPage; pageNum++) {
				pagesAfter.push(pageNum);

				if (++iterations >= 5) break;
			}
		}

		var pages = pagesBefore.concat(currentPage, pagesAfter);

		var pageButtons = [];
		for (pageNum in pages)
			pageButtons.push(this.renderButton(pages[pageNum], pages[pageNum] == currentPage));

		return (
			<ul className="pagination">
				<li className={classNames('prev', {'disabled': currentPage <= 1})}><a onClick={this.handleClick.bind(this, 'prev')}>&laquo;</a></li>
				{pageButtons}
				<li className={classNames('next', {'disabled': currentPage >= lastPage})}><a onClick={this.handleClick.bind(this, 'next')}>&raquo;</a></li>
			</ul>
		);

	},

	renderButton: function(number, isCurrent) {
		return (
			<li className={classNames({'current': isCurrent})} key={number}><a onClick={this.handleClick.bind(this, number)}>{number}</a></li>
		);
	}

});

module.exports = PagingButtons;