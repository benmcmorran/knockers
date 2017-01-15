"use strict";

var React = require('react');
var SelectCheck = require('../SelectCheck/SelectCheck.jsx');
var Button = require('../Button/Button.jsx');
var glyphPrint = require('../../assets/glyph_print.png')
var glyphDelete = require('../../assets/glyph_delete.png')

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
      columns,
      doorcode
    } = this.props;

    return (
      <div className="pagedlistitem" onClick={ this._onClick } >
        <div className="pagedlistitem-name">
          { true && ( <SelectCheck 
            isSelected={ selected } 
            onClick={ this._toggleSelect } /> ) }
            <div className="pagedlistitem-delete">
              <Button
                text={( <img src={ glyphDelete }
                onClick={ this.deleteDoor } /> )}
                />
            </div>
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
        <div className={ "pagedlistitem-info" +
          (expanded ? " expanded" : "") } >
          <Button text={ (
            <div className="pagedlistitem-print">
              <img src={ "https://chart.googleapis.com/chart?cht=qr&chs=160x160&chl=" + doorcode } />
              <br />
              <img src={ glyphPrint } />
            </div>
            ) } 
            onClick={ this._clickPrint } />
        </div>
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
    let {
      expanded
    } = this.state;

    this.setState({ expanded: !expanded });
  },
  _clickPrint: function() {
    console.log("Print some stuff");
  },
  deleteDoor: function() {
    let {
      doorcode,
      deleteDoor
    } = this.props
    deleteDoor(doorcode);
  }
});

module.exports = PagedListItem;
