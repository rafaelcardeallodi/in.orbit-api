import { describe, it, expect } from 'vitest'
import { makeUser } from '../../tests/factories/make-user'
import { createGoal } from './create-goal'

describe('create goal', () => {
  it('should be able to create a new goal', async () => {
    const user = await makeUser()

    const result = await createGoal({
      title: 'Example goal',
      desiredWeeklyFrequency: 5,
      userId: user.id,
    })

    expect(result).toEqual({
      goal: expect.objectContaining({
        id: expect.any(String),
        title: 'Example goal',
        desiredWeeklyFrequency: 5,
      }),
    })
  })
})
