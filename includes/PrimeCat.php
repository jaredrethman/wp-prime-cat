<?php
/**
 * PrimeCat
 *
 * Class for handling primary entry point into plugin's
 * functionality
 *
 * @package Wp\PrimeCat
 * @since   1.0.0
 */
declare( strict_types=1 );

namespace Wp\PrimeCat;

class PrimeCat extends InstanceLoader {

	/**
	 * Loader constructor.
	 */
	public function load() {
		/** Admin hooks */
		if ( is_admin() ) {
			Admin::instance();
		}
		/** Global hooks */
		self::global();
	}

	/**
	 * Global functions/hooks
	 *
	 * Calls functions and hooks suitable for
	 * site-wide consumption.
	 */
	private static final function global() {
		/**
		 * Register meta for REST
		 */
		register_meta( 'post', '_wp_prime_cat', array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'number',
			'auth_callback' => function () {
				/**
				 * Typical authentication uses 'edit_post_meta'
				 * which doesn't appear to be a standard, granted,
				 * capability for administrator.
				 */
				return current_user_can( 'edit_posts' );
			}
		) );

		/**
		 * Ensures PrimeCat is used in
		 * permalink if it exists.
		 *
		 * @param $cat
		 * @param $cats
		 * @param $post
		 *
		 * @return int
		 */
		add_filter( 'post_link_category', function ( $cat, $cats, $post ): int {
			$prime_cat = (int) get_post_meta( $post->ID, '_wp_prime_cat', true );
			if ( 0 === $prime_cat ) {
				return $cat->term_id;
			}
			foreach ( $cats as $term ) {
				if ( $term->term_id === $prime_cat ) {
					return $prime_cat;
				}
			}

			return $cat->term_id;
		}, 10, 3 );

		/**
		 * Does the query contain prime_cat query var?
		 *
		 * @param $post \WP_Query
		 */
		add_action( 'pre_get_posts', function ( \WP_Query $query ) {
			if ( false !== ( $prime_cats = $query->get( 'prime_cat', false ) ) ) {
				/** @var bool $value_is_array */
				$value_is_array = (array) $prime_cats === $prime_cats;
				/** @var array $meta_query_args */
				$meta_query_args = [
					[
						'key'     => '_wp_prime_cat',
						'value'   => $prime_cats,
						'compare' => $value_is_array ? 'IN' : '='
					],
				];
				/** Make sure category is set to PrimeCat too */
				$query->set( 'cat', $prime_cats );
				$query->set( 'meta_query', $meta_query_args );
			}
		} );

	}
}
