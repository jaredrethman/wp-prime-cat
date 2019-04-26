<?php
/**
 * Prime Cat - Admin
 *
 * Class for handling all wp-admin related functionality, specifically
 * enqueueing the relevant assets.
 *
 * @package Wp\PrimeCat
 * @since   1.0.0
 */
declare( strict_types=1 );

namespace Wp\PrimeCat;

/**
 * Class Admin
 * @package Wp\PrimeCat
 */
class Admin extends InstanceLoader {

	/**
	 * On class instance creation
	 * @since   1.0.0
	 * @see     InstanceLoader::load()
	 */
	protected function load() {
		add_action( 'enqueue_block_editor_assets', [ __CLASS__, 'assets' ] );
		/** Cleanup Hooks */
		add_action( 'save_post', [ __CLASS__, 'cleanup_prime_cats' ] );
		add_action( 'delete_category', [ __CLASS__, 'delete_category' ] );
	}

	/**
	 * Handle all Gutenberg JS/CSS
	 * @since   1.0.0
	 * @see wp-admin/edit-form-blocks.php
	 */
	public static function assets() {

		/** @var string $post_type */
		$post_type = get_post_type();

		if ( ! post_type_supports( $post_type, 'custom-fields' ) ) {
			return;
		}

		/**
		 * CSS - Only load production
		 * since style-loader takes care during
		 * development.
		 */
		if ( ! DEBUG ) {
			wp_enqueue_style(
				'prime-cat-admin',
				URL . 'dist/wp-prime-cat.css',
				[],
				VER
			);
		}

		/** JS */
		wp_enqueue_script( 'prime-cat-admin', ( DEBUG ? DEV_URL : URL ) . 'dist/wp-prime-cat.js', [
			'wp-hooks',
			'wp-api-fetch',
			'wp-compose',
			'wp-data',
			'lodash',
			'react-dom'
		], VER );

		/** @var array $data */
		$data = [
			'taxonomies' => get_object_taxonomies( 'post', 'objects' ),
		];

		wp_localize_script(
			'prime-cat-admin',
			'wpPrimeCat',
			[
				'userId'     => get_current_user_id(),
				'terms'      => self::map_category_for_js( $data['taxonomies']['category'] ),
				'primeCatId' => get_post_meta( get_the_ID(), '_wp_prime_cat', true )
			]
		);
	}

	/**
	 * @param $taxonomy
	 *
	 * @since   1.0.0
	 * @return array
	 */
	private static function map_category_for_js( \WP_Taxonomy $taxonomy ): array {
		$terms = get_terms( $taxonomy->name, [ 'hide_empty' => 0 ] );

		return array_map( array( __CLASS__, 'map_terms_key_name' ), $terms );
	}

	/**
	 * @since   1.0.0
	 *
	 * @param $term
	 *
	 * @return array
	 */
	private static function map_terms_key_name( $term ): array {
		return [
			'id'   => $term->term_id,
			'name' => $term->name,
		];
	}

	/**
	 * Cleanup
	 * Hook runs as soon as a term is deleted, and deletes post
	 * meta assigned to the term_id
	 *
	 * @param $term_id
	 *
	 * @since 1.0.0
	 */
	public static function delete_category( $term_id ) {
		$prime_cat_query = new \WP_Query( [
			'no_found_rows' => true,
			'fields'        => 'id',
			'prime_cat'     => $term_id,
		] );
		if ( $prime_cat_query->have_posts() ) {
			foreach ( $prime_cat_query->posts as $post ) {
				delete_post_meta( $post->id, '_wp_prime_cat' );
			}
		}
	}

	/**
	 * Cleanup PrimeCat's
	 * If it doesn't exists in post terms, delete it. This function is called in various places
	 * more specifically when using Quick Edit
	 *
	 * @param $post_id
	 * @since 1.0.0
	 */
	public static function cleanup_prime_cats( $post_id ) {

		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}
		/** @var int $prime_cat */
		$prime_cat = (int) get_post_meta( $post_id, '_wp_prime_cat', true );
		/** If PrimeCat doesn't exist */
		if ( $prime_cat < 1 ) {
			return;
		}
		/** @var array $terms */
		$terms = wp_get_object_terms( $post_id, 'category', [ 'fields' => 'ids' ] );
		/** If WP_Error or already in terms */
		if ( is_wp_error( $terms ) || in_array( $prime_cat, $terms ) ) {
			return;
		}
		delete_post_meta( $post_id, '_wp_prime_cat' );
	}
}
