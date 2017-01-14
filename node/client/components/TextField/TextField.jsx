"use strict";

var React = require('react');

require('./textField.scss');

var TextField = React.createClass({
  render: function () {
    let {
      label,
      type,
      maxLength
    } = this.props;

    return (
      <div className="textfield">
        { label && (
          <span className="textfield-label"> { label } </span>
        )}
        <input 
          className="textfield-input"
          type={ type }
          maxLength={ maxLength ? maxLength : 32 } />
      </div>
    )
  }
});

module.exports = TextField;
