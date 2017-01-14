"use strict";

var React = require('react');

require('./title.scss');

var Title = React.createClass({
  render: function () {
    let {
      text
    } = this.props;

    return (
      <div className="title">
        <span className="title-text">
          { text }
        </span>
      </div>
    )
  }
});

module.exports = Title;
