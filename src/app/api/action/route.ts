import client from '@/client'
import actions, { actionSchema } from '@/models/actions'
import { IResponse } from '@/types/services'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { Action } from '@/models/actions'

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<Action>>> {
  try {
    await client.connect()

    const body = await req.json()

    // ✅ Validate input using Zod
    const { success, error, data } = actionSchema.safeParse(body)
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid input',
          errors: error.flatten().fieldErrors
        },
        { status: 400 }
      )
    }

    const { title, description, codex, value } = data

    // ✅ Check for uniqueness
    const exists = await actions.findOne({ $or: [{ title }] })
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title already exists'
        },
        { status: 409 }
      )
    }

    // ✅ Insert to DB
    const result = await actions.insertOne({ title, description, codex, value })
    if (!result.insertedId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create action'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Action created successfully',
        data: {
          _id: result.insertedId as ObjectId,
          title,
          codex,
          value,
          description
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        success: false,
        message: 'Server error'
      },
      { status: 500 }
    )
  }
}
