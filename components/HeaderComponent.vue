<template>
  <div class="card shadow bg-base-100 p-3 flex flex-row items-center">
    <button
      v-if="showBackButton"
      class="btn w-fit"
      @click="goBack"
    >
      Назад
    </button>
    <div
      class="text-center text-3xl font-medium"
      :class="showBackButton ? 'flex-1' : 'w-full'"
    >
      <template v-if="title">
        {{ title }}
      </template>
      <template v-else>
        <span class="loading loading-spinner" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const title = computed(() => route.meta.title as string)

const showBackButton = computed(() => {
  const pathParts = route.path.split('/').filter(part => part !== '')

  return pathParts.length > 1
})

const goBack = () => {
  const currentPath = route.path
  const pathParts = currentPath.split('/').filter(part => part !== '')

  if (window.history.length > 1) {
    router.back()
  }
  else if (pathParts.length > 1) {
    const parentPath = '/' + pathParts.slice(0, -1).join('/')
    router.push(parentPath)
  }
}
</script>
