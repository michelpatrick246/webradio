// prisma/seed.ts
import { Prisma, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPasswordAlice = await bcrypt.hash('password123', 10)
    const hashedPasswordBob = await bcrypt.hash('securepass456', 10)

    const userData: Prisma.UserCreateInput[] = [
        {
            name: 'Alice',
            email: 'alice@example.com',
            password: hashedPasswordAlice,
        },
        {
            name: 'Bob',
            email: 'bob@example.com',
            password: hashedPasswordBob,
        },
    ]

    for (const user of userData) {
        await prisma.user.create({ data: user })
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })