// app/api/cards/[id]/route.ts
import client from '@/client'
import cards from '@/models/cards'
import { IResponse } from '@/types/services'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

import { cardSchema } from '@/models/schema/cardSchema'
import { Card, CardType } from '@/types/card'

type ParamsId = {
  params: Promise<{ id: string }>
}

// ✅ GET by ID
export async function GET(
  req: NextRequest,
  { params }: ParamsId
): Promise<NextResponse<IResponse<Card>>> {
  try {
    await client.connect()

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      )
    }

    const card = await cards.findOne({ _id: new ObjectId(id) })
    if (!card) {
      return NextResponse.json(
        { success: false, message: 'Card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Card retrieved successfully',
      data: card
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
): Promise<NextResponse<IResponse<Card>>> {
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
    const { success, error, data } = cardSchema.safeParse(body)
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

    const { title, type, pick, danger, score, action, token, level,quantity } = data

    // ✅ Handle action reference if it's a string (ObjectId)
    let actionId: ObjectId | undefined
    if (action && typeof action === 'string') {
      if (!ObjectId.isValid(action)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action ID'
          },
          { status: 400 }
        )
      }
      actionId = new ObjectId(action)
    }

    // เตรียม $set และ $unset แยกออกจากกัน
    const setData: Partial<Card> = {
      title,
      quantity,
      type: type as CardType
    }
    const unsetData: Record<string, 1> = {}

    if (type === CardType.DANGER) {
      setData.pick = pick
      setData.danger = danger
      Object.assign(unsetData, { score: 1, action: 1, token: 1, level: 1 })
    } else if (
      [CardType.ROBINSON, CardType.KNOWLEDGE, CardType.AGE].includes(
        type as CardType
      )
    ) {
      setData.score = score
      setData.action = actionId
      setData.token = token
      Object.assign(unsetData, { pick: 1, danger: 1 })

      if (type === CardType.AGE) {
        setData.level = level
      } else {
        unsetData.level = 1
      }
    }

    // สร้าง update object
    const updateOps: {
      $set: Partial<Card>;
      $unset?: Record<string, 1>;
    } = {
      $set: setData
    }
    if (Object.keys(unsetData).length > 0) {
      updateOps.$unset = unsetData
    }

    // แล้วค่อยเอาไปใช้กับ findOneAndUpdate
    const result = await cards.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateOps,
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Card updated successfully',
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

    const result = await cards.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Card deleted successfully',
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
