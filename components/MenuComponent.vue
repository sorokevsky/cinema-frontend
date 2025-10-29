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

    <template v-if="token">
      <button class="btn" @click="logout">Выход</button>
    </template>
    <template v-else>
      <NuxtLink
        class="btn"
        :class="{ 'btn-primary': $route.path.startsWith('/login') }"
        to="/login"
      >
        Вход
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
const token = computed(() => useCookie("token").value);

const ROUTES = [
  { name: "/movies", title: "Фильмы" },
  { name: "/cinemas", title: "Кинотеатры" },
  { name: "/my-tickets", title: "Мои билеты" },
] as const;

const logout = () => {
  const cookie = useCookie("token");
  cookie.value = null;
  navigateTo("/movies");
};
</script>
