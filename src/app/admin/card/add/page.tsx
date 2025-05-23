'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputField from '@/components/share/input/InputField'
import Button from '@/components/share/button/button'
import CardContent from '@/components/share/layouts/CardContent'
import { useCallback, useEffect, useState } from 'react'
// import { Toast } from '@/libs/toasty'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import SelectField, { SelectOption } from '@/components/share/input/SelectField'
import { CARD_TYPE } from '@/libs/games'
import { CreateCardService } from '@/services/cards'
import { Card } from '@/types/card'
import { GetActionService } from '@/services/actions'
import { Toast } from '@/libs/callback'

// Updated schema to match the Card interface
const cardSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    type: z.string().min(1, 'Please select a card type'),
    quantity: z.number().int().min(1, 'Quantity must be positive'),
    pick: z.union([z.number().min(1), z.literal(''), z.undefined()]).optional(),
    danger: z.array(z.number()).optional(),
    score: z
      .union([z.number().min(-5).max(5), z.literal(''), z.undefined()])
      .optional(),
    action: z.string().optional(),
    token: z
      .union([z.number().min(0), z.literal(''), z.undefined()])
      .optional(),
    level: z
      .union([z.literal(1), z.literal(2), z.literal(''), z.undefined()])
      .optional()
  })
  .refine(
    (data) => {
      // Skip validation if type is not selected
      if (!data.type) return true

      // Add validation rules based on card type
      if (data.type === 'DANGER') {
        const isPickValid =
          data.pick !== undefined && data.pick !== '' && data.pick > 0
        return isPickValid // danger จะ validate ใน component
      }
      if (['ROBINSON', 'KNOWLEDGE', 'AGE'].includes(data.type)) {
        const isScoreValid =
          data.score !== undefined && data.score !== ''
        return isScoreValid
      }
      if (data.type === 'AGE') {
        const isLevelValid =
          data.level !== undefined &&
          data.level !== '' &&
          (data.level === 1 || data.level === 2)
        return isLevelValid
      }
      return true
    },
    {
      message: 'Please fill in all required fields for the selected card type',
      path: ['type']
    }
  )

type CardForm = z.infer<typeof cardSchema>

export default function AdminCardAddPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [dangerValues, setDangerValues] = useState<string>('')
  const [actionOption, setActionOption] = useState<SelectOption[]>([])

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
  }, [loadActions])

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      type: '',
      quantity: 0,
      pick: undefined,
      score: undefined,
      token: undefined,
      level: undefined
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

  const onSubmit = async (data: CardForm) => {
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

      // เรียก API
      const result = await CreateCardService(data as Card)

      if (result.success) {
        await Toast('Card created successfully', 'success')
        router.push('/admin/card')
      } else {
        Toast(result.message || 'Failed to create card', 'error')
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

  return (
    <CardContent title={'Add Card'}>
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
              // Clear errors when type changes
              clearErrors()
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
            {...register('level', { valueAsNumber: true })}
          />
        )}

        <div className="flex justify-end">
          <Button type="submit" className="btn-outline" isLoading={isLoading}>
            Create Card
          </Button>
        </div>
      </form>
    </CardContent>
  )
}
