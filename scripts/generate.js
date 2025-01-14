// @ts-check
import fs from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  Home: {
    count: 500,
    itemClass: 'bg-gray'
  },
  About: {
    count: 5000,
    itemClass: 'bg-green'
  },
  Hidden: {
    count: 5000,
    itemClass: 'bg-red'
  }
}

/**
 * @param {string} name
 * @param {number} count
 * @param {string} itemClass
 */
function _generateTemplate(name, count, itemClass) {
  const items = new Array(count)
    .fill(0)
    .map((_, i) => `<div class="card-item ${itemClass}">${i}</div>`)
    .join('\n      ')

  return `<!-- auto-generated by scripts/generate.js -->
<template>
  <div class="card">
    <h1>${name} page</h1>

    <div class="card-items">
      ${items}
    </div>
  </div>
</template>
`
}

/**
 * @param {keyof typeof config} name
 */
function generateComponent(name) {
  const { count, itemClass } = config[name]
  const componentPath = resolve(__dirname, `../playground/src/components/generated/${name}.gen.vue`)
  const template = _generateTemplate(name, count, itemClass)
  fs.writeFile(componentPath, template)
}

Promise.all([generateComponent('Home'), generateComponent('About'), generateComponent('Hidden')])
