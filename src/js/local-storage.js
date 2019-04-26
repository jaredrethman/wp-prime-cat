/** Lodash */
import { get, set } from 'lodash';
/** Local deps */
const { localStorage } = window;
const { userId } = window.wpPrimeCat;

/**
 * Local Storage Helper
 */
class LocalStorageHelper {
  constructor() {
    this.userCacheKey = `TENUP_DATA_USER_${userId}`;
    this.primeCatPanelCacheKey = 'taxonomy-panel-category-sub_panel-prime_cat';
    this.isOpenCacheKey = `[wp/editor].preferences.panels[${this.primeCatPanelCacheKey}].open`;

    this.userCache = this.getItem();
    this.isOpen = get(this.userCache, this.isOpenCacheKey, true);
  }

  /**
   * @returns {*}
   */
  getItem() {
    let userCache = localStorage.getItem(this.userCacheKey);
    /** EXISTS */
    if (userCache !== null) {
      if (typeof userCache !== 'object') {
        userCache = JSON.parse(userCache);
      }
      /**
       * If panel open key does not
       * EXIST, safely add it
       */
      if (get(userCache, this.isOpenCacheKey, null) === null) {
        set(userCache, this.isOpenCacheKey, true);
        return userCache;
      }
    } else {
      userCache = set({}, this.isOpenCacheKey, true);
      return userCache;
    }
    return userCache;
  }

  set(isOpen) {
    set(this.userCache, this.isOpenCacheKey, isOpen);
    localStorage.setItem(this.userCacheKey, JSON.stringify(this.userCache));
  }
}

export default LocalStorageHelper;
