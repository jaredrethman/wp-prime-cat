<?php
/**
 * Prime Cat - functions.php
 */
declare( strict_types=1 );

namespace Wp\PrimeCat;

/**
 * Get Prime Cat
 * Primary function for handling prime cat interaction.
 *
 * @param int $post_id
 * @param int $term_id
 * @param array $default
 *
 * @return array|bool|mixed|object|\WP_Error|\WP_Term|null
 */
function get_prime_cat( int $post_id = 0, int $term_id = 0, $default = [] ) {
	/** Test for post_id */
	if ( 0 === $post_id ) {
		$post_id = get_the_ID();
		/**
		 * If global post doesn't exist
		 */
		if ( false === $post_id ) {
			return $default;
		}
	}
	/** Test for term_id */
	if ( 0 === $term_id ) {
		if ( 0 === (int) ( $term_id = get_post_meta( $post_id, '_wp_prime_cat', true ) ) ) {
			return $default;
		}
	}
	/** Test for term cache */
	if ( ( $category = wp_cache_get( $term_id, 'terms' ) ) === false ) {
		$category = get_category( $term_id );
	} else {
		$category = new \WP_Term( $category );
	}
	if ( empty ( $category ) ) {
		return $default;
	}

	return $category;
}

/**
 * Does post have prime cat
 *
 * @param int $post_id
 *
 * @return bool
 */
function has_prime_cat( int $post_id = 0 ):bool {
	return false !== get_prime_cat( $post_id, 0, false );
}

/**
 * Get prime cat id for post
 * @return int
 */
function get_prime_cat_id():int {
	$prime_cat = get_prime_cat( 0, 0, false );
	if ( false === $prime_cat ) {
		return 0;
	}

	return (int) $prime_cat->term_id;
}
