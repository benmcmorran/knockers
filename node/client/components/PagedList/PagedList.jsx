// components/Root.jsx
var React = require('react');
var SelectCheck = require('../SelectCheck/SelectCheck.jsx');
var PagedListItem = require('./PagedListItem.jsx');

require('./pagedList.scss');

var PagedList = React.createClass({
  getInitialState: function() {
    // this.setItemSelected = this._setItemSelected.bind(this);
    return { isAllSelected: false, itemsSelected: [] };
  },
  render: function () {
    var columns = this.props.columns;
    var isAllSelected = this.state.isAllSelected;
    var list = this;

    return (
      <div className="pagedlist">
        <div className="pagedlist-header">
          <SelectCheck 
            onClick={ this._toggleSelectAll } 
            isSelected={ isAllSelected } />
            { columns.map(function(column, columnIndex) {
                return (
                    <div
                        className="pagedlist-headertext"
                        key={ columnIndex }
                        style={ column.style }
                        >
                        { column.name }
                    </div>
                )
            }) }
        </div>
        <div className="pagedlist-items">
            { this.props.items.map(function(item, itemIndex) {
                return (
                    <PagedListItem 
                      columns={ columns }
                      content={ item }
                      key={ itemIndex }
                      itemIndex={ itemIndex }
                      isAllSelected={ isAllSelected }
                      list= { list }
                      ref={ 'item-' + (itemIndex) }
                      />
                )
            }) }
        </div>
      </div>
    )
  },
  _toggleSelectAll: function() {
      this.state.isAllSelected = !this.state.isAllSelected;
      for (i = 0; i < this.props.items.length; i++) {
        this.refs['item-' + i].setSelected(this.state.isAllSelected);
      }
      this.forceUpdate();
  },
  setItemSelected(index, isSelected) {
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
      console.log(this.state.itemsSelected);
      if (this.state.itemsSelected.length == this.props.items.length) {
          console.log("Do something!");
          this.state.isAllSelected = true;
          this.forceUpdate();
      }
      if (this.state.itemsSelected.length == 0) {
          console.log("Do something!");
          this.state.isAllSelected = false;
          this.forceUpdate();
      }
  }

});

module.exports = PagedList;
