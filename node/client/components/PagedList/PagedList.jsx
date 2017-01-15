"use strict";

var React = require('react');
var SelectCheck = require('../SelectCheck/SelectCheck.jsx');
var PagedListItem = require('./PagedListItem.jsx');
var DoorForm = require('../DoorForm/DoorForm.jsx');
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
      buttonTop: 0
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
      buttonTop
    } = this.state;

    var indexText = startIndex + 1 + " - " + endIndex;
    if (items.length > (itemsPerPage ? itemsPerPage : 10)) {
        indexText += " of " + items.length;
    }

    return (
      <div className="pagedlist">
        <div className="pagedlist-header">
          { ( <SelectCheck 
            onClick={ this._toggleSelectAll } 
            isSelected={ isAllSelected } /> ) }
            <div className="pagedlistitem-delete">
              <Button
                text={( <img src={ glyphDelete }
                disabled={ true } /> )}
                />
            </div>
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
        <div className="adddoor-container"
            style={ { "top": buttonTop } } >
          <div
            className="adddoor"
            onClick={ this._openDoorWindow } >
            <svg>
              <line x1="40%" y1="50%" x2="60%" y2="50%" strokeWidth="3%" />
              <line x1="50%" y1="40%" x2="50%" y2="60%" strokeWidth="3%" />
            </svg>
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
              doorcode={ doorcodes[itemIndex] }
              deleteDoor={ deleteDoor }
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
