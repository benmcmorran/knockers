"use strict";

var React = require('react');

require('./button.scss');

var Button = React.createClass({
  render: function () {
    let {
      text,
      fill,
      onClick,
      type,
      disabled
    } = this.props;

    return (
      <button
        className={
        "button" +
        (fill ? " fill" : '') +
        (disabled ? " disabled" : '') }
        onClick={ this._onClick }
        type={ type } >
        { text }
      </button>
    )
  },
  _onClick: function(e) {
    let {
      onClick,
      disabled
    } = this.props;

    e.preventDefault();
    e.stopPropagation();

    if (onClick && !disabled) {
      onClick(e);
    }
  }
});

module.exports = Button;
