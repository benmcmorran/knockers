"use strict";

var React = require('react');
var Navbar = require('./Navbar/Navbar.jsx');
var Title = require('./Title/Title.jsx');
var PagedList = require('./PagedList/PagedList.jsx');
var SignIn = require('./SignIn/SignIn.jsx');
require('./main.scss');

const State = {
  LOGIN: "login",
  LIST: "list",
  LOAD: "loading",
  ERROR: "error"
}

const uri = "http://130.215.208.188:8080";

var Root = React.createClass({
  getInitialState: function() {
    this.renderers = {};
    this.renderers[State.LOGIN] = this._renderLogin;
    this.renderers[State.LIST] = this._renderList;
    this.renderers[State.LOAD] = this._renderLoad;
    this.renderers[State.ERROR] = this._renderError;

    this.commands = {};
    this.commands[State.LOGIN] = [];
    this.commands[State.LIST] = [];
    this.commands[State.LOAD] = [];
    this.commands[State.ERROR] = [];

    return {
      state: State.LOGIN,
      items: []
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
          ref="list"
          columns={
            [
              { name: "Description", style: { textAlign: "left" } },
              { name: "Last Ring", style: {textAlign: "right", right: 0 } }
            ]
          }
          items={ items }
          addDoor={ this.addDoor }
          deleteDoor={ this.deleteDoor } /> 
      </div> );
  },
  _renderLoad: function() {
    return (
      <Title text="Loading your doors" />
    );
  },
  _renderError: function() {
    return (
      <Title text="Sorry, the server is down!" />
    );
  },
  signIn: function(googleUser) {
    this.setState({ state: State.LOAD });
    this.id_token = googleUser.getAuthResponse().id_token;

    var loginReq = new XMLHttpRequest();
    loginReq.open("POST", uri + "/listdoorbells");
    loginReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    loginReq.onreadystatechange = this.receivedDoors.bind(this, loginReq);
    loginReq.onerror = this.onError.bind(this);
    loginReq.send("token=" + this.id_token);
  },
  receivedDoors: function(req) {
    if(req.readyState === XMLHttpRequest.DONE && req.status === 200) {
      console.log("Got doors: " + req.responseText);
      this.setState({ items: JSON.parse(req.responseText).data.map(function(door) {
        return [door.description, door.lastrang]; }),
        state: State.LIST
      });
    } else {
      this.setState({ state: State.ERROR });
    }
  },
  onError: function(req) {
    this.setState({ state: State.ERROR });
  },
  addDoor: function(name) {/*
    this.setState({ state: State.LIST });

    var id_token = googleUser.getAuthResponse().id_token;

    var loginReq = new XMLHttpRequest();
    loginReq.open("POST", uri + "/listdoorbells");
    loginReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    loginReq.onreadystatechange = function() {
      if(loginReq.readyState === XMLHttpRequest.DONE && loginReq.status === 200) {
          console.log(loginReq.responseText);
      }
    };
    loginReq.send("token=" + id_token);
    console.log(name);
*/
  },
  deleteDoor: function(id) {

  }
});

module.exports = Root;
