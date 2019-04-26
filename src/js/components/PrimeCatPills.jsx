import React from 'react';
import PropTypes from 'prop-types';

import PrimeCatSvg from './PrimeCatSvg.jsx';

import LocalStorageHelper from '../local-storage';

let LsHelper;

class PrimeCatPills extends React.Component {
  constructor(props) {
    super(props);

    this.setStorage = this.setStorage.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);

    LsHelper = new LocalStorageHelper();

    this.state = {
      isOpen: LsHelper.isOpen,
    };
  }

  setStorage() {
    LsHelper.set(this.state.isOpen);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.setStorage);
  }

  componentWillUnmount() {
    LsHelper.set(this.state.isOpen);
    window.removeEventListener('beforeunload', this.setStorage);
  }

  toggleVisibility() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const {
      terms,
      onChange,
      primeCatId,
      isFetching,
    } = this.props;
    if(terms.length === 0 || primeCatId === 0){
      return null;
    }
    let currentTermObject = terms.map(e => e.id).indexOf(primeCatId);
    currentTermObject = terms[currentTermObject];
    const { name: currentName, id: currentId } = currentTermObject;
    /**
     * Pills iterator
     */
    let pills = terms.map(term => <label key={term.id}>
      <input
        checked={currentId === term.id}
        onChange={onChange}
        type="radio"
        name="react-tips"
        value={term.id}
        className="form-check-input"
      />
      <span>
          {term.name}
        </span>
    </label>);
    /**
     * Title
     */
    if (isFetching) {
      pills = <>
        {pills}
        <label key="loader">
            <span>
              Loading...
            </span>
        </label>
      </>;
    }
    return (
      <div className="wp-prime-cat">
        <input defaultChecked={this.state.isOpen}
               onChange={this.toggleVisibility}
               type="checkbox"
               id="wp-prime-cat__pills-toggle"/>
        <label className="wp-prime-cat__title"
               htmlFor="wp-prime-cat__pills-toggle">
          <span>Prime Cat</span>
          <span className="wp-prime-cat__title-current-selection"> - {currentName}</span>
          <PrimeCatSvg className="wp-prime-cat__title-arrow"
                       path={'static/wp-admin-post-edit-arrow.svg'}/>
        </label>
        <div className="wp-prime-cat__pills" aria-hidden={JSON.stringify(!this.state.isOpen)}>
          {pills}
        </div>
      </div>
    );
  }
}

PrimeCatPills.propTypes = {
  terms: PropTypes.array,
  primeCatId: PropTypes.number,
  onChange: PropTypes.func,
  isFetching: PropTypes.bool,
};

export default PrimeCatPills;
