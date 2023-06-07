import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // create user
  // const user = await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@prisma.io',
  //   },
  // })
  // console.log(user)

  // see all user
  const users = await prisma.user.findMany()
  console.log("main_1.1")
  console.log(users)

  // create and post
  // const user = await prisma.user.create({
  //   data: {
  //     name: 'Bob',
  //     email: 'bob@prisma.io',
  //     posts: {
  //       create: {
  //         title: 'Hello World',
  //       },
  //     },
  //   },
  // })
  // console.log(user)

  const usersWithPosts = await prisma.user.findMany({
    include: {
      posts: true,
    },
  })
  console.log("main_1.2")
  console.dir(usersWithPosts, { depth: null })
}

async function main_2() {
  const find_ID = await prisma.user.findUnique({
    where : {
      id: 1
    }
  })
  console.log("main_2.1")
  console.log(find_ID)

  const find_email = await prisma.user.findUnique({
    where: {
      email: 'Pete@prisma.io',
    },
  })
  console.log("main_2.2")
  console.log(find_email)
}

async function main_3(){
  const user = await prisma.user.findUnique({
    where : {
      email : "Pete@prisma.io"
    },
    select: {
      name : true
    }
  })
  console.log("main_3")
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
main_2()
main_3()