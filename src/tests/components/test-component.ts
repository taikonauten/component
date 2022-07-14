/* eslint-disable no-console */
import {Component} from '../../index';

export const selector = '[taiko-component="test-component"]';

class TestComponent extends Component {

  constructor(el: Element) {
    super(el);

    this.init();
  }

  init(): void {
    console.log('component: init()');
  }

  reload(): void {
    console.log('component: reload()');

    this.destroy();
    this.init();
  }

  destroy(): void {
    console.log('component: destroy()');
  }
}

export default TestComponent;
