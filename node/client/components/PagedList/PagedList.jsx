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
    if (endIndex < items.length) {
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
                  className="pagedlist-prev"
                  onClick={ this._prevPage }
                  >
                  { "<" }
                </div>
                <div 
                  className="pagedlist-next"
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
  _prevPage: function() {
    var {
      items,
      itemsPerPage
    } = this.props;
    var {
      startIndex
    } = this.state;
    if (startIndex != 0) {
      this.state.endIndex = startIndex;
      this.state.startIndex = Math.max(
          startIndex - (itemsPerPage ? itemsPerPage : 10),
          0);
    }
    this.forceUpdate();
  },
  _nextPage: function() {
    var {
      items,
      itemsPerPage
    } = this.props;
    var {
      endIndex
    } = this.state;
    if (endIndex != items.length) {
      this.state.startIndex = endIndex;
      this.state.endIndex = Math.min(
          endIndex + (itemsPerPage ? itemsPerPage : 10),
          items.length);
    }
    this.forceUpdate();
  },
  _toggleSelectAll: function() {
      this.state.isAllSelected = !this.state.isAllSelected;
      var {
        itemsPerPage,
        startIndex,
        endIndex
      } = this.state;

      for (var i = startIndex; i < endIndex; i++) {
        this.refs['item-' + i].setSelected(this.state.isAllSelected);
      }
      this.forceUpdate();
  },
  setItemSelected(index, isSelected) {
      var {
        startIndex,
        endIndex
      } = this.state;

      if (index >= 0 && index < this.props.items.length) {
          var itemIndex = this.state.itemsSelected.indexOf(index);
          if (itemIndex < 0) {
              if (isSelected) {
                  this.state.itemsSelected.push(index);
              }
          } else {
              if (!isSelected) {
                  this.state.itemsSelected.splice(itemIndex, 1);
              }
          }
      }
      var selectedOnPage = 0;
      for (var i = startIndex; i < endIndex; i++) {
        if (this.refs['item-' + i].getSelected()) {
          selectedOnPage++;
        }
      }

      if (selectedOnPage == endIndex - startIndex) {
          this.state.isAllSelected = true;
          this.forceUpdate();
      }
      if (selectedOnPage == 0) {
          this.state.isAllSelected = false;
          this.forceUpdate();
      }
  }

});

module.exports = PagedList;
