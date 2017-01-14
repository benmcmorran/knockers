// components/Root.jsx
var React = require('react');

require('./selectCheck.scss');

var SelectCheck = React.createClass({
  render: function () {
    return (
    <div className={ "selectcheck " + (this.props.isSelected ? "selected" : "") }>
        <svg className="selectcheck-svg" onClick={ this.props.onClick }>
            <circle cx="50%" cy="50%" r="35%" fill="rgba(0, 0, 0, 0)" strokeWidth="8%" />
            <line x1="30%" y1="50%" x2="46.25%" y2="66.25%" strokeWidth="5%" />
            <line x1="70%" y1="40%" x2="46.25%" y2="66.25%" strokeWidth="5%" />
        </svg>
      </div>
    )
  }
});

module.exports = SelectCheck;
