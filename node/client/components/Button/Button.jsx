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
        onClick={ onClick }
        type={ type } >
        { text }
      </button>
    )
  }
});

module.exports = Button;
