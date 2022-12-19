import Link from 'next/link'

export default function CardProyecto ({ proyecto }) {
  return (
    <Link href={`/proyecto/id/${proyecto._id}/title/${proyecto.title}`}>
      <a>
      <div className="p-3 bg-cyan-700 shadow rounded hover:bg-slate-700">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-50 text-center">
            {proyecto.title}
        </h5>
      </div>
      </a>
    </Link>
  )
}
