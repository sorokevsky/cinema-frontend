<template>
  <div class="text-center flex flex-col gap-3 w-xs mx-auto">
    <div v-if="errorMessage" role="alert" class="alert alert-error">
      <span>{{ errorMessage }}</span>
    </div>
    <h1 class="p-3 text-3xl font-medium text-center">Регистрация</h1>
    <form class="fieldset" @submit.prevent="handleSubmit">
      <label class="label">Логин</label>
      <input
        v-model="username"
        class="input validator"
        placeholder="Введите логин"
        type="email"
        required
      />
      <div class="validator-hint">Enter valid email address</div>

      <label class="label">Пароль</label>
      <input
        v-model="password"
        type="password"
        class="input validator"
        placeholder="Введите пароль"
        required
      />
      <div class="validator-hint">Enter valid email address</div>

      <label class="label">Повторите пароль</label>
      <input
        v-model="confirmPassword"
        type="password"
        class="input validator"
        placeholder="Повторите пароль"
        required
      />
      <div class="validator-hint">Enter valid email address</div>

      <button class="btn mt-4">Зарегистрироваться</button>
      <p>
        Если вы уже зарегистрированы
        <nuxt-link to="/login" class="link link-primary">войдите</nuxt-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { postRegister, type PostRegisterError } from "~/client";

const errorMessage = ref<string>("");
const loading = ref<boolean>(false);

const username = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");



const handleSubmit = async () => {
  try {
    loading.value = true;
    const data = await postRegister({
      body: { username: username.value, password: password.value },
    });
    console.log(data);
    await navigateTo("/my-tickets");
  } catch (err: unknown) {
    const error = err as { data: PostRegisterError };
    errorMessage.value =
      error.data.message || error.data.error || "Ошибка авторизации";
  } finally {
    loading.value = false;
  }
};
</script>
