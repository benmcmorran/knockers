"use strict";

var React = require('react');
var Title = require('../Title/Title.jsx');
var svg1 = require('../../assets/scan_code.svg');
var svg2 = require('../../assets/monitor_visitor.svg');
var svg3 = require('../../assets/edit_info.svg');

require('./signIn.scss');

const backgroundColors = [
  "#f4b400",
  "#f4b400",
  "#3e82f7",
  "#3e82f7",
  "#008140",
  "#008140"
]

var SignIn = React.createClass({
  getInitialState: function() {
    return { current: 0 };
  },
  componentDidMount: function() {
    document.body.style.background = "#f4b400";
    document.body.style.overflow = "hidden";
    this.timeout = setTimeout(this.cycle, 5000);
    // window.addEventListener('google-loaded', this.loadGapi);
  },
  componentWillUnmount: function() {
    document.body.style.background = "#f2f2f2";
    document.body.style.overflow = "auto";
    clearTimeout(this.timeout);
  },
  render: function() {
    let {
      current
    } = this.state;

    return (
      <div className="signin">
        { false && <div id="g-signin2" className="googlebutton"></div> }
        <img className={ "welcomeimage one" + (current == 0 ? '' : ' fade') } src={ svg1 } />
        <img className={ "welcomeimage two" + (current == 2 ? '' : ' fade') } src={ svg2 } />
        <img className={ "welcomeimage thr" + (current == 4 ? '' : ' fade') } src={ svg3 } />
        <div className={ "title-img one" + (current == 0 ? '' : ' fade') }>Scan code to ring</div>
        <div className={ "title-img two" + (current == 2 ? '' : ' fade') }>Monitor visitor activity</div>
        <div className={ "title-img thr" + (current == 4 ? '' : ' fade') }>Configure multiple bells</div>
      </div>
    )
  },
  cycle: function() {
    let {
      current
    } = this.state;

    var nextValue = (current + 1) % 6;

    document.body.style.background = backgroundColors[nextValue];

    this.setState({ current: nextValue })

    this.timeout = setTimeout(this.cycle, current % 2 == 0 ? 1000 : 5000);
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
