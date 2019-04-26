/* global window */

/** React */
import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';

/** Components */
import PrimeCatPills from './PrimeCatPills.jsx';

const wp = window.wp || {};

/** WordPress */
const { compose } = wp.compose;
const { apiFetch } = wp;
const {
  withSelect,
  withDispatch,
} = wp.data;
const wpDataSelect = wp.data.select;
const wpDataDispatch = wp.data.dispatch;

/** Globals */
const wpTerms = window.wpPrimeCat.terms;
const getSelectedTerms = (terms, selectedTermIds) => terms.filter(term => selectedTermIds.includes(term.id));

class PrimeCat extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      primeCatId: this.getPrimeCatId(),
      isFetching: false,
      terms: wpTerms,
      exceptionCaught: false,
      selectedTerms: props.terms,
      currentRadios: getSelectedTerms(wpTerms, props.terms),
    };
  }

  getPrimeCatId(){
    let primeCatId = window.wpPrimeCat.primeCatId === ''
      ? 0
      : parseInt(window.wpPrimeCat.primeCatId, 10);

    primeCatId = primeCatId === 0 ? this.props.terms[0] : primeCatId;

    /**
     * Current Prime Cat
     * Edge-case check, if term is deleted and associated
     * post meta has not.
     */
    if (!this.props.terms.includes(primeCatId)) {
      primeCatId = this.props.terms[0];
    }

    return primeCatId;
  }

  componentDidMount() {

    /** Current Prime Cat */
    if (!this.props.terms.includes(this.state.primeCatId)) {
      this.setPrimeCat(this.props.terms[0]);
    }
  }

  componentDidCatch(error) {
    this.setState({ exceptionCaught: true });
    console.error(error);
  }

  onChange(termId) {
    this.setPrimeCat(termId);
  }

  setPrimeCat(termId) {
    this.setState({ primeCatId: parseInt(termId, 10) }, () => {
      this.props.setMetaFieldValue(this.state.primeCatId);
      window.wpPrimeCat.primeCatId = this.state.primeCatId;
    });
  }

  /**
   * Fetch Terms
   * This is normally only called when a
   * new term is added.
   * @param termId
   */
  fetchTerm(termId) {
    this.setState({ isFetching: true });
    apiFetch({ path: `/wp/v2/categories/${termId}` })
      .then((term) => {
        if (!term.name) {
          return;
        }
        wpTerms.push({
          id: term.id,
          name: term.name,
        });
        this.setState({
          isFetching: false,
          currentRadios: getSelectedTerms(wpTerms, this.props.terms),
        });
      }).catch((e) => {
        console.log(e);
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    /**
     * Handle props.terms changes
     */
    if (prevProps.terms.length !== this.props.terms.length) {
      if (!this.props.terms.includes(this.state.primeCatId)) {
        let termId = 0;
        if(this.props.terms.length > 0){
          termId = this.props.terms[0];
        }
        this.setPrimeCat(termId);
      }
      /**
       * Handle state.currentRadios changes
       */
      const currentRadios = getSelectedTerms(this.state.terms, this.props.terms);

      if (this.props.terms.length === currentRadios.length) {
        this.setState({ currentRadios });
      } else {
        const terms = JSON.parse(JSON.stringify(this.props.terms));
        for (let i = 0, m = currentRadios.length; i < m; i++) {
          const termPos = terms.indexOf(currentRadios[i].id);
          if (termPos > -1) {
            terms.splice(termPos, 1);
          }
        }
        if (terms.length > 0) {
          this.fetchTerm(terms);
        }
      }
    }
  }

  render() {
    const {
      OriginalComponent,
      terms,
    } = this.props;
    let primeCatPills;

    if (this.state.exceptionCaught) {
      return (
        <>
          <OriginalComponent {...this.props} />
          <div>
            ERROR: Loading Prime Cat component. View console.
          </div>
        </>
      );
    }

    if (terms.length > 0) {
      primeCatPills = <PrimeCatPills
        terms={this.state.currentRadios}
        primeCatId={this.state.primeCatId}
        isFetching={this.state.isFetching}
        onChange={(e) => {
          this.onChange(parseInt(e.target.value, 10));
        }}
      />;
    }
    return (
      <>
        <OriginalComponent {...this.props} />
        {primeCatPills}
      </>
    );
  }
}

PrimeCat.propTypes = {
  OriginalComponent: PropTypes.func.isRequired,
  setMetaFieldValue: PropTypes.func,
  terms: PropTypes.object,
};

let PrimeCatComposed = compose([
  withSelect(() => ({
    metaFieldValue: wpDataSelect('core/editor').getEditedPostAttribute('meta')
      ._wp_prime_cat,
  })),
  withDispatch(() => ({
    setMetaFieldValue(value) {
      if (isNaN(value)) {
        return;
      }
      const currentMeta = wpDataSelect('core/editor').getEditedPostAttribute('meta');
      const newMeta = {
        ...currentMeta,
        _wp_prime_cat: value,
      };
      wpDataDispatch('core/editor').editPost(
        { meta: newMeta },
      );
    },
  })),
])(PrimeCat);

if (NODE_ENV === 'development') {
  PrimeCatComposed = hot(PrimeCatComposed);
}

export default PrimeCatComposed;
