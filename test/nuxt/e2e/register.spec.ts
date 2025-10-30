import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'

await setup({
  setupTimeout: 30000,
  server: true,
  browser: false,
})

describe('Тест рендера страницы регистрации', () => {
  it('рендерит страницу регистрации', async () => {
    const html = await $fetch('/registration')
    expect(html).toContain('Введите логин')
    expect(html).toContain('Введите пароль')
    expect(html).toContain('Повторите пароль')
    expect(html).toContain('Зарегистрироваться')
  })
})
