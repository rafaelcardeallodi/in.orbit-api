import { describe, it, expect } from 'vitest'
import { db } from '../db'
import { users } from '../db/schema'
import { getUser } from './get-user'

describe('get user', () => {
  it('should be able to get a user', async () => {
    await db.insert(users).values({
      id: 'john-doe',
      avatarUrl: 'https://github.com.br/rafaelcardeallodi.png',
      externalAccountId: 2923829,
    })

    const result = await getUser({ userId: 'john-doe' })

    expect(result).toEqual({
      user: {
        id: 'john-doe',
        name: null,
        email: null,
        avatarUrl: 'https://github.com.br/rafaelcardeallodi.png',
      },
    })
  })
})
