<template>
  <div class="flex flex-col gap-3 w-xs mx-auto card shadow bg-base-100 p-4">
    <div
      v-if="errorMessage"
      role="alert"
      class="alert alert-error"
    >
      <span>{{ errorMessage }}</span>
    </div>
    <form
      class="fieldset"
      @submit.prevent="handleSubmit"
    >
      <label class="label">Логин</label>
      <input
        v-model="username"
        class="input"
        placeholder="Введите логин"
      >

      <label class="label">Пароль</label>
      <input
        v-model="password"
        type="password"
        class="input"
        placeholder="Введите пароль"
      >

      <button
        type="submit"
        class="btn mt-4"
        :disabled="loading"
      >
        <template v-if="loading">
          <span class="loading loading-spinner loading-xs" />
        </template>
        <template v-else>
          Логин
        </template>
      </button>
      <p>
        Если у вас нет аккаунта
        <nuxt-link
          to="/login/registration"
          class="link link-primary"
        >
          зарегистрируйтесь
        </nuxt-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { postLogin } from '~/client'

definePageMeta({
  title: 'Логин',
})

const errorMessage = ref<string>('')
const loading = ref<boolean>(false)

const username = ref<string>('')
const password = ref<string>('')

const handleSubmit = async (): Promise<void> => {
  try {
    loading.value = true
    const { token } = await postLogin({
      body: { username: username.value, password: password.value },
    })

    const cookie = useCookie('token')
    cookie.value = token
    await navigateTo('/my-tickets')
  }
  catch {
    errorMessage.value
      = 'Неверный логин или пароль. Проверьте введенные данные и попробуйте снова.'
  }
  finally {
    loading.value = false
  }
}
</script>
