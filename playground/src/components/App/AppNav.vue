<template>
  <div>
    <form class="preload-config-form config-card">
      <div>
        <label for="enable-prefetch">prefetch: </label>
        <select id="enable-prefetch" v-model="prefetchConfig.prefetch">
          <option :value="true">ON</option>
          <option :value="false">OFF</option>
        </select>
      </div>

      <div>
        <label for="prefetch-on">prefetchOn: </label>
        <select id="prefetch-on" v-model="prefetchConfig.prefetchOn">
          <option value="interaction">interaction</option>
          <option value="visibility">visibility</option>
        </select>
      </div>
    </form>
    <nav class="config-card">
      <PreloadRouterLink
        to="/"
        :prefetch="prefetchConfig.prefetch"
        :prefetch-on="prefetchConfig.prefetchOn"
        prefetched-class="prefetched"
      >
        Home
      </PreloadRouterLink>
      <PreloadRouterLink
        to="/about"
        :prefetch="prefetchConfig.prefetch"
        :prefetch-on="prefetchConfig.prefetchOn"
        prefetched-class="prefetched"
      >
        About
      </PreloadRouterLink>

      <RouterLink to="/hidden"> Hidden </RouterLink>
    </nav>

    <button @click="preloadRouteComponents('/hidden', $router)">preload Hidden page</button>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watchPostEffect } from 'vue'
import PreloadRouterLink, {
  preloadRouteComponents,
  type PreloadRouterLinkProps
} from 'vue-preload-router-link'

const prefetchConfig = ref<Partial<PreloadRouterLinkProps>>({
  prefetch: false,
  prefetchOn: 'interaction'
})

watchPostEffect(() => {
  localStorage.setItem('prefetch-config', JSON.stringify(prefetchConfig.value))
})

onBeforeMount(() => {
  const storage = localStorage.getItem('prefetch-config')
  if (storage) {
    prefetchConfig.value = JSON.parse(storage)
  }
})
</script>

<style scoped>
.config-card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
}

.preload-config-form {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
}

nav {
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-top: 10px;
}

.prefetched {
  color: cyan;
}

.prefetched::after {
  content: ' (prefetched)';
  color: black;
}
</style>
