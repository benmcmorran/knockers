// components/Root.jsx
var React = require('react')
require('./scss/main.scss');

var Root = React.createClass({
  render: function () {
    return (
      <p>
        Hello, world!
      </p>
    )
  }
});

module.exports = Root
