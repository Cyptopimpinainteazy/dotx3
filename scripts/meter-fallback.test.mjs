import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

// Execute the actual component and its effect with a failing graphics boundary.
// No browser, GPU, provider requests, or wallet is involved in these regressions.
const source = readFileSync(new URL('../src/components/meter-scene.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
}).outputText;

function harness(failure) {
  const hooks = [], effects = [];
  let cursor = 0;
  const stats = { rendererCalls: 0, appended: 0, removed: 0, resources: 0, disposed: 0,
    rendererDisposed: 0, observed: 0, disconnected: 0, listeners: 0 };
  const react = {
    useRef(value) { const index = cursor++; return hooks[index] ??= { current: value }; },
    useState(value) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = value;
      return [hooks[index], next => { hooks[index] = next; }];
    },
    useEffect(effect) {
      const index = cursor++;
      if (!(index in hooks)) { hooks[index] = true; effects.push(effect); }
    },
  };
  const canvas = {
    getContext(kind) {
      assert.equal(kind, 'webgl2');
      if (failure === 'context-throws') throw new Error('Graphics blocked');
      return failure === 'no-context' ? null : {};
    },
    remove() { stats.removed++; },
  };
  class Renderer {
    constructor() {
      stats.rendererCalls++;
      if (failure === 'renderer-throws') throw new Error('Error creating WebGL context');
      this.domElement = canvas;
    }
    setPixelRatio() {}
    setClearColor() {}
    setSize() {}
    render() {}
    dispose() { stats.rendererDisposed++; }
  }
  class Resource {
    constructor() { stats.resources++; }
    dispose() { stats.disposed++; }
  }
  class Observer {
    observe() { stats.observed++; }
    disconnect() { stats.disconnected++; }
  }
  const three = {
    WebGLRenderer: Renderer,
    Scene: class { add() {} },
    PerspectiveCamera: class { position = { set() {} }; updateProjectionMatrix() {} },
    Mesh: class {
      rotation = {}; scale = { setScalar() {} };
      constructor(geometry, material) { this.geometry = geometry; this.material = material; }
    },
    TorusGeometry: Resource, IcosahedronGeometry: Resource, MeshBasicMaterial: Resource,
  };
  const module = { exports: {} };
  const jsx = (type, props) => ({ type, props });
  runInNewContext(compiled, {
    module, exports: module.exports,
    require(name) {
      if (name === 'react') return react;
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name === 'three') return three;
      throw new Error(`Unexpected import: ${name}`);
    },
    window: { matchMedia: () => ({ matches: false }), devicePixelRatio: 1 },
    document: {
      createElement: name => { assert.equal(name, 'canvas'); return canvas; },
      addEventListener() { stats.listeners++; },
      removeEventListener() { stats.listeners--; },
      hidden: false,
    },
    performance: { now: () => 0 },
    ResizeObserver: Observer, IntersectionObserver: Observer,
    requestAnimationFrame: () => 1, cancelAnimationFrame() {},
  });
  const host = { clientWidth: 500, clientHeight: 288, appendChild() { stats.appended++; } };
  return {
    stats,
    render(progress = 0.25) {
      cursor = 0;
      const tree = module.exports.MeterScene({ progress });
      tree.props.ref.current = host;
      return tree;
    },
    mount() { assert.equal(effects.length, 1); return effects[0](); },
  };
}

function textContent(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node !== 'object') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join('');
  return textContent(node.props?.children);
}

for (const failure of ['no-context', 'context-throws', 'renderer-throws']) {
  test(`proof meter keeps a static result when ${failure}`, () => {
    const view = harness(failure);
    view.render();
    assert.doesNotThrow(() => view.mount());
    const tree = view.render();
    assert.equal(tree.props['data-webgl'], 'unavailable');
    assert.match(tree.props['aria-label'], /25%/);
    assert.match(textContent(tree), /25%/);
    assert.match(textContent(tree), /Static proof meter/);
    assert.equal(view.stats.rendererCalls, failure === 'renderer-throws' ? 1 : 0);
    assert.equal(view.stats.appended, 0);
    assert.equal(view.stats.resources, 0);
    assert.equal(view.stats.observed, 0);
    assert.equal(view.stats.listeners, 0);
    assert.match(textContent(view.render(0.5)), /50%/, 'fallback follows updated milestone data');
  });
}

test('working proof meter still releases its canvas, observers and resources', () => {
  const view = harness('none');
  view.render();
  const cleanup = view.mount();
  assert.equal(typeof cleanup, 'function');
  assert.equal(view.stats.appended, 1);
  assert.equal(view.stats.observed, 2);
  assert.equal(view.stats.listeners, 1);
  cleanup();
  assert.equal(view.stats.rendererDisposed, 1);
  assert.equal(view.stats.removed, 1);
  assert.equal(view.stats.disconnected, 2);
  assert.equal(view.stats.listeners, 0);
  assert.equal(view.stats.disposed, view.stats.resources);
});
