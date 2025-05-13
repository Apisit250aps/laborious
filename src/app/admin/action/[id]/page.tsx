'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'

import InputField from '@/components/share/input/InputField'
import TextField from '@/components/share/input/TextField'
import Button from '@/components/share/button/button'
import CardContent from '@/components/share/layouts/CardContent'
import SelectField from '@/components/share/input/SelectField'
import { Toast } from '@/libs/toasty'
import { CODEX } from '@/libs/games'
import { GetActionByIdService, UpdateActionService } from '@/services/actions'

const actionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  codex: z.string().min(1, 'Codex is required'),
  value: z.string(),
  description: z.string().optional()
})

type ActionForm = z.infer<typeof actionSchema>

export default function AdminActionEditPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const id = params.id

  const [isLoading, setIsLoading] = useState(false)

  const options = CODEX.map((code) => ({ value: code, label: code }))

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ActionForm>({
    resolver: zodResolver(actionSchema)
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const result = await GetActionByIdService(id)
      console.log(result)
      if (result.success && result.data) {
        reset({
          title: result.data.title,
          codex: result.data.codex,
          value: String(result.data.value),
          description: result.data.description
        })
      } else {
        Toast('Failed to load action', 'error')
        router.push('/admin/action')
      }
      setIsLoading(false)
    }

    if (id) fetchData()
  }, [id, reset, router])

  const onSubmit = async (data: ActionForm) => {
    setIsLoading(true)

    const action = {
      ...data,
      value: Number(data.value),
      codex: data.codex.toUpperCase()
    }

    const result = await UpdateActionService(id, action)

    if (result.success) {
      await Toast('Action updated successfully', 'success')
      router.push('/admin/action')
    } else {
      Toast(result.message || 'Failed to update action', 'error')
    }
    setIsLoading(false)
  }

  return (
    <CardContent title="Edit Action">
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
          label="Value"
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
            Save Changes
          </Button>
        </div>
      </form>
    </CardContent>
  )
}
