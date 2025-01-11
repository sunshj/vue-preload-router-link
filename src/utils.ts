import { useRouter, type RouteLocationRaw, type Router } from 'vue-router'

export async function preloadRouteComponents(
  to: RouteLocationRaw,
  router: Router & {
    _routePreloaded?: Set<string>
    _preloadPromises?: Array<Promise<unknown>>
  } = useRouter()
): Promise<void | undefined> {
  const { path, matched } = router.resolve(to)
  if (!matched.length) return

  router._routePreloaded ??= new Set()
  if (router._routePreloaded.has(path)) return

  const promises = (router._preloadPromises = router._preloadPromises || [])

  if (promises.length > 4) {
    return Promise.all(promises).then(() => preloadRouteComponents(to, router))
  }

  const components = matched
    .map(m => m.components?.default)
    .filter(component => typeof component === 'function')

  for (const component of components) {
    const promise = Promise.resolve((component as () => unknown)())
      .catch(() => {})
      .finally(() => promises.splice(promises.indexOf(promise)))
    promises.push(promise)
  }

  await Promise.all(promises)
}

export function useObserver() {
  let observer: IntersectionObserver | null = null
  const callbacks = new Map<Element, () => void>()

  return function observe(el: Element, callback: () => void) {
    if (!observer) {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const callback = callbacks.get(entry.target)
          const isVisible = entry.isIntersecting || entry.intersectionRatio > 0
          if (callback && isVisible) callback()
        }
      })
    }

    callbacks.set(el, callback)
    observer.observe(el)

    return () => {
      callbacks.delete(el)
      observer?.unobserve(el)
      if (callbacks.size === 0) {
        observer?.disconnect()
        observer = null
      }
    }
  }
}
