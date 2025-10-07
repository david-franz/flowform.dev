# FlowForm

`@flowtomic/flowform` hosts the evolving Form Builder & Renderer toolkit that will power Flowtomic’s next-generation node configuration experiences. The repository mirrors the project layout of `flowgraph`, separating the framework-agnostic core from React bindings and the public playground/documentation site.

## Packages

- **`@flowtomic/flowform`** – core schema + renderer abstractions for highly customisable forms.
- **`@flowtomic/flowform-react`** – React bindings that wrap the core runtime (see `packages/react`).
- **`flowform-website`** – playground + documentation site built with Vite/React (see `packages/website`).

## Getting Started

```bash
# library core
cd flowform
npm install
npm run build

# React bindings
cd packages/react
npm install
npm run build

# Website / playground
cd packages/website
npm install
npm run dev
```

During early development the workspace stays framework-agnostic. React-specific code lives inside `packages/react` and the website in `packages/website`. Both resolve the local core package via relative workspace aliasing, enabling rapid iteration between the library and the docs/playground without publishing packages.

## Roadmap

- [ ] Primitive field definitions and renderer contracts.
- [ ] Schema-driven layout (sections/columns/conditionals).
- [ ] Renderer registry + theming pipeline for web/native.
- [ ] Flowgraph interoperability for node editor UIs.
- [ ] Documentation, story-driven examples, and playground controls mirroring Flowtomic’s production configuration options.
