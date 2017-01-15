"use strict";

var React = require('react');
var Navbar = require('./Navbar/Navbar.jsx');
var Title = require('./Title/Title.jsx');
var PagedList = require('./PagedList/PagedList.jsx');
var SignIn = require('./SignIn/SignIn.jsx');
require('./main.scss');

const State = {
  LOGIN: "login",
  SIGNUP: "signup",
  LIST: "list"
}

const uri = "http://localhost:8080";

var Root = React.createClass({
  getInitialState: function() {
    this.renderers = {};
    this.renderers[State.LOGIN] = this._renderLogin;
    this.renderers[State.SIGNUP] = this._renderSignup;
    this.renderers[State.LIST] = this._renderList;

    this.commands = {};
    this.commands[State.LOGIN] = [];
    this.commands[State.SIGNUP] = [];
    this.commands[State.LIST] = [];

    var items = [];
    for (var i = 0; i < 20; i++) {
      items.push(["Do0r " + (i + 1), (((i * 32 + 55) * 72) % 58 + 1) + "minutes ago"]);
    }

    return {
      state: State.LOGIN,
      items: items
    }
  },
  render: function () {
    var {
      state
    } = this.state;

    return (
      <div className="root">
        <Navbar />
        <div className="content">
        { this.renderers[state]() }
        </div>
        <div className="pagefooter">
          Hack@WPI 2017, MIT License
        </div>
      </div>
    )
  },
  _renderLogin: function() {
    return ( <SignIn signIn={ this.signIn } /> );
  },
  _renderSignup: function() {

  },
  _renderList: function() {
    let {
      items,
      columns
    } = this.state;
    return ( <div>
        <Title text="All My Doors" />
        <PagedList 
        columns={
          [
            { name: "Description", style: { textAlign: "left" } },
            { name: "Last Run", style: {textAlign: "right", right: 0 } }
          ]
        }
        items={ items } /> 
      </div> );
  },
  signIn: function(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var formData = new FormData();
    formData.append("token", id_token);

    var loginReq = new XMLHttpRequest();
    loginReq.open("POST", uri + "/list/doorbells");
    loginReq.onreadystatechange = function() {
      if(loginReq.readyState === XMLHttpRequest.DONE && loginReq.status === 200) {
          console.log(xhr.responseText);
      }
    };
    loginReq.send(formData);
  }
});

module.exports = Root;
