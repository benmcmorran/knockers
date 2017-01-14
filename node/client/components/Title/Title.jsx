"use strict";

var React = require('react');

require('./title.scss');

var Title = React.createClass({
  render: function () {
    return (
      <div className="title">
        <span className="title-text">
          { this.props.text }
        </span>
      </div>
    )
  }
});

module.exports = Title;
