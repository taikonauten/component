import {Component} from '../../index';

export const selector = '[taiko-component="test-component"]';

class TestComponent extends Component {

  constructor(el: Element) {

    super(el);

    this.init();
  }

  init() {

    console.log('component: init()');
  }

  reload() {

    console.log('component: reload()');

    this.destroy();
    this.init();
  }

  destroy() {

    console.log('component: destroy()');
  }
}

export default TestComponent;
