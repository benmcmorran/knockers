"use strict";

var React = require('react');
var Navbar = require('./Navbar/Navbar.jsx');
var Title = require('./Title/Title.jsx');
var PagedList = require('./PagedList/PagedList.jsx');
var SignIn = require('./SignIn/SignIn.jsx');
var Button = require('./Button/Button.jsx');
var glyphDownload = require('../assets/glyph_download.png');
require('./main.scss');

const State = {
  LOGIN: "login",
  LIST: "list",
  LOAD: "loading",
  ERROR: "error"
}

const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

const uri = "http://api.knockt.com";

var Root = React.createClass({
  componentDidMount: function() {
    if (window.location.hash.length > 0) {
      this.id_token = window.location.hash.slice(1);
      this.hashed = true;
      
      this.getDoorbells();
    }
  },
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
      items: [],
      doorcodes: []
    }
  },
  render: function () {
    var {
      state
    } = this.state;

    return (
      <div className="root">
        <Navbar signIn={ this.signIn } hashed={ this.hashed } />
        <div className="content">
        { this.renderers[state]() }
        </div>
        <div className="pagefooter">
          Hack@WPI 2017, MIT License
        </div>
        { !this.hashed && 
          <div className="download">
            <Button text={( <div>
                <span> Download our Android app </span>
                <br />
                <img src={ glyphDownload } />
              </div> )}
              onClick={ this._downloadLink } 
              />
          </div>}
      </div>
    )
  },
  _downloadLink: function() {
    console.log("test");
    window.open('http://knockt.com/knockt.apk');
  },
  _renderLogin: function() {
    return ( <SignIn signIn={ this.signIn } /> );
  },
  _renderSignup: function() {

  },
  _renderList: function() {
    let {
      items,
      columns,
      doorcodes
    } = this.state;

    return ( <div>
      <Title text="All My Doors" />
      <PagedList 
        ref="list"
        columns={
          [
            { name: "Description", style: { textAlign: "left" } },
            { name: "Last Ring", style: {float: "right", right: "auto" } }
          ]
        }
        items={ items }
        doorcodes={ doorcodes }
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
    this.id_token = googleUser.getAuthResponse().id_token;

    // console.log(this.id_token);

    this.getDoorbells();
  },
  getDoorbells: function() {
    this.setState({ state: State.LOAD });

    var loginReq = new XMLHttpRequest();
    loginReq.open("POST", uri + "/listdoorbells");

    loginReq.setRequestHeader("Content-Type", "application/json");
    loginReq.onreadystatechange = this.receivedDoors.bind(this, loginReq);
    loginReq.onerror = this.onError;
    loginReq.send(JSON.stringify({ token: this.id_token }));
  },
  receivedDoors: function(req) {
    if (req.readyState === XMLHttpRequest.DONE) {
      if (req.status === 200) {
        // console.log("Got doors: " + req.responseText);
        var responseData = JSON.parse(req.responseText).data;
        this.setState({ 
          items: responseData.map(function(door) {
            var ringFormat = "Never rung";
            if (door.lastrang) {
              var ringTime = new Date(door.lastrang);
              ringFormat = ("0" + ringTime.getHours()).slice(-2) + ':' + ("0" + ringTime.getMinutes()).slice(-2) + ' ' + monthNames[ringTime.getMonth()] + ' ' + ringTime.getDate() + ', ' + (1900 + ringTime.getYear());
            }
            return [door.description, ringFormat]; }),
          doorcodes: responseData.map(function(door) {
            return door.doorcode;
          }),
          state: State.LIST
        });
      }
      if (req.status === 404) {
        this.setState({ 
          items: [],
          doorcodes: [],
          state: State.LIST
        });
      }
    } else {
      this.setState({ state: State.ERROR });
    }
  },
  onError: function(req) {
    this.setState({ state: State.ERROR });
  },
  addDoor: function(name) {
    var req = new XMLHttpRequest();
    req.open("POST", uri + "/adddoor");
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = this.getDoorbells;
    req.onerror = this.onError;
    req.send(JSON.stringify({ token: this.id_token, description: name }));
  },
  deleteDoor: function(doorcode) {
    var req = new XMLHttpRequest();
    req.open("POST", uri + "/deletedoor");
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = this.getDoorbells;
    req.onerror = this.onError;
    req.send(JSON.stringify({ token: this.id_token, doorcode: doorcode }));
  }
});

module.exports = Root;
