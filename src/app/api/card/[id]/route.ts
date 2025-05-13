// app/api/cards/[id]/route.ts
import client from '@/client'
import cards from '@/models/cards'
import { IResponse } from '@/types/services'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

import { cardSchema } from '@/models/schema/cardSchema'
import { Card, CardType } from '@/types/card';

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

    const { title, type, pick, danger, score, action, token, level } = data

    // ✅ Check if another card has the same title (exclude current card)
    const exists = await cards.findOne({ 
      title, 
      _id: { $ne: new ObjectId(id) } 
    })
    if (exists) {
      return NextResponse.json(
        {
          success: false,
          message: 'Card title already exists'
        },
        { status: 409 }
      )
    }

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

    // ✅ Prepare update data based on type
    const updateData: Partial<Card> & { $unset?: Record<string, 1> } = {
      title,
      type: type as CardType
    }

    // Add type-specific fields
    if (type === CardType.DANGER) {
      updateData.pick = pick
      updateData.danger = danger
      // Clear other type fields
      updateData.$unset = { score: 1, action: 1, token: 1, level: 1 }
    } else if ([CardType.ROBINSON, CardType.KNOWLEDGE, CardType.AGE].includes(type as CardType)) {
      updateData.score = score
      updateData.action = actionId
      updateData.token = token
      // Clear DANGER fields
      updateData.$unset = { pick: 1, danger: 1 }
      
      if (type === CardType.AGE) {
        updateData.level = level
      } else {
        // Clear level if not AGE type
        if (!updateData.$unset) updateData.$unset = {}
        updateData.$unset.level = 1
      }
    }

    const result = await cards.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData, ...updateData.$unset && { $unset: updateData.$unset } },
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