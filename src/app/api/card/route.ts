// app/api/cards/route.ts
import client from '@/client'
import cards from '@/models/cards'
import { IPagination, IResponse } from '@/types/services'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

import { cardSchema } from '@/models/schema/cardSchema'
import { Card, CardType } from '@/types/card'

export async function POST(
  req: NextRequest
): Promise<NextResponse<IResponse<Card>>> {
  try {
    await client.connect()

    const body = await req.json()

    // ✅ Validate input using Zod
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

    const { title, type, pick, danger, score, action, token, level, quantity } =
      data

    // ✅ Check for uniqueness
    const exists = await cards.findOne({ title })
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

    // ✅ Prepare card data based on type
    const cardData: Partial<Card> = {
      title,
      quantity,
      type: type as CardType
    }

    // Add type-specific fields
    if (type === CardType.DANGER) {
      cardData.pick = pick
      cardData.danger = danger
    } else if (
      [CardType.ROBINSON, CardType.KNOWLEDGE, CardType.AGE].includes(
        type as CardType
      )
    ) {
      cardData.score = score
      cardData.action = actionId
      cardData.token = token

      if (type === CardType.AGE) {
        cardData.level = level
      }
    }

    // ✅ Insert to DB
    const result = await cards.insertOne(cardData as Card)
    if (!result.insertedId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create card'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Card created successfully',
        data: {
          _id: result.insertedId as ObjectId,
          ...cardData
        } as Card
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

export async function GET(
  req: NextRequest
): Promise<NextResponse<IResponse<IPagination<Card>>>> {
  try {
    await client.connect()

    const url = req.nextUrl
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)
    const cardType = url.searchParams.get('type') as CardType | null

    const skip = (page - 1) * limit

    // ✅ Build filter query
    const filter: Partial<Card> = {}
    if (cardType && Object.values(CardType).includes(cardType)) {
      filter.type = cardType
    }

    const [totalCount, documents] = await Promise.all([
      cards.countDocuments(filter),
      cards
        .aggregate([
          { $match: filter },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'actions', // ชื่อ collection ของ action
              localField: 'action',
              foreignField: '_id',
              as: 'actionData'
            }
          },
          {
            $unwind: {
              path: '$actionData',
              preserveNullAndEmptyArrays: true
            }
          }
        ])
        .toArray()
    ])

    const data = documents as unknown as Card[]
    return NextResponse.json({
      success: true,
      message: 'Cards retrieved successfully',
      data: {
        data,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve cards'
      },
      { status: 500 }
    )
  }
}
