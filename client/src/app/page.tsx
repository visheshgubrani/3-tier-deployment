"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Welcome to Todo App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Organize your tasks efficiently with our simple and intuitive todo
            application.
          </p>
          <div className="flex flex-col space-y-2">
            <Link href="/register" passHref>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Register
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Login
              </Button>
            </Link>
            <Link href="/todo" passHref>
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                Go to Todo List
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
export default Page
