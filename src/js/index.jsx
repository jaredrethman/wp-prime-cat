/**
 * Wp Prime Cat - main entry.
 */

import React from "react";
import PrimeCat from './components/PrimeCat.jsx';

require('../scss/styles.scss');

const { addFilter } = wp.hooks;

if( typeof addFilter === 'function' ){
  addFilter(
    "editor.PostTaxonomyType",
    'prime-cat/editor',
    PostTaxonomyControl => {
      return class Filter extends React.Component {
        render() {
          if('category' !== this.props.slug || typeof wp.data.select !== 'function'){
            return (
              <PostTaxonomyControl { ...this.props } />
            );
          }
          return (
            <PrimeCat
              PostTaxonomyControl={ PostTaxonomyControl }
              { ...this.props }
            />
          );
        };
      };
    },
  );
}
