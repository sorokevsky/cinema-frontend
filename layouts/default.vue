<template>
  <div class="flex min-h-screen p-6 gap-6">
    <div class="w-64">
      <menu-component class="sticky top-6" />
    </div>
    <div class="flex-1 flex flex-col overflow-hidden card shadow bg-base-100 p-4">
        <nuxt-page />
    </div>
  </div>
</template>
