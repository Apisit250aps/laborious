'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputField from '@/components/share/input/InputField'
import Button from '@/components/share/button/button'
import CardContent from '@/components/share/layouts/CardContent'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { z } from 'zod'
import SelectField, { SelectOption } from '@/components/share/input/SelectField'
import { CARD_TYPE } from '@/libs/games'
import {
  DeleteCardService,
  GetCardByIdService,
  UpdateCardService
} from '@/services/cards'
import { Card } from '@/types/card'
import { GetActionService } from '@/services/actions'
import { confirmDelete, Toast } from '@/libs/callback'

// Simplified schema without complex refine validation
const cardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.string().min(1, 'Please select a card type'),
  quantity: z.number().int().min(1, 'Quantity must be positive'),
  pick: z.union([z.number().min(1), z.literal(''), z.undefined()]).optional(),
  danger: z.array(z.number()).optional(),
  score: z
    .union([z.number().min(-5).max(5), z.literal(''), z.undefined()])
    .optional(),
  action: z.string().optional(),
  token: z.union([z.number().min(0), z.literal(''), z.undefined()]).optional(),
  level: z
    .union([z.literal(1), z.literal(2), z.literal(''), z.undefined()])
    .optional()
})

type CardForm = z.infer<typeof cardSchema>

export default function AdminCardEditPage() {
  const router = useRouter()
  const params = useParams()
  const cardId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [dangerValues, setDangerValues] = useState<string>('')
  const [actionOption, setActionOption] = useState<SelectOption[]>([])

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
    setError
  } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      quantity: 1 // เปลี่ยนจาก 0 เป็น 1
      // ไม่ใส่ default values สำหรับ field อื่น
    }
  })

  const type = watch('type')

  const levelOption = [
    { label: 'Normal', value: 1 },
    { label: 'Hard', value: 2 }
  ] as SelectOption[]

  const cardTypeOption = CARD_TYPE.map(
    (type) => ({ label: type, value: type } as SelectOption)
  )

  // Load existing card data
  const loadCard = useCallback(async () => {
    if (!cardId) return

    setIsFetching(true)
    try {
      const result = await GetCardByIdService(cardId)
      if (result.success && result.data) {
        const card = result.data

        // Reset form with card data - ไม่ fallback เป็น empty string
        reset({
          title: card.title || '',
          type: card.type, // ไม่ fallback เป็น ''
          quantity: card.quantity || 1,
          pick: card.pick,
          score: card.score,
          token: card.token,
          level: card.level,
          action: card.action?.toString() || ''
        })

        // Handle danger values if it's a DANGER card
        if (card.type === 'DANGER' && card.danger) {
          setDangerValues(card.danger.join(', '))
        }
      } else {
        Toast(result.message || 'Failed to load card', 'error')
        router.push('/admin/card')
      }
    } catch (error) {
      console.error(error)
      Toast('An unexpected error occurred while loading card', 'error')
      router.push('/admin/card')
    } finally {
      setIsFetching(false)
    }
  }, [cardId, reset, router])

  const loadActions = useCallback(async () => {
    const result = await GetActionService({ limit: 1000 })
    if (result.success) {
      const actions = result.data!.data
      const options = actions.map(
        (act) =>
          ({ label: act.title, value: act._id?.toString() } as SelectOption)
      )
      setActionOption(options)
    }
  }, [])

  useEffect(() => {
    loadActions()
    loadCard()
  }, [loadActions, loadCard])

  const onSubmit = async (data: CardForm) => {
    // Custom validation before submit
    if (data.type === 'DANGER') {
      if (!data.pick || data.pick <= 0) {
        setError('pick', {
          type: 'manual',
          message: 'Pick value is required for DANGER cards'
        })
        Toast('Pick value is required for DANGER cards', 'error')
        return
      }
      if (!dangerValues.trim()) {
        Toast('Danger values are required for DANGER cards', 'error')
        return
      }
    }

    if (['ROBINSON', 'KNOWLEDGE', 'AGE'].includes(data.type)) {
      if (data.score === undefined || data.score === '') {
        setError('score', {
          type: 'manual',
          message: 'Score is required for this card type'
        })
        Toast('Score is required for this card type', 'error')
        return
      }
    }

    if (data.type === 'AGE') {
      if (!data.level || (data.level !== 1 && data.level !== 2)) {
        setError('level', {
          type: 'manual',
          message: 'Level is required for AGE cards'
        })
        Toast('Level is required for AGE cards', 'error')
        return
      }
    }

    setIsLoading(true)

    try {
      // Convert danger string to array (ถ้า type เป็น DANGER)
      if (data.type === 'DANGER' && dangerValues) {
        const dangerArray = dangerValues
          .split(',')
          .map((val) => parseInt(val.trim()))
          .filter((val) => !isNaN(val))

        if (dangerArray.length === 0) {
          Toast('Danger values are required for DANGER cards', 'error')
          setIsLoading(false)
          return
        }

        data.danger = dangerArray
      }

      // ลบฟิลด์ที่ไม่จำเป็นตาม type
      if (data.type !== 'DANGER') {
        delete data.pick
        delete data.danger
      }

      if (!['ROBINSON', 'KNOWLEDGE', 'AGE'].includes(data.type)) {
        delete data.score
      }

      if (data.type !== 'AGE') {
        delete data.level
      }

      if (data.type === 'DANGER') {
        delete data.action
        delete data.token
      }

      // เรียก API update
      const result = await UpdateCardService(cardId, data as Card)

      if (result.success) {
        await Toast('Card updated successfully', 'success')
        router.push('/admin/card')
      } else {
        Toast(result.message || 'Failed to update card', 'error')
      }
    } catch (error) {
      console.error(error)
      Toast('An unexpected error occurred', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to check if field should be shown
  const shouldShowField = (fieldType: string) => {
    switch (fieldType) {
      case 'pick':
      case 'danger':
        return type === 'DANGER'
      case 'score':
        return ['ROBINSON', 'KNOWLEDGE', 'AGE'].includes(type)
      case 'level':
        return type === 'AGE'
      case 'action':
      case 'token':
        return type !== 'DANGER' // Show for all types except DANGER
      default:
        return true
    }
  }

  // Show loading spinner while fetching card data
  if (isFetching) {
    return (
      <CardContent title={'Edit Card'}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading card data...</span>
        </div>
      </CardContent>
    )
  }

  return (
    <CardContent title={'Edit Card'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          className="w-full"
          label="Title"
          error={errors.title?.message}
          {...register('title')}
        />

        <InputField
          className="w-full"
          label="Quantity"
          type="number"
          error={errors.quantity?.message}
          {...register('quantity', { valueAsNumber: true })}
        />

        <SelectField
          className="w-full"
          label={'Card Type'}
          error={errors.type?.message}
          {...register('type', {
            onChange: () => {
              // Clear เฉพาะ error ที่ไม่ใช่ type
              clearErrors([
                'pick',
                'score',
                'token',
                'level',
                'danger',
                'action'
              ])

              // Reset dependent field values
              setValue('pick', undefined)
              setValue('score', undefined)
              setValue('token', undefined)
              setValue('level', undefined)
              setDangerValues('')
            }
          })}
          options={cardTypeOption}
        />

        {shouldShowField('pick') && (
          <InputField
            className="w-full"
            label="Pick"
            type="number"
            error={errors.pick?.message}
            {...register('pick', { valueAsNumber: true })}
          />
        )}

        {shouldShowField('danger') && (
          <InputField
            className="w-full"
            label="Danger Values (comma-separated)"
            placeholder="e.g., 1, 2, 3"
            value={dangerValues}
            onChange={(e) => setDangerValues(e.target.value)}
            error={errors.danger?.message}
          />
        )}

        {shouldShowField('score') && (
          <InputField
            className="w-full"
            label="Score"
            type="number"
            error={errors.score?.message}
            {...register('score', { valueAsNumber: true })}
          />
        )}

        {shouldShowField('action') && (
          <SelectField
            options={actionOption}
            className="w-full"
            label="Action"
            error={errors.action?.message}
            {...register('action')}
          />
        )}

        {shouldShowField('token') && (
          <InputField
            className="w-full"
            label="Token"
            type="number"
            error={errors.token?.message}
            {...register('token', { valueAsNumber: true })}
          />
        )}

        {shouldShowField('level') && (
          <SelectField
            className="w-full"
            label={'Level'}
            options={levelOption}
            error={errors.level?.message}
            {...register('level', { valueAsNumber: true })}
          />
        )}

        <div className="flex justify-between">
          <div className="">
            <Button
              type="button"
              className="btn-outline btn-error"
              onClick={() =>
                confirmDelete(async () => {
                  const result = await DeleteCardService(cardId)
                  if (result.success) {
                    router.push('/admin/card')
                    return result.success
                  }
                  return false
                })
              }
            >
              Delete
            </Button>
          </div>
          <div className=" space-x-2">
            <Button
              type="button"
              className="btn-secondary"
              onClick={() => router.push('/admin/card')}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-outline" isLoading={isLoading}>
              Update Card
            </Button>
          </div>
        </div>
      </form>
    </CardContent>
  )
}