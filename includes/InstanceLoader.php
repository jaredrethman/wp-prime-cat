<?php
/**
 * Abstract class used to provide a
 * singleton pattern for extending classes.
 */
declare(strict_types=1);

namespace Wp\PrimeCat;

abstract class InstanceLoader {
	/**
	 * @var null Holds class instance
	 */
	private static $_instance = null;

	/**
	 * InstanceLoader constructor.
	 */
	function __construct() {
		$this->load();
	}

	/**
	 * Uses singleton pattern.
	 * @return Admin
	 */
	public static function instance():self {
		if ( null === self::$_instance ) {
			try {
				$called_class = new \ReflectionClass( get_called_class() );
				self::$_instance = new $called_class->name;
			} catch (\ReflectionException $e) {
				if(WP_DEBUG) {
					exit( $e->getMessage() );
				}
			}
		}
		return self::$_instance;
	}

	/**
	 * Called when extended class
	 * instance has loaded.
	 */
	protected abstract function load();
}
