"use strict";

var React = require('react');
var ReactDom = require('react-dom');
var Root = require('../components/Root.jsx');

var app = ReactDom.render(<Root />, document.getElementById("app"));

var loadGapi = function() {
    console.log("gapi loaded");
    app.loadGapi();
}
