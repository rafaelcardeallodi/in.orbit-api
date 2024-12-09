import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCompletions, goals, users } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const [user] = await db
    .insert(users)
    .values({
      name: 'Rafael Lodi',
      email: null,
      externalAccountId: 65565453,
      avatarUrl: 'https://avatars.githubusercontent.com/u/65565453',
    })
    .returning()

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', userId: user.id, desiredWeeklyFrequency: 5 },
      { title: 'Me exercitar', userId: user.id, desiredWeeklyFrequency: 3 },
      { title: 'Meditar', userId: user.id, desiredWeeklyFrequency: 1 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => client.end())
