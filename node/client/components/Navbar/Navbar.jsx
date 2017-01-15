// components/Root.jsx
var React = require('react');

require('./navbar.scss');

var Navbar = React.createClass({
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
      </div>
    )
  }
});

module.exports = Navbar;
