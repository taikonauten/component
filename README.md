
<p align="center">
  <img src="https://i.imgur.com/dV1aZjJ.png" title="Taikonauten">
</p>

<h1 align="center">Taikonauten component</h1>

Lightweight JavaScript and TypeScript component library to handle component lifecycle.

## Installation

```shell
npm install --save @taikonauten/component
```

## Setup

### Webpack

To enable or disable debugging messages the library depends on a global variable `__DEBUG__`.
For a Webpack environment use:

```js
new webpack.DefinePlugin({
  __DEBUG__: true
})
```

## Usage

### Configure namespace

You can override the default namespace (`__Taikonauten`) by using the setup function:

```js
import {setup} from '@taikonauten/component';

const configuration = {
  namespace: '__MyCustomNamespace'
};

setup(configuration);
```

### Create a component

```js
import {Component} from '@taikonauten/component';

class YourComponent extends Component {
  constructor(el: Element) {
    super(el);
  }

  /**
   * Initialize the component
   * Init is automatically called by registerComponent
   */
  init() {
    // your custom implementation to initialize the component...
  }

  /**
   * Destroy the component
   */
  destroy() {
    // your custom implementation to destroy the component...
    // Remove event handlers, free memory...
  }

  /**
   * Reload the component
   * This method only needs to be implemented if you need to change
   * the default logic which calls destroy and then init
   */
  reload() {
    // your custom implementation to reload the component...
  }
}
```

### Register a component

For simplicity you can only pass a single selector.

```js
import {registerComponent} from '@taikonauten/component';
import YourComponent from './components/your-component';

registerComponent('[data-your-component]', YourComponent);
```

`registerComponent` returns a NodeList including all affected elements.

### Get instance of a registered component

```js
import {getInstance} from '@taikonauten/component';

const element = document.querySelector('[my-component-element]');
const instance = getInstance(element, 'YourComponent');

// access components public members and methods
```

### Reload instance of a registered component

```js
import {reloadInstance} from '@taikonauten/component';

const element = document.querySelector('[my-component-element]');
reloadInstance(element, 'YourComponent');
```

### Destroy instance of a registered component

```js
import {destroyInstance} from '@taikonauten/component';

const element = document.querySelector('[my-component-element]');
destroyInstance(element, 'YourComponent');
```

## TypeScript

### Types

Create a `@types` folder in your src folder and add the following files:

#### environment.d.ts

```js
/** enables debug if true */
declare const __DEBUG__: boolean;
```

#### namespace.d.ts

```js
export declare global {
  interface Window {
    [index: string]: {
      component?: ComponentLib,
      __component: {
        classes: CachedClasses,
      },
    };
  }
  interface Element {
    [index: string]: {
      __component: {
        ref: CachedRefs,
      },
    };
  }
}
```

## Tests

### Run tests

```shell
npm run test
```
