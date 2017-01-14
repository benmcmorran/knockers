"use strict";

var React = require('react');
var Navbar = require('./Navbar/Navbar.jsx');
var Title = require('./Title/Title.jsx');
var PagedList = require('./PagedList/PagedList.jsx');
require('./main.scss');

var Root = React.createClass({
  render: function () {
    var items = [];
    for (var i = 0; i < 55; i++) {
      items.push(["Do0r " + (i + 1), (((i * 32 + 55) * 72) % 58 + 1) + "minutes ago"]);
    }

    return (
      <div className="root">
        <Navbar />
        <div className="content">
        <Title text="All My Doors" />
        <PagedList 
          columns={
            [
              { name: "Description", style: { textAlign: "left" } },
              { name: "Last Run", style: {textAlign: "right", right: 0 } }
            ]
          }
          items={ items } />
        </div>
      </div>
    )
  }
});

module.exports = Root;
