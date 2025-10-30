// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

vi.mock('~/client', () => ({
  postRegister: vi.fn(),
}))

vi.mock('#app', () => ({
  useCookie: vi.fn(() => ({
    value: null,
  })),
  navigateTo: vi.fn(),
  definePageMeta: vi.fn(),
}))

describe('RegisterForm', () => {
  let wrapper
  let postRegister

  beforeEach(async () => {
    const RegisterForm = await import('../../pages/registration.vue')
    wrapper = await mountSuspended(RegisterForm.default)
    postRegister = (await import('~/client')).postRegister
  })

  describe('Тест валидации формы страницы регистрации', () => {
    it('валидирует логин - минимальная длина', async () => {
      const usernameInput = wrapper.find('input[placeholder="Введите логин"]')
      await usernameInput.setValue('short')
      await usernameInput.trigger('input')
      expect(wrapper.text()).toContain('Логин должен содержать минимум 8 символов')
    })

    it('валидирует логин - только латинские буквы и цифры', async () => {
      const usernameInput = wrapper.find('input[placeholder="Введите логин"]')
      await usernameInput.setValue('username!')
      await usernameInput.trigger('input')
      expect(wrapper.text()).toContain('Логин должен содержать только латинские буквы и цифры')
    })

    it('валидирует пароль - минимальная длина', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      await passwordInput.setValue('short')
      await passwordInput.trigger('input')
      expect(wrapper.text()).toContain('Пароль должен содержать минимум 8 символов')
    })

    it('валидирует пароль - заглавные буквы', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      await passwordInput.setValue('lowercase123')
      await passwordInput.trigger('input')
      expect(wrapper.text()).toContain('Пароль должен содержать хотя бы одну заглавную букву')
    })

    it('валидирует пароль - цифры', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      await passwordInput.setValue('NoNumbers')
      await passwordInput.trigger('input')
      expect(wrapper.text()).toContain('Пароль должен содержать хотя бы одну цифру')
    })

    it('валидирует подтверждение пароля', async () => {
      const passwordInput = wrapper.find('input[type="password"]')
      const confirmInput = wrapper.find('input[placeholder="Повторите пароль"]')
      await passwordInput.setValue('ValidPass123')
      await confirmInput.setValue('Different123')
      await confirmInput.trigger('blur')
      expect(wrapper.text()).toContain('Пароли не совпадают')
    })

    it('проходит валидацию при корректных данных', async () => {
      const usernameInput = wrapper.find('input[placeholder="Введите логин"]')
      const passwordInput = wrapper.find('input[type="password"]')
      const confirmInput = wrapper.find('input[placeholder="Повторите пароль"]')
      await usernameInput.setValue('validuUser123')
      await passwordInput.setValue('validPass123')
      await confirmInput.setValue('validPass123')
      await confirmInput.trigger('blur')
      const errorElements = wrapper.findAll('.text-error')
      const hasErrors = errorElements.some(el => el.text().length > 0)
      expect(hasErrors).toBe(false)
    })
  })

  describe('Тест отправки формы страницы регистрации', () => {
    it('блокирует кнопку при загрузке', async () => {
      wrapper.vm.loading = true
      await wrapper.vm.$nextTick()
      const button = wrapper.find('button')
      expect(button.attributes('disabled')).toBeDefined()
      expect(button.html()).toContain('loading-spinner')
    })

    it('показывает ошибку при неудачной валидации', async () => {
      wrapper.vm.username = 'testUN'
      wrapper.vm.password = 'testPass'
      wrapper.vm.confirmPassword = 'testPas'
      await wrapper.vm.$nextTick()
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      expect(wrapper.text()).toContain('Корректно заполните форму')
    })

    it('успешно отправляет форму при валидных данных', async () => {
      postRegister.mockResolvedValueOnce({ token: 'test-token' })
      const { useCookie } = await import('#app')
      vi.mocked(useCookie).mockReturnValue({ value: null })
      wrapper.vm.username = 'validuser123'
      wrapper.vm.password = 'ValidPass123'
      wrapper.vm.confirmPassword = 'ValidPass123'
      await wrapper.vm.$nextTick()
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()
      expect(postRegister).toHaveBeenCalledWith({
        body: {
          username: 'validuser123',
          password: 'ValidPass123',
        },
      })
    })

    it('обрабатывает ошибки API', async () => {
      const apiError = {
        data: {
          message: 'Пользователь существует',
        },
      }
      postRegister.mockRejectedValueOnce(apiError)
      wrapper.vm.username = 'validuser123'
      wrapper.vm.password = 'ValidPass123'
      wrapper.vm.confirmPassword = 'ValidPass123'
      await wrapper.vm.$nextTick()
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Пользователь существует')
    })
  })
})
