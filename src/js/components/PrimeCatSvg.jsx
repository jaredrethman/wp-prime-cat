import React from "react";
import PropTypes from "prop-types";

class PrimeCatSvg extends React.Component {
  render() {
    const {
      path
    } = this.props;

    return (
      <span className={this.props.className} dangerouslySetInnerHTML={{__html: require('../../' + path)}}/>
    )
  }
}

PrimeCatSvg.propTypes = {
  path: PropTypes.string,
};

export default PrimeCatSvg;
