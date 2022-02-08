
export type ComponentType = {
  new (el: Element): ComponentInterface;
};

export interface ComponentInterface {
  el: Element,
  reload(): void,
  destroy(): void,
  init(): void,
}

export type ComponentLib = {
  Component: ComponentType,
  registerClass(identifier: string, Class: ComponentType): void,
  getClass(identifier: string): ComponentType,
  registerComponent(selector: string, Class: ComponentType): void,
  getInstance(element: Element, Class: string): Component|undefined
  destroyInstance(element: Element, Class: string): boolean,
  reloadInstance(element: Element, Class: string): void,
};

export type CachedClasses = {
  [index: string]: ComponentType;
};

export type CachedRefs = {
  [index: string]: Component;
};

const COMPONENT_LOADED_CLASS = 'component-loaded';

/**
 * Type declaration for the global configuration for the component system.
 */
export type ComponentSystemConfiguration = {
  namespace: string,
};

// prepare default values (before setup)
export const DEFAULT_SETTINGS: ComponentSystemConfiguration = {
  namespace: '__Taikonauten',
};

export function setup(configuration: ComponentSystemConfiguration): void {
  DEFAULT_SETTINGS.namespace = configuration.namespace;

  if (!window[DEFAULT_SETTINGS.namespace]?.__component) {
    __DEBUG__ && console.info(`creating namespace window.${DEFAULT_SETTINGS.namespace}`);

    window[DEFAULT_SETTINGS.namespace] = {
      __component: {
        classes: {}
      }
    };
  } else {
    __DEBUG__ && console.info(`existing namespace found window.${DEFAULT_SETTINGS.namespace}. skipping...`);
  }

  window[DEFAULT_SETTINGS.namespace].component = {
    Component,
    destroyInstance,
    getClass,
    getInstance,
    registerClass,
    registerComponent,
    reloadInstance,
  };
}

export class Component {
  el: Element;

  constructor(el: Element) {
    this.el = el;

    if (!el[DEFAULT_SETTINGS.namespace]?.__component) {
      el[DEFAULT_SETTINGS.namespace] = {__component: {ref: {}}};
    }

    if (el[DEFAULT_SETTINGS.namespace].__component.ref[this.constructor.name]) {
      __DEBUG__ && console.error(`instance (${this.constructor.name}) already registered. destroy the instance first or reload the component.`);

      return;
    }

    el[DEFAULT_SETTINGS.namespace].__component.ref[this.constructor.name] = this;
  }

  get name(): string {
    return this.constructor.name;
  }

  init(): void {
    console.error('Missing implementation of init method');
  }

  destroy(): void {
    console.error('Missing implementation of destroy method');
  }

  reload(): void {
    this.destroy();
    this.init();
  }
}

/**
 * Store a reference of Class (e.g. Navigation). For each component that
 * is being initialized in our router we first check if the class is already
 * registered (cached) and use this one instead of fetching the resource again.
 * @param identifier - component identifier
 * @param Class - component class
 */
export function registerClass(identifier: string, Class: ComponentType): void {
  window[DEFAULT_SETTINGS.namespace].__component.classes[identifier] = Class;
}

/**
 * Get a Class by a given identifier that was stored previously
 * @param  identifier - component identifier
 * @return Class for the given identifier or undefined
 */
export function getClass(identifier: string): ComponentType {
  const Class = window[DEFAULT_SETTINGS.namespace].__component.classes[identifier];

  if (!Class) {
    __DEBUG__ && console.info(`cached Class for identifier: ${identifier} not found.`);
  }

  return Class;
}

/**
 * Initializes all components found in DOM by the given selector with
 * the given class function
 * @param selector - a valid css selector
 * @param Class - class function
 * @return All DOM elements found by the given selector or empty array if none found
 */
export function registerComponent(selector: string, Class: ComponentType): Element[] {
  if (
    !selector ||
    !Class
  ) {
    __DEBUG__ && console.warn('selector and Class are required.');

    return new Array<HTMLElement>();
  }

  const elements = Array.from(document.querySelectorAll(selector));

  elements.forEach(element => {
    // check for an existing instance
    // if an instance is found the element is already instantiated
    // if already instantiated we skip it
    if (getInstance(element, Class.constructor.name) !== undefined) {
      __DEBUG__ && console.info('instance for this element found. skipping...');

      return;
    }

    const instance = new Class(element);
    instance.init();

    // use this class to animate the element in (e.g.)
    element.classList.add(COMPONENT_LOADED_CLASS);
  });

  return elements;
}

/**
 * Initializes all components found in DOM by the given node array
 * the given class function
 * @param elements - All DOM elements
 * @param Class - class function
 * @return All DOM elements found by the given selector
 */
export function registerSelectedComponent(elements: Element[], Class: ComponentType): Array<Element> {
  if (
    !elements ||
    !Class
  ) {
    console.warn('selector and Class are required.');

    return new Array<Element>();
  }

  elements.forEach(element => {
    // check for an existing instance
    // if an instance is found the element is already instantiated
    // if already instantiated we skip it
    if (getInstance(element, Class.name) !== undefined) {
      __DEBUG__ && console.info('instance for this element found. skipping...');

      return;
    }

    (new Class(element)).init();

    // use this class to animate the element in (e.g.)
    element.classList.add(COMPONENT_LOADED_CLASS);
  });

  return elements;
}

/**
 * Checks if there is an instance for the given element and Class
 * @param element - DOM element
 * @param Class - class identifier
 * @return component instance or undefined if none found
 */
export function getInstance(element: Element, Class: string): Component|undefined {
  if (!element[DEFAULT_SETTINGS.namespace]?.__component?.ref[Class]) {
    return undefined;
  }

  const instance = element[DEFAULT_SETTINGS.namespace].__component.ref[Class];

  return instance;
}

/**
 * Destroys an instance by calling the destroy method for a given element
 * and component function
 * @param element - DOM element
 * @param Class - class identifier
 * @return true if successfully destroyed else false
 */
export function destroyInstance(element: Element, Class: string): boolean {
  let instance = getInstance(element, Class);

  if (instance === undefined) {
    __DEBUG__ && console.error(`no instance ${Class} found for given element`);

    return false;
  }

  instance.destroy();
  instance = undefined;

  delete element[DEFAULT_SETTINGS.namespace].__component.ref[Class];

  element.classList.remove(COMPONENT_LOADED_CLASS);

  return true;
}

/**
 * Reload a component for a given DOM element and component function by
 * calling its reload method.
 * @param element - DOM element
 * @param Class - class identifier
 */
export function reloadInstance(element: Element, Class: string): void {
  const instance = getInstance(element, Class);

  if (instance === undefined) {
    __DEBUG__ && console.error(`no instance ${Class} found for given element`);

    return;
  }

  instance.reload();
}

setup(DEFAULT_SETTINGS);
