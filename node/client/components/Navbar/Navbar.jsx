// components/Root.jsx
var React = require('react');


var icon = require('../../assets/icon.png');

require('./navbar.scss');

var Navbar = React.createClass({
  componentDidMount: function() {
    window.addEventListener('google-loaded', this.loadGapi);
  },
  componentWillUnmount: function() {
    window.removeEventListener('google-loaded', this.loagGapi);
  },
  render: function () {
    let {
      commands
    } = this.props;

    return (
      <div className="navbar">
        { commands && 
          commands.map(function(command, index) {
            return (
              <Button 
                text={ command.text }
                onClick={ command.action } />
            );
          })
        }
        <div id="g-signin-navbar" className="googlebutton"></div>
        <div id="knockt-logo-navbar" className="knocktlogo"><img src={ icon } alt="Knockt"/><p>nokt</p></div>
      </div>
    )
  },
  loadGapi: function() {
    let {
      signIn
    } = this.props;

    gapi.signin2.render('g-signin-navbar', {
      'scope': 'profile',
      'width': 200,
      'height': 40,
      'longtitle': true,
      'theme': 'light',
      'onsuccess': signIn,
      'onfailure': function() {
        console.log("Failed to log in");
      }
    });
  }
});

module.exports = Navbar;
