import { useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import CardProyecto from 'components/CardProyecto'
import CreateProyectoModal from 'components/Modals/CreateProyectoModal'

export default function Owner () {
  const router = useRouter()
  const { id, name } = router.query
  const [open, setOpen] = useState(false)
  const handleClose = () => setOpen(false)

  const { data: proyectos } = useSWR(id ? { key: '/api/getProyectosByOwner', variables: { owner: id } } : null)

  return (
    <div>
      <div className="subtitle_seccion mb-8">
        <span>
          <h1><strong className="text-slate-500 uppercase">PROYECTOS / </strong>{name}</h1>
        </span>
        <div className="flex justify-center mt-3">
          <button
            style={{ height: '40px', width: '200px' }}
            onClick={() => setOpen(true)}
            className="text-lg bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-2 border-b-4 border-green-700 hover:border-green-500 rounded">
            Nuevo Proyecto
          </button>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            {
              proyectos?.map((proyecto) => <CardProyecto proyecto={proyecto} key={proyecto._id} />)
            }
        </div>
      </div>
      <CreateProyectoModal open={open} handleClose={handleClose} owner={id} />
    </div>
  )
}
