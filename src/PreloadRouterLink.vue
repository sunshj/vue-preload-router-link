<template>
  <RouterLink v-bind="linkProps">
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  watchEffect,
  type AllowedComponentProps,
  type AnchorHTMLAttributes,
  type VNodeProps
} from 'vue'
import { useRouter, type RouteLocationRaw, type RouterLinkProps } from 'vue-router'
import { preloadRouteComponents, useObserver } from './utils'

export interface PreloadRouterLinkProps extends Omit<RouterLinkProps, 'to'> {
  to: RouteLocationRaw
  prefetch?: boolean
  prefetchOn?: 'visibility' | 'interaction'
  prefetchedClass?: string
}

type AllowedPreloadRouterLinkProps = RouterLinkProps &
  VNodeProps &
  AllowedComponentProps &
  AnchorHTMLAttributes

const props = defineProps<PreloadRouterLinkProps>()

const router = useRouter()

const prefetched = ref(false)
const el = ref<HTMLAnchorElement | null>(null)

const linkProps = ref<AllowedPreloadRouterLinkProps>({
  ...props,
  ref(ref: any) {
    el.value = ref?.$el
  }
})

function shouldPrefetch(mode: PreloadRouterLinkProps['prefetchOn']) {
  return !prefetched.value && props.prefetch === true && props.prefetchOn === mode
}

async function handlePrefetch() {
  if (prefetched.value) return
  prefetched.value = true
  await preloadRouteComponents(props.to, router).catch(() => {})
}

watch(prefetched, newVal => {
  if (newVal) {
    linkProps.value.class = props.prefetchedClass
  }
})

watchEffect(onCleanup => {
  if (!shouldPrefetch('visibility')) return

  let idleId: number
  let unobserve: (() => void) | null = null

  onCleanup(() => {
    if (idleId) cancelIdleCallback(idleId)
    unobserve?.()
  })

  const observe = useObserver()
  idleId = requestIdleCallback(() => {
    if (el.value?.tagName) {
      unobserve = observe(el.value, async () => {
        unobserve?.()
        await handlePrefetch()
      })
    }
  })
})

watchEffect(onCleanup => {
  if (!shouldPrefetch('interaction')) return

  onCleanup(() => {
    if (linkProps.value.onPointerenter) delete linkProps.value.onPointerenter
    if (linkProps.value.onFocus) delete linkProps.value.onFocus
  })

  linkProps.value.onPointerenter = handlePrefetch.bind(null)
  linkProps.value.onFocus = handlePrefetch.bind(null)
})
</script>
