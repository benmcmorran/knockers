"use strict";

var React = require('react');

require('./textField.scss');

var TextField = React.createClass({
  getInitialState: function () {
    return { active: false };
  },
  refs: {
    key: React.ReactInstance,
    input: HTMLElement
  },
  render: function () {
    let {
      label,
      type,
      maxLength
    } = this.props;
    let {
      active
    } = this.state;

    return (
      <div className={ 
        "textfield" +
        (active ? " active" : '')
        } >
        { label && (
          <span className="textfield-label"> { label } </span>
        )}
        <input 
          className="textfield-input"
          type={ type }
          maxLength={ maxLength ? maxLength : 32 } 
          ref="input"
          onChange={ this._onChange }
          onFocus={ this._onFocus }
          onBlur={ this._onBlur } />
      </div>
    )
  },
  _onChange: function(e) {
    let {
      onChange
    } = this.props;
    if (e.target.value.length > 0) {
      this.setState({ active: true });
    }
    if (onChange) {
      onChange(e);
    }
  },
  _onFocus: function(e) {
    this.setState({ active: true });
  },
  _onBlur: function(e) {
    if (this.refs.input.value.length == 0) {
      this.setState({ active: false });
    }
  },
  getValue: function() {
    return this.refs.input.value;
  }
});

module.exports = TextField;
