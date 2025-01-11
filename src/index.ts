import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  resolveComponent,
  unref,
  watch,
  type AllowedComponentProps,
  type AnchorHTMLAttributes,
  type PropType,
  type VNodeProps
} from 'vue'
import { useRouter, type RouteLocationRaw, type RouterLinkProps } from 'vue-router'
import { preloadRouteComponents, useObserver } from './utils'

export { preloadRouteComponents } from './utils'

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

export default defineComponent({
  name: 'PreloadRouterLink',
  props: {
    to: {
      type: [String, Object] as PropType<RouteLocationRaw>,
      required: true
    },
    prefetch: {
      type: Boolean,
      default: true,
      required: false
    },
    prefetchOn: {
      type: String as PropType<PreloadRouterLinkProps['prefetchOn']>,
      default: 'visibility',
      required: false
    },
    prefetchedClass: {
      type: String,
      default: '',
      required: false
    }
  },
  setup(props: PreloadRouterLinkProps, { slots }) {
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

    async function prefetch() {
      if (prefetched.value) return
      prefetched.value = true
      await preloadRouteComponents(props.to, router).catch(() => {})
    }

    watch(prefetched, newVal => {
      if (newVal) {
        linkProps.value.class = props.prefetchedClass
      }
    })

    if (shouldPrefetch('visibility')) {
      let idleId: number
      let unobserve: (() => void) | null = null

      onMounted(() => {
        const observe = useObserver()
        idleId = requestIdleCallback(() => {
          if (el.value?.tagName) {
            unobserve = observe(el.value!, async () => {
              unobserve?.()
              unobserve = null
              await prefetch()
            })
          }
        })
      })

      onBeforeUnmount(() => {
        if (idleId) cancelIdleCallback(idleId)
        unobserve?.()
        unobserve = null
      })
    }

    if (shouldPrefetch('interaction')) {
      linkProps.value.onPointerenter = prefetch.bind(null)
      linkProps.value.onFocus = prefetch.bind(null)
    }

    return () => h(resolveComponent('RouterLink'), unref(linkProps), slots.default)
  }
})
