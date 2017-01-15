"use strict";

var React = require('react');
var Title = require('../Title/Title.jsx');
var svg1 = require('../../assets/scan code.svg');
var svg2 = require('../../assets/monitor visitor.svg');
var svg3 = require('../../assets/edit info.svg');

require('./signIn.scss');

var SignIn = React.createClass({
  getInitialState: function() {
    return { current: 0 };
  },
  componentDidMount: function() {
    setTimeout(this.cycle, 5000);
    // window.addEventListener('google-loaded', this.loadGapi);
  },
  render: function() {
    let {
      current
    } = this.state;

    return (
      <div className="signin">
        <div className={ "background dark" } />
        <div className={ "background one" + (current == 0 ? '' : ' fade') } />
        <div className={ "background two" + (current == 2 ? '' : ' fade') } />
        <div className={ "background thr" + (current == 4 ? '' : ' fade') } />
        <Title text="Welcome to Knockt!" />
        { false && <div id="g-signin2" className="googlebutton"></div> }
        <img className={ "welcomeimage one" + (current == 0 ? '' : ' fade') } src={ svg1 } />
        <img className={ "welcomeimage two" + (current == 2 ? '' : ' fade') } src={ svg2 } />
        <img className={ "welcomeimage thr" + (current == 4 ? '' : ' fade') } src={ svg3 } />
      </div>
    )
  },
  cycle: function() {
    let {
      current
    } = this.state;

    this.setState({ current: (current + 1) % 6 })

    setTimeout(this.cycle, current % 2 == 0 ? 1000 : 5000);
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
