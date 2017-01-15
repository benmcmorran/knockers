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
          onChange={ this._handleChange }
          onFocus={ this._onFocus }
          onBlur={ this._onBlur } />
      </div>
    )
  },
  _handleChange: function(e) {
    if (this.refs.input.value.length > 0) {
      this.setState({ active: true });
    }
  },
  _onFocus: function(e) {
    this.setState({ active: true });
  },
  _onBlur: function(e) {
    if (this.refs.input.value.length == 0) {
      this.setState({ active: false });
    }
  }
});

module.exports = TextField;
