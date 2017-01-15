"use strict";

var React = require('react');
var Title = require('../Title/Title.jsx');
var TextField = require ('../TextField/TextField.jsx')
var Button = require ('../Button/Button.jsx')

require('./doorForm.scss');

var DoorForm = React.createClass({
  getInitialState: function() {
    return {valid: false};
  },
  render: function() {
    let {
      closeForm
    } = this.props;
    let {
      valid
    } = this.state;

    return (
      <div className="doorform">
        <div className="doorform-overlay" 
          onClick={ closeForm } />
        <form className="doorform-window">
          <Title text="Add New Door Bell" />
          <TextField
            ref="textfield"
            label="Describe your doorbell"
            focus={ true }
            onChange={ this._onChange } />
          <Button 
            text="Add a door" 
            fill={ true }
            onClick={ this._addDoor }
            disabled={ !valid }
            type="submit" />
        </form>
      </div>
    )
  },
  _addDoor: function() {
    let {
      addDoor
    } = this.props;

    addDoor(this.refs.textfield.getValue());
  },
  _onChange: function(e) {
    if (e.target.value.length > 0) {
      this.setState({ valid: true });
    } else {
      this.setState({ valid: false });
    }
  }
});

module.exports = DoorForm;
