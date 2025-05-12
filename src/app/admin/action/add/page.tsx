import InputField from '@/components/share/input/InputField'
import TextField from '@/components/share/input/TextField'
import Button from '@/components/share/button/button'
import CardContent from '@/components/share/layouts/CardContent'

export default function AdminActionAddPage() {
  return (
    <>
      <CardContent title="Add Action">
        <form>
          <InputField className="w-full" name="title" label={'Title'} />
          <TextField
            className="w-full"
            name="description"
            label={'Description'}
          />
          <div className="flex justify-end mt-3">
            <Button className='btn-outline' isLoading={false}>Create</Button>
          </div>
        </form>
      </CardContent>
    </>
  )
}
