"use strict";

var React = require('react');
var Navbar = require('./Navbar/Navbar.jsx');
var Title = require('./Title/Title.jsx');
var PagedList = require('./PagedList/PagedList.jsx');
var SignIn = require('./SignIn/SignIn.jsx');
require('./main.scss');

var Root = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: false
    }
  },
  render: function () {
    var {
      loggedIn
    } = this.state;

    var items = [];
    for (var i = 0; i < 0; i++) {
      items.push(["Do0r " + (i + 1), (((i * 32 + 55) * 72) % 58 + 1) + "minutes ago"]);
    }

    var titleText = "All My Doors";

    return (
      <div className="root">
        <Navbar />
        <div className="content">
        { loggedIn && ( <Title text={ titleText } /> ) }
        { loggedIn ? 
          ( <PagedList 
            columns={
              [
                { name: "Description", style: { textAlign: "left" } },
                { name: "Last Run", style: {textAlign: "right", right: 0 } }
              ]
            }
            items={ items } /> ) :
            ( <SignIn /> )
        }
        </div>
      </div>
    )
  }
});

module.exports = Root;
