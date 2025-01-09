# vue-preload-router-link

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

vue-router RouterLink with preload.

## Install

```bash
npm install vue-preload-router-link
```

## Usage

use `PreloadRouterLink` instead of `RouterLink`

```vue
<template>
  <PreloadRouterLink to="/dashboard" prefetch>Dashboard</PreloadRouterLink>
</template>

<script setup>
import PreloadRouterLink from 'vue-preload-router-link'
</script>
```

use `preloadRouteComponents` to manual preload page

```vue
<template>
  <RouterLink to="/dashboard">Dashboard</RouterLink>
  <button @click="preloadDashboard">preload dashboard page</button>
</template>

<script setup>
import { preloadRouteComponents } from 'vue-preload-router-link'
import { useRouter } from 'vue-router'

// preload dashboard page in top level
preloadRouteComponents('/dashboard')

// preload dashboard page in function
const router = useRouter()
function preloadDashboard() {
  preloadRouteComponents('/dashboard', router)
}
</script>
```

## Props

see [PreloadRouterLinkProps](https://www.jsdocs.io/package/vue-preload-router-link#PreloadRouterLinkProps)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/vue-preload-router-link?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/vue-preload-router-link
[npm-downloads-src]: https://img.shields.io/npm/dm/vue-preload-router-link?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/vue-preload-router-link
[bundle-src]: https://img.shields.io/bundlephobia/minzip/vue-preload-router-link?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=vue-preload-router-link
[license-src]: https://img.shields.io/github/license/sunshj/vue-preload-router-link.svg?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/vue-preload-router-link
