"use strict";

var React = require('react');
var SelectCheck = require('../SelectCheck/SelectCheck.jsx');
var PagedListItem = require('./PagedListItem.jsx');
var DoorForm = require('../DoorForm/DoorForm.jsx');
var TextField = require('../TextField/TextField.jsx');
var Button = require('../Button/Button.jsx');
var glyphDelete = require('../../assets/glyph_delete.png')

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
        items.length),
      addingDoor: false,
      buttonTop: 0,
      filteredItems: items
    };
  },
  componentDidMount: function() {
    this.updatebuttonTop();
    window.addEventListener('scroll', this.updatebuttonTop);
  },
  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.updatebuttonTop);
  },
  componentWillReceiveProps: function(nextProps) {
    let {
      items,
      itemsPerPage
    } = nextProps;
    this.setState({
      startIndex: 0,
      endIndex: Math.min(
        itemsPerPage ? itemsPerPage : 10,
        items.length),
      filteredItems: filteredItems
    });
  },
  render: function () {
    let {
      columns,
      items,
      itemsPerPage
    } = this.props;
    let {
      isAllSelected,
      startIndex,
      endIndex,
      addingDoor,
      buttonTop,
      filteredItems
    } = this.state;

    var indexText = startIndex + 1 + " - " + endIndex;
    if (filteredItems.length > (itemsPerPage ? itemsPerPage : 10)) {
        indexText += " of " + filteredItems.length;
    }

    return (
      <div className="pagedlist">
        <div className="pagedlist-header">
          { ( <SelectCheck 
            onClick={ this._toggleSelectAll } 
            isSelected={ isAllSelected } /> ) }
          <div className="pagedlistitem-delete">
            <Button
              text={( <img src={ glyphDelete } /> )}
              disabled={ true }
              />
          </div>
          { columns.map(this._renderColumnName) }
        </div>
        <div className="pagedlist-items">
            { this._renderPage() }
        </div>
        <div className="pagedlist-footer">
          <div className="doorbutton">
            <Button
              text="Add Door"
              fill="true"
              onClick={ this._openDoorWindow }
              />
          </div>
          <div className="pagedlist-index">{ indexText }</div>
          <div 
            className={ "pagedlist-prev" + (startIndex == 0 ? " disabled" : "") }
            onClick={ this._prevPage }
            >
            { "<" }
          </div>
          <div 
            className={ "pagedlist-next" + (endIndex == filteredItems.length ? " disabled" : "") }
            onClick={ this._nextPage }
            >
            { ">" }
            </div>
        </div>
        { addingDoor &&
          <DoorForm 
            closeForm={ this.closeForm }
            addDoor={ this._addDoor }
            />
        }
      </div>
    )
  },
  _renderPage: function() {
    var {
      columns,
      doorcodes,
      deleteDoor
    } = this.props;
    var {
      isAllSelected,
      startIndex,
      endIndex,
      filteredItems
    } = this.state;
    var list = this;

    return filteredItems.slice(startIndex, endIndex).map(function(item, index) {
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
              doorcode={ doorcodes[itemIndex] }
              deleteDoor={ deleteDoor }
              />
        )
    });
  },
  _renderColumnName: function(column, columnIndex) {
    if (column.name == "Description") {
      return this._renderFilter(columnIndex);
    }
    return (
      <div
        className="pagedlist-headertext"
        key={ columnIndex }
        style={ column.style }
        >
        { column.name }
        </div> );
  },
  _renderFilter: function(columnIndex) {
    return ( 
      <div className="list-filter" key={ columnIndex } >
        <TextField 
          label="Filter"
          onChange={ this._updateFilter } />
      </div> );
  },
  _updateFilter: function(e) {
    let {
      items,
      itemsPerPage
    } = this.props;
    var newItems = items.filter(function(item) {
        return item[0].includes(e.target.value);
      })
    this.setState({
      filteredItems: newItems,
      startIndex: 0,
      endIndex: Math.min(
        itemsPerPage ? itemsPerPage : 10,
        newItems.length)
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
      itemsPerPage
    } = this.props;
    let {
      startIndex,
      filteredItems,
      endIndex
    } = this.state;

    if (endIndex != filteredItems.length) {
      var newStartIndex = endIndex;
      var newEndIndex = Math.min(endIndex + (itemsPerPage ? itemsPerPage : 10), filteredItems.length)
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
  },
  _openDoorWindow: function() {
    this.setState({ addingDoor: true });
  },
  _addDoor: function(name) {
    let {
      addDoor
    } = this.props;

    this.setState({ addingDoor: false });
    addDoor(name);
  },
  closeForm: function() {
    this.setState({ addingDoor: false });
  },
  updatebuttonTop: function(e) {
    var newHeight = document.body.clientHeight - 108 - window.scrollY;
    this.setState({ buttonTop: newHeight });
  }
});

module.exports = PagedList;
