'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import InputField from '@/components/share/input/InputField'
import TextField from '@/components/share/input/TextField'
import Button from '@/components/share/button/button'
import CardContent from '@/components/share/layouts/CardContent'
import { useState } from 'react'
import { Toast } from '@/libs/callback'
import SelectField, { SelectOption } from '@/components/share/input/SelectField'
import { CODEX } from '@/libs/games'
import { CreateActionService } from '@/services/actions'
import { useRouter } from 'next/navigation'

const actionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  codex: z.string().min(1, 'Codex is required'),
  value: z.string(),
  description: z.string().optional()
})

type ActionForm = z.infer<typeof actionSchema>

export default function AdminActionAddPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const options = CODEX.map(
    (code) => ({ value: code, label: code } as SelectOption)
  )
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ActionForm>({
    resolver: zodResolver(actionSchema)
  })

  const onSubmit = async (data: ActionForm) => {
    setIsLoading(true)

    const action = {
      ...data,
      value: Number(data.value),
      codex: data.codex.toUpperCase()
    }

    const result = await CreateActionService(action)

    if (result.success) {
      await Toast('Action created successfully', 'success')
      router.push('/admin/action')
    } else {
      Toast(result.message || 'Failed to create action', 'error')
    }
    setIsLoading(false)
  }

  return (
    <CardContent title="Add Action">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          className="w-full"
          label="Title"
          error={errors.title?.message}
          {...register('title')}
        />
        <SelectField
          options={options}
          className="w-full"
          label="Codex"
          error={errors.codex?.message}
          {...register('codex')}
        />
        <InputField
          className="w-full"
          label="Values"
          type="number"
          error={errors.value?.message}
          min={-5}
          max={5}
          maxLength={1}
          {...register('value')}
        />
        <TextField
          className="w-full"
          label="Description"
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="flex justify-end">
          <Button className="btn-outline" isLoading={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </CardContent>
  )
}
