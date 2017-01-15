"use strict";

var React = require('react');
var TextField = require('../TextField/TextField.jsx');
var Title = require('../Title/Title.jsx');
var Button = require('../Button/Button.jsx');

require('./signIn.scss');

var SignIn = React.createClass({
  render: function () {
    let {
      signIn
    } = this.props;

    return (
      <form 
        className="signin"
        onSubmit={ this._onSubmit } >
        <Title text="Sign In" />
        <TextField label="Username" />
        <TextField label="Password" type="password" />
        <Button
          fill={ true }
          text={ "Sign In" }
          onClick={ this._onSubmit }
          type="submit" />
        <Button
          text={ "Forgot My Password" }
          type="button" />
      </form>
    )
  },
  _onSubmit: function(e) {
    let {
      signIn
    } = this.props;
    
    signIn();
  }
});

module.exports = SignIn;
