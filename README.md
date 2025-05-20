# 🧩 @octavianlab/olab-ui

> A modern and flexible Vue 3 Back Offices UI components library by [Octavian Lab](https://www.octavianlab.com)

![npm version](https://img.shields.io/npm/v/@octavianlab/olab-ui.svg)
![license](https://img.shields.io/npm/l/@octavianlab/olab-ui.svg)
![downloads](https://img.shields.io/npm/dw/@octavianlab/olab-ui.svg)

---

## 🚀 Overview

**olab-ui** is a work-in-progress collection of Vue 3 components designed to accelerate development and unify UI/UX across projects.  
It's built with accessibility, customization, and performance in mind.

> ⚠️ Still in active development — use with caution in production.

---

## 📦 Installation

```bash
npm install @octavianlab/olab-ui
```

Peer dependencies you might need to install:

```bash
npm install vue primevue moment qrcode-vue3 vue3-lottie xlsx
```

---

## ⚙️ Usage

### Globally (recommended)

```ts
// main.js or main.ts
import { createApp } from 'vue';
import App from './App.vue';

import OlabUI from '@octavianlab/olab-ui';
import '@octavianlab/olab-ui/style.css';

const app = createApp(App);
app.use(OlabUI);
app.mount('#app');
```

### Locally

```vue
<script setup>
import { ODropdown, OFiltersPanel } from '@octavianlab/olab-ui';
</script>

<template>
  <ODropdown :options="['A', 'B']" />
</template>
```

---

## 🧱 Components Included

Here are some of the available components (more coming soon):

- `ODropdown`
- `OFiltersPanel`
- `ODialogStoredSearches`
- `OFilter`
- `OCalendar`
- `OTable`
- `ODialog`
- `OChart`
- `OList`
- `OLottie`

_...and many more!_

For a full list of components, see the [`src/components/`](https://github.com/octavian-lab/olab-ui/tree/master/src/components) folder.

---

## 🛠 Development

Clone the repo and run locally:

```bash
npm install
npm run dev
```

To build and generate types:

```bash
npm run generate:dts && npm run build
```

---

## 🤝 Contributing

We welcome contributions!  
Please open issues or submit PRs on the [GitHub repository](https://github.com/octavian-lab/olab-ui).

---

## 📄 License

MIT © [Octavian Lab](https://www.octavianlab.com)

---

## ✨ Maintainers

- [Emanuele Nocentelli](https://www.octavianlab.com) – Octavianlab CEO & Lead Architect
- [Davidz99](https://github.com/Daveedz99) - Frontend Team Leader
- Octavian Lab UI/UX & Frontend Team
