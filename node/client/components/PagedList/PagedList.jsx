"use strict";

var React = require('react');
var SelectCheck = require('../SelectCheck/SelectCheck.jsx');
var PagedListItem = require('./PagedListItem.jsx');

require('./pagedList.scss');

var PagedList = React.createClass({
  getInitialState: function() {
    var {
      items,
      itemsPerPage
    } = this.props;
    return { 
      isAllSelected: false, 
      itemsSelected: [], 
      startIndex: 0,
      endIndex: Math.min(
          itemsPerPage ? itemsPerPage : 10,
          items.length)
    };
  },
  render: function () {
    var {
      columns,
      items,
      itemsPerPage
    } = this.props;
    var {
      isAllSelected,
      startIndex,
      endIndex
    } = this.state;

    var indexText = startIndex + 1 + " - " + endIndex;
    if (items.length > (itemsPerPage ? itemsPerPage : 10)) {
        indexText += " of " + items.length;
    }

    return (
      <div className="pagedlist">
        <div className="pagedlist-header">
          <SelectCheck 
            onClick={ this._toggleSelectAll } 
            isSelected={ isAllSelected } />
            {
              columns.map(function(column, columnIndex) {
                return (
                  <div
                  className="pagedlist-headertext"
                  key={ columnIndex }
                  style={ column.style }
                  >
                  { column.name }
                  </div>
                )
              })
            }
        </div>
        <div className="pagedlist-items">
            { this._renderPage() }
        </div>
        { items.length > (itemsPerPage ? itemsPerPage : 10) && (
            <div className="pagedlist-footer">
                <div className="pagedlist-index">{ indexText }</div>
                <div 
                  className={ "pagedlist-prev" + (startIndex == 0 ? " disabled" : "") }
                  onClick={ this._prevPage }
                  >
                  { "<" }
                </div>
                <div 
                  className={ "pagedlist-next" + (endIndex == items.length ? " disabled" : "") }
                  onClick={ this._nextPage }
                  >
                  { ">" }
                </div>
            </div>
          )
        }
      </div>
    )
  },
  _renderPage: function() {
    var { columns } = this.props;
    var {
      isAllSelected,
      startIndex,
      endIndex
    } = this.state;
    var list = this;

    return this.props.items.slice(startIndex, endIndex).map(function(item, index) {
        var itemIndex = index + startIndex;
        return (
            <PagedListItem 
                columns={ columns }
                content={ item }
                key={ itemIndex }
                itemIndex={ itemIndex }
                isAllSelected={ isAllSelected }
                list= { list }
                ref={ 'item-' + itemIndex }
                />
        )
    });
  },
  _forceUpdateItems: function() {
    var {
      startIndex,
      endIndex
    } = this.state;

    for (var i = startIndex; i < endIndex; i++) {
      this.refs['item-' + i].forceUpdate();
    }
  },
  _prevPage: function() {
    let {
      items,
      itemsPerPage
    } = this.props;
    let {
      startIndex
    } = this.state;

    if (startIndex != 0) {
      var newStartIndex = Math.max(startIndex - (itemsPerPage ? itemsPerPage : 10), 0)
      var newEndIndex = startIndex;
      this.setState({
        startIndex: newStartIndex,
        endIndex: newEndIndex
        });
      this._checkAllSelectionState(newStartIndex, newEndIndex);
    }
  },
  _nextPage: function() {
    let {
      items,
      itemsPerPage
    } = this.props;
    let {
      startIndex,
      endIndex
    } = this.state;

    if (endIndex != items.length) {
      var newStartIndex = endIndex;
      var newEndIndex = Math.min(endIndex + (itemsPerPage ? itemsPerPage : 10), items.length)
      this.setState({
        startIndex: newStartIndex,
        endIndex: newEndIndex,
        });
        
      this._checkAllSelectionState(newStartIndex, newEndIndex);
    }
  },
  _toggleSelectAll: function() {
    var newSelectedState = !this.state.isAllSelected;
    this.setState({ isAllSelected: newSelectedState });
    var {
      itemsPerPage,
      startIndex,
      endIndex
    } = this.state;

    for (var i = startIndex; i < endIndex; i++) {
      this.refs['item-' + i].setSelected(newSelectedState);
    }
  },
  setItemSelected(index, isSelected) {
    let {
      items
    } = this.props;

    let {
      startIndex,
      endIndex,
      itemsSelected
    } = this.state;

    if (index >= 0 && index < items.length) {
        var itemIndex = itemsSelected.indexOf(index);
        if (itemIndex < 0) {
            if (isSelected) {
                itemsSelected.push(index);
            }
        } else {
            if (!isSelected) {
                itemsSelected.splice(itemIndex, 1);
            }
        }
    }

    this._checkAllSelectionState(startIndex, endIndex);
  },
  _checkAllSelectionState: function(startIndex, endIndex) {
    let {
      itemsSelected
    } = this.state;

    var selectedOnPage = 0;
    for (var i = startIndex; i < endIndex; i++) {
      if (itemsSelected.indexOf(i) != -1) {
        selectedOnPage++;
      }
    }

    if (selectedOnPage == endIndex - startIndex) {
      this.setState({ isAllSelected: true });
    }
    if (selectedOnPage == 0) {
      this.setState({ isAllSelected: false });
    }
  }
});

module.exports = PagedList;
