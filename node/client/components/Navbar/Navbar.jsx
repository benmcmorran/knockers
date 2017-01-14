// components/Root.jsx
var React = require('react');

require('./navbar.scss');

var Navbar = React.createClass({
  render: function () {
    return (
      <div className="navbar">
      </div>
    )
  }
});

module.exports = Navbar;
