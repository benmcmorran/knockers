"use strict";

var React = require('react');
var TextField = require('../TextField/TextField.jsx');
var Title = require('../Title/Title.jsx');

require('./signIn.scss');

var SignIn = React.createClass({
  render: function () {
    return (
      <div className="signin">
        <Title text="Sign In" />
        <TextField label="Username" />
        <TextField label="Password" type="password" />
      </div>
    )
  }
});

module.exports = SignIn;
