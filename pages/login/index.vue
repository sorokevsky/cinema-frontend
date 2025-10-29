<template>
  <div class="flex flex-col gap-3 w-xs mx-auto">
    <div v-if="errorMessage" role="alert" class="alert alert-error">
      <span>{{ errorMessage }}</span>
    </div>
    <h1 class="p-3 text-3xl font-medium text-center">Логин</h1>
    <form class="fieldset" @submit.prevent="handleSubmit">
      <label class="label">Логин</label>
      <input v-model="username" class="input" placeholder="Введите логин" />

      <label class="label">Пароль</label>
      <input
        v-model="password"
        type="password"
        class="input"
        placeholder="Введите пароль"
      />

      <button type="submit" class="btn mt-4">Логин</button>
    </form>
    <p>
      Если у вас нет аккаунта
      <nuxt-link to="/login/registration" class="link link-primary">
        зарегистрируйтесь
      </nuxt-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { postLogin } from "~/client";

const errorMessage = ref<string>("");
const loading = ref<boolean>(false);

const username = ref<string>("");
const password = ref<string>("");

const handleSubmit = async () => {
  try {
    loading.value = true;
    const { token } = await postLogin({
      body: { username: username.value, password: password.value },
    });

    const cookie = useCookie("token");
    cookie.value = token;
    await navigateTo("/my-tickets");
  } catch {
    errorMessage.value =
      "Неверный логин или пароль. Проверьте введенные данные и попробуйте снова";
  } finally {
    loading.value = false;
  }
};
</script>
