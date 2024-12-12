import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'

import { getWeekSummary } from './get-week-summary'
import { makeGoal } from '../../tests/factories/make-goal'
import { makeUser } from '../../tests/factories/make-user'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'

describe('get week summary', () => {
  it('should be able to get week summary', async () => {
    const user = await makeUser()

    const weekStartsAt = dayjs(new Date(2024, 11, 1))
      .startOf('week')
      .toDate()

    const goal1 = await makeGoal({
      userId: user.id,
      title: 'Meditar',
      desiredWeeklyFrequency: 2,
      createdAt: weekStartsAt,
    })

    const goal2 = await makeGoal({
      userId: user.id,
      title: 'Nadar',
      desiredWeeklyFrequency: 1,
      createdAt: weekStartsAt,
    })

    const goal3 = await makeGoal({
      userId: user.id,
      title: 'Ler',
      desiredWeeklyFrequency: 3,
      createdAt: weekStartsAt,
    })

    const yesterday = dayjs(weekStartsAt).add(1, 'day')
    const twoDaysAgo = dayjs(weekStartsAt).add(2, 'days')
    const fourDaysAgo = dayjs(weekStartsAt).add(4, 'days')

    await makeGoalCompletion({
      goalId: goal1.id,
      createdAt: twoDaysAgo.toDate(),
    })

    await makeGoalCompletion({
      goalId: goal2.id,
      createdAt: yesterday.toDate(),
    })

    await makeGoalCompletion({
      goalId: goal3.id,
      createdAt: yesterday.toDate(),
    })

    await makeGoalCompletion({
      goalId: goal3.id,
      createdAt: fourDaysAgo.toDate(),
    })

    const result = await getWeekSummary({
      userId: user.id,
      weekStartsAt,
    })

    expect(result).toEqual({
      summary: {
        completed: 4,
        total: 6,
        goalsPerDay: {
          [twoDaysAgo.format('YYYY-MM-DD')]: expect.arrayContaining([
            expect.objectContaining({ title: 'Meditar' }),
          ]),
          [yesterday.format('YYYY-MM-DD')]: expect.arrayContaining([
            expect.objectContaining({ title: 'Nadar' }),
            expect.objectContaining({ title: 'Ler' }),
          ]),
          [fourDaysAgo.format('YYYY-MM-DD')]: expect.arrayContaining([
            expect.objectContaining({ title: 'Ler' }),
          ]),
        },
      },
    })
  })
})
