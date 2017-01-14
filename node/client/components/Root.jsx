// components/Root.jsx
var React = require('react');
var Navbar = require('./Navbar/Navbar.jsx');
var Title = require('./Title/Title.jsx');
var PagedList = require('./PagedList/PagedList.jsx');
require('./main.scss');

var Root = React.createClass({
  render: function () {
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
          items={
            [
              ["Front Door", "1 minute ago"],
              ["Back Door", "40 minutes ago"],
              ["Garage Door", "8 days ago"],
            ]
          } />
        </div>
      </div>
    )
  }
});

module.exports = Root;
