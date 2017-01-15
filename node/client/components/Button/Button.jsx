"use strict";

var React = require('react');

require('./button.scss');

var Button = React.createClass({
  render: function () {
    let {
      text,
      fill,
      onClick,
      type
    } = this.props;

    return (
      <button
        className={
        "button" +
        (fill ? " fill" : '') }
        onClick={ this._onClick }
        type={ type } >
        { text }
      </button>
    )
  },
  _onClick: function(e) {
    let {
      onClick
    } = this.props;

    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick(e);
    }
  }
});

module.exports = Button;
