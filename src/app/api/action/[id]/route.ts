import client from '@/client'
import actions, { actionSchema } from '@/models/actions'
import { IResponse } from '@/types/services'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { Action } from '@/models/actions'

type ParamsId = {
  params: Promise<{ id: string }>
}

// ✅ GET by ID
export async function GET(
  req: NextRequest,
  { params }: ParamsId
): Promise<NextResponse<IResponse<Action>>> {
  try {
    await client.connect()

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const action = await actions.findOne({ _id: new ObjectId(id) })
    if (!action) {
      return NextResponse.json(
        { success: false, message: 'Action not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Action retrieved successfully',
      data: action
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// ✅ PUT (update)
export async function PUT(
  req: NextRequest,
  { params }: ParamsId
): Promise<NextResponse<IResponse<Action>>> {
  try {
    await client.connect()

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const body = await req.json()
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

    const result = await actions.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { title, description, codex, value } },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Action not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Action updated successfully',
      data: result
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}

// ✅ DELETE
export async function DELETE(
  req: NextRequest,
  { params }: ParamsId
): Promise<NextResponse<IResponse<null>>> {
  try {
    await client.connect()

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const result = await actions.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Action not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Action deleted successfully',
      data: null
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
