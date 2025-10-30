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
        @input="validateField('username')"
      >
      <div
        v-if="fieldErrors.username"
        class="text-error"
      >
        <template
          v-for="(error, index) in fieldErrors.username"
          :key="index"
        >
          {{ `${error.message}\n` }} <br>
        </template>
      </div>

      <label class="label">Пароль</label>
      <input
        v-model="password"
        type="password"
        class="input"
        placeholder="Введите пароль"
        @input="validateField('password')"
      >
      <div
        v-if="fieldErrors.password"
        class="text-error"
      >
        <template
          v-for="(error, index) in fieldErrors.password"
          :key="index"
        >
          {{ `${error.message}` }} <br>
        </template>
      </div>

      <label class="label">Повторите пароль</label>
      <input
        v-model="confirmPassword"
        type="password"
        class="input"
        placeholder="Повторите пароль"
        @blur="validateField('confirmPassword')"
      >
      <div
        v-if="fieldErrors.confirmPassword?.length"
        class="text-error"
      >
        {{ fieldErrors.confirmPassword }} <br>
      </div>

      <button
        class="btn mt-4"
        :disabled="loading"
      >
        <template v-if="loading">
          <span class="loading loading-spinner loading-xs" />
        </template>
        <template v-else>
          Зарегистрироваться
        </template>
      </button>
      <p>
        Если вы уже зарегистрированы
        <nuxt-link
          to="/login"
          class="link link-primary"
        >войдите</nuxt-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import { postRegister, type PostRegisterError } from '~/client'

definePageMeta({
  title: 'Регистрация',
})

const errorMessage = ref<string>('')
const loading = ref<boolean>(false)

const username = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

const fieldErrors = ref<{
  username?: Array<Record<string, unknown>>
  password?: Array<Record<string, unknown>>
  confirmPassword?: Array<Record<string, unknown>> | string
}>({})

const usernameSchema = z
  .string()
  .min(8, 'Логин должен содержать минимум 8 символов')
  .regex(/^[a-zA-Z0-9]+$/, 'Логин должен содержать только латинские буквы и цифры')
const passwordSchema = z
  .string()
  .min(8, 'Пароль должен содержать минимум 8 символов')
  .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
  .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
  .regex(/^[a-zA-Z0-9]+$/, 'Пароль должен содержать только латинские буквы и цифры')

const registrationSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

const validateForm = (): boolean => {
  console.log(fieldErrors.value)
  try {
    registrationSchema.parse({
      username: username.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    })
    fieldErrors.value = {}
    return true
  }
  catch {
    return false
  }
}

const validateField = (fieldName: keyof typeof fieldErrors.value): void => {
  console.log(fieldErrors.value)
  const newErrors = { ...fieldErrors.value }
  newErrors[fieldName] = []
  fieldErrors.value = newErrors

  let isValid = true
  let errorMessage = ''

  try {
    switch (fieldName) {
      case 'username':
        usernameSchema.parse(username.value)
        break
      case 'password':
        passwordSchema.parse(password.value)
        break
      case 'confirmPassword':
        if (password.value !== confirmPassword.value) {
          isValid = false
          errorMessage = 'Пароли не совпадают'
        }
        break
    }
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      isValid = false
      errorMessage = JSON.parse(error.message) || 'Ошибка валидации'
      console.log('errorMessage', errorMessage)
    }
  }

  if (!isValid && errorMessage) {
    fieldErrors.value = {
      ...fieldErrors.value,
      [fieldName]: errorMessage,
    }
  }

  if (fieldName === 'password' && confirmPassword.value) {
    validateField('confirmPassword')
  }
}

const handleSubmit = async (): Promise<void> => {
  errorMessage.value = ''

  if (!validateForm()) {
    errorMessage.value = 'Корректно заполните форму'
    return
  }

  try {
    loading.value = true
    const { token } = await postRegister({
      body: { username: username.value, password: password.value },
    })
    const cookie = useCookie('token')
    cookie.value = token
    await navigateTo('/my-tickets')
  }
  catch (err: unknown) {
    const error = err as { data: PostRegisterError }
    errorMessage.value
      = error.data.message || error.data.error || 'Ошибка регистрации'
  }
  finally {
    loading.value = false
  }
}
</script>
