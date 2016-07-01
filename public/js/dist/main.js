window.moment = require('moment');
window._ = require('lodash');
window.React = require('react');
window.ReactDOM = require('react-dom');
window.ReactBootstrap = require('react-bootstrap');
window.DateRangePicker = require('react-bootstrap-daterangepicker');
window.Victory = require('victory');
require('babel-core/browser');

require('./reacttowindow.js').fix(['Victory','ReactBootstrap']);