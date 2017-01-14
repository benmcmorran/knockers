"use strict";

var React = require('react');
var SelectCheck = require('../SelectCheck/SelectCheck.jsx');

require('./pagedList.scss');

var PagedListItem = React.createClass({
  getInitialState: function() {
    return { selected: this.props.isAllSelected };
  },
  render: function () {
    var content = this.props.content;

    return (
      <div className="pagedlistitem">
        <SelectCheck isSelected={ this.state.selected } onClick={ this._toggleSelect } />
          { this.props.columns.map(function(column, columnIndex) {
                return (
                    <div
                        className="pagedlistitem-text"
                        key={ columnIndex }
                        style={ column.style }
                        >
                        { content[columnIndex] }
                    </div>
                )
          }) }
      </div>
    )
  },
  _toggleSelect: function() {
    this.setSelected(!this.state.selected);
  },
  setSelected: function(isSelected) {
    this.state.selected = isSelected;
    this.props.list.setItemSelected(this.props.itemIndex, this.state.selected);
    this.forceUpdate();
  },
  getSelected: function() {
    return this.state.selected;
  },
});

module.exports = PagedListItem;
