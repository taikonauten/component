import { CachedClasses, CachedRefs, ComponentLib } from 'src';

export declare global {
  /** Taikonauten namespace */
  interface Window {
    [index: string]: {
      component?: ComponentLib,
      __component: {
        classes: CachedClasses
      },
    };
  }
  interface Element {
    [index: string]: {
      __component: {
        ref: CachedRefs
      },
    };
  }
}
