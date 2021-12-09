
import TestComponent, {selector} from './components/test-component';
import {
  ComponentSystemConfiguration,
  destroyInstance,
  getInstance,
  registerComponent,
  setup,
  DEFAULT_SETTINGS
} from '../index';
import {expect} from 'chai';


describe('Component', () => {
  before(done => {
    const element = document.createElement('div');
    element.classList.add('test-component');
    element.setAttribute('taiko-component', 'test-component');

    document.body.appendChild(element);

    done();
  });

  afterEach(done => {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => destroyInstance(element, 'TestComponent'));

    done();
  });

  describe('global', () => {
    it('should create the global taiko namespace', done => {
      expect(window[DEFAULT_SETTINGS.namespace].__component).to.not.be.undefined;

      done();
    });

    it('should create the taiko namespace for class references', done => {
      expect(window[DEFAULT_SETTINGS.namespace].__component.classes).to.not.be.undefined;

      done();
    });
  });

  describe('#registerComponent()', () => {
    it('should return an Array containing all affected elements', done => {
      const elements = registerComponent(selector, TestComponent);

      expect(elements instanceof Array).to.be.true;
      expect(elements.length === 1).to.be.true;

      done();
    });

    it('should register the component(s)', done => {
      const elements = registerComponent(selector, TestComponent);

      elements.forEach(element => {
        expect(element[DEFAULT_SETTINGS.namespace].__component).to.not.be.undefined;
        expect(element[DEFAULT_SETTINGS.namespace].__component.ref).to.not.be.undefined;
        expect(element[DEFAULT_SETTINGS.namespace].__component.ref[TestComponent.name] instanceof TestComponent).to.be.true;
      });

      done();
    });

    it('should add a component-loaded class to the element after the instance has been created', done => {
      const elements = registerComponent(selector, TestComponent);

      elements.forEach(element => {
        expect(element.classList.contains('component-loaded')).to.be.true;
      });

      done();
    });
  });

  describe('#destroyInstance()', () => {
    it('should return false if element has no instace of the given Class', done => {
      const element = document.querySelector(selector) as Element;
      const result = destroyInstance(element, 'TestComponent');

      expect(result).to.be.false;

      done();
    });

    it('should destroy the component and remove its instance reference', done => {
      const elements = registerComponent(selector, TestComponent);

      elements.forEach(element => {
        destroyInstance(element, 'TestComponent');
        expect(element[DEFAULT_SETTINGS.namespace].__component.ref['TestComponent']).to.be.undefined;
      });

      done();
    });

    it('should remove the component-loaded class after the instance has been destroyed', done => {
      const elements = registerComponent(selector, TestComponent);

      elements.forEach(element => {
        elements.forEach(element => destroyInstance(element, 'TestComponent'));
        expect(element.classList.contains('component-loaded')).to.be.false;
      });

      done();
    });
  });

  describe('#getInstance()', () => {
    beforeEach(done => {
      registerComponent(selector, TestComponent);

      done();
    });

    it('should return undefined if instance for given name and element is not found', done => {
      const elements = document.querySelectorAll(selector);

      elements.forEach(element => {
        expect(getInstance(element, 'FOO')).to.be.undefined;
      });

      done();
    });

    it('should return undefined if instance for given name and element is not found', done => {
      const elements = document.querySelectorAll(selector);

      elements.forEach(element => {
        expect(getInstance(element, 'FOO')).to.be.undefined;
      });

      done();
    });

    it('should return the instance for a given name if the instance for that name is available', done => {
      const elements = document.querySelectorAll(selector);

      elements.forEach(element => {
        expect(getInstance(element, 'TestComponent')).to.not.be.undefined;
      });

      done();
    });
  });

  describe('#reloadInstance()', () => {
    it('should return no instance if given there is no instance for the given Class name', done => {
      const elements = document.querySelectorAll(selector);

      elements.forEach(element => {
        const instance = getInstance(element, 'TestComponent');

        expect(instance).to.be.undefined;
      });

      done();
    });

    it('should initialize the configuration when calling setup', done => {
      const overrideConfig: ComponentSystemConfiguration = {
        namespace: '__SampleNamespace'
      }

      setup(overrideConfig);

      expect(window[overrideConfig.namespace]).not.to.be.undefined;
      expect(overrideConfig.namespace in window).to.be.true;

      done();
    });
  });
});
