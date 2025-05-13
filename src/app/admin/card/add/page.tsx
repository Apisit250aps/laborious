'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import InputField from '@/components/share/input/InputField'
import Button from '@/components/share/button/button'
import CardContent from '@/components/share/layouts/CardContent'
import { useState } from 'react'
// import { Toast } from '@/libs/toasty'
// import { useRouter } from 'next/navigation'
import { z } from 'zod'
import SelectField, { SelectOption } from '@/components/share/input/SelectField'
import { CARD_TYPE } from '@/libs/games'

// Updated schema to match the Card interface
const cardSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    type: z.string().min(1, 'Please select a card type'),
    pick: z.union([z.number().min(1), z.literal(''), z.undefined()]).optional(),
    danger: z.array(z.number()).optional(),
    score: z
      .union([z.number().min(0), z.literal(''), z.undefined()])
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
          data.score !== undefined && data.score !== '' && data.score >= 0
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
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [dangerValues, setDangerValues] = useState<string>('')

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

    // Convert danger string to array
    if (data.type === 'DANGER' && dangerValues) {
      const dangerArray = dangerValues
        .split(',')
        .map((val) => parseInt(val.trim()))
        .filter((val) => !isNaN(val))
      if (dangerArray.length === 0) {
        // Show error if danger values are required but empty
        console.error('Danger values are required for DANGER cards')
        setIsLoading(false)
        return
      }
      data.danger = dangerArray
    }

    // Remove undefined fields based on card type
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

    console.log(data)
    // // Process the data before submitting it (e.g., adjust values, format them, etc.)
    // const result = await CreateCardService(data) // Your API call to create the card
    // if (result.success) {
    //   await Toast('Card created successfully', 'success')
    //   router.push('/admin/card')
    // } else {
    //   Toast(result.message || 'Failed to create card', 'error')
    // }
    setIsLoading(false)
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
          <InputField
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
