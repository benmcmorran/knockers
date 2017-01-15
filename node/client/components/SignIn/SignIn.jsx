"use strict";

var React = require('react');
var Title = require('../Title/Title.jsx');

require('./signIn.scss');

var SignIn = React.createClass({
  componentDidMount: function() {
    // window.addEventListener('google-loaded', this.loadGapi);
  },
  render: function() {
    return (
      <div className="signin">
        <Title text="Welcome to Knockt!" />
        { false && <div id="g-signin2" className="googlebutton"></div> }
      </div>
    )
  },
  loadGapi: function() {
    let {
      signIn
    } = this.props;

    gapi.signin2.render('g-signin2', {
      'scope': 'profile',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': signIn,
      'onfailure': function() {
        console.log("Failed to log in");
      }
    });
  }
});

module.exports = SignIn;
