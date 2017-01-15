"use strict";

var React = require('react');

require('./signIn.scss');

var SignIn = React.createClass({
  componentDidMount: function() {
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
  },
  render: function () {
    return (
      <div className="signin">
        <div id="g-signin2" className="googlebutton"></div>
      </div>
    )
  }
});

module.exports = SignIn;
