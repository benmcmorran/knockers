"use strict";

var React = require('react');
var SelectCheck = require('../SelectCheck/SelectCheck.jsx');

require('./pagedList.scss');

var PagedListItem = React.createClass({
  getInitialState: function() {
    return { selected: this.props.isAllSelected, expanded: false };
  },
  render: function () {
    let {
      selected,
      expanded
    } = this.state;
    let {
      content,
      columns
    } = this.props;

    return (
      <div className="pagedlistitem">
        <div
          className="pagedlistitem-name"
          onClick={ this._onClick } >
          <SelectCheck 
            isSelected={ selected } 
            onClick={ this._toggleSelect } />
            { columns.map(function(column, columnIndex) {
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
        { expanded && (
          <div className="pagedlistitem-info">
          </div>
        ) }
      </div>
    )
  },
  _toggleSelect: function() {
    this.setSelected(!this.state.selected);
  },
  setSelected: function(isSelected) {
    this.setState({ selected: isSelected });
    this.props.list.setItemSelected(this.props.itemIndex, isSelected);
    // this.forceUpdate();
  },
  getSelected: function() {
    return this.state.selected;
  },
  _onClick: function() {
    this.setState({ expanded: true });
  }
});

module.exports = PagedListItem;
