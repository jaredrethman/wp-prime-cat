# Prime Cat:

A WordPress plugin for handling Primary Category assignment of all post types that use the category taxonomy.

## Features:

* WebPack 4 for Module Bundling. WebPack-Dev-Server for development.
* Simple UI for managing/assigning a PrimeCat for already selected categories.
* Category selection based on PrimeCat if using `%category%` in permalink structure.
* Query posts that have a PrimeCat assigned to a specific category term by passing `'prime_cat' => $term_id` `$args` to `WP_Query($args)`.
* Utility functions for PrimeCat detection and retrieval for post_types.

## Requires:

* This plugin is built using progressive enhancement and will only function on WordPress sites using Gutenberg, either plugin or WordPress >= v5.
* PHP >= 7.0.0 
* Post Types wanting to make use of PrimeCats will need to set 2 arguments when registering post_types:
  
  1. Have taxonomy set to category - `'taxonomy' => ['category']`
  2. Have custom fields support -  `'supports' => ['custom-fields']`

## [Wiki](https://github.com/jaredrethman/wp-prime-cat/wiki)
