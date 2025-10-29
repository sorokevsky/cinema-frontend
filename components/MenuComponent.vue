<template>
  <div class="card shadow p-4 flex-col gap-2 bg-base-100">
    <template v-for="(route, index) in ROUTES" :key="index">
      <NuxtLink
        class="btn"
        :class="{ 'btn-primary': $route.path.startsWith(route.name) }"
        :to="route.name"
      >
        {{ route.title }}
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const ROUTES = [
  { name: "/movies", title: "Фильмы" },
  { name: "/cinemas", title: "Кинотеатры" },
  { name: "/my-tickets", title: "Мои билеты" },
  { name: "/login", title: "Вход" },
] as const;
</script>
