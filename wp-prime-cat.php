<?php
/**x
 * Plugin Name: Prime Cat
 * Plugin URI: https://bitbucket.org/jared-rethman/wp-prime-cat
 * Description: Provides Primary Category designation and ordering to your WordPress eco-system. View the <a href="https://bitbucket.org/jared-rethman/wp-prime-cat/wiki/Home">Wiki</a> for more information.
 * Version: 1.0.1
 * Author: Jared Rethman
 * Author URI: https://github.com/jaredrethman
 * Text Domain: prime-cat
 *
 * @package Wp\PrimeCat
 * @author  Jared Rethman <jaredrethman@gmail.com>
 */

namespace Wp\PrimeCat;

/** const Wp\PrimeCat\VER string */
const VER = '1.0.1';
/** const Wp\PrimeCat\DEBUG number */
if ( ! defined( __NAMESPACE__ . '\DEBUG' ) ) {
	define( __NAMESPACE__ . '\DEBUG', false );
}
/** const Wp\PrimeCat\URL string */
if ( ! defined( __NAMESPACE__ . '\DEV_URL' ) ) {
	define( __NAMESPACE__ . '\DEV_URL', ( is_ssl() ? 'https' : 'http' ) . '://localhost:4000/' );
}
if ( ! defined( __NAMESPACE__ . '\URL' ) ) {
	define( __NAMESPACE__ . '\URL', plugin_dir_url( __FILE__ ) );
}
/** const Wp\PrimeCat\PATH string */
if ( ! defined( __NAMESPACE__ . '\PATH' ) ) {
	define( __NAMESPACE__ . '\PATH', trailingslashit( __DIR__ ) );
}

/** On Plugin Activation\Deactivation */
register_activation_hook( 'wp-prime-cat.php', function () {
} );
register_deactivation_hook( 'wp-prime-cat.php', function () {
} );

/**
 * @param $class
 * @since   v1.0.0
 * @since   v1.0.1  Fixed file_exists check.
 */
if ( file_exists( PATH . 'vendor/autoload.php' ) ) {
	require( PATH . 'vendor/autoload.php' );
} else {

	try {
		\spl_autoload_register( function( $class ) {

			/** Only auto-load from within this directory */
			if ( stripos( $class, __NAMESPACE__ ) === false ) {
				return;
			}

			$file_path = PATH . 'includes/' . str_ireplace( __NAMESPACE__ . '\\', '', $class ) . '.php';
			$file_path = str_replace( '\\', DIRECTORY_SEPARATOR, $file_path );
			if ( file_exists( $file_path ) ) {
				include_once( $file_path );
			}

		} );
	} catch(\Exception $e){}
}

/** Bootstrap Plugin */
if ( class_exists( __NAMESPACE__ . '\PrimeCat' ) ) {
	add_action( 'plugins_loaded', function () {
		global $wp_version;
		/**
		 * Gutenberg is optional, if this check fails
		 * it will display a notice, but no relevant hooks will run.
		 */
		if ( version_compare( $wp_version, '5.0.0', '<' ) && ! defined( 'GUTENBERG_VERSION' ) ) {
			add_action( 'admin_notices', function () {
				?>
                <div class="notice-warning notice is-dismissible" style="border-left-color: #ffb900;">
                    <p><?php _e( 'PrimeCat requires a WordPress version >= v5.0.0.', 'wp-prime-cat' ); ?></p>
                </div>
				<?php
			} );
		}
		/**
		 * PHP >= 7 is the on mandatory
		 * requirement. If this check fails, we return.
		 */
		if ( version_compare( phpversion(), '7.0.0', '<=' ) ) {
			add_action( 'admin_notices', function () {
				?>
                <div class="notice-error notice is-dismissible" style="border-left-color: #ffb900;">
                    <p><?php _e( 'PrimeCat requires a PHP version >= v7.0.0.', 'wp-prime-cat' ); ?></p>
                </div>
				<?php
			} );

			return;
		}
		/**
		 * Start her up.
		 */
		new PrimeCat();
		/** Utility functions for interacting with prime cats. */
		require_once( PATH . 'includes/functions.php' );
	}, 80 );
}
