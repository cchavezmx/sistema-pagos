import Link from 'next/link'

export default function CardProyecto ({ proyecto }) {
  return (
    <Link href={`/proyecto/id/${proyecto._id}/title/${proyecto.title}`}>
      <a>
      <div className="p-6 bg-[#2a4076] shadow rounded hover:bg-slate-700">
        <h5 className="mb-2 text-xl font-bold tracking-tight text-slate-100">
            {proyecto.title}
        </h5>
      </div>
        {/* <div key={proyecto._id} className="max-w-sm rounded overflow-hidden shadow-lg">
          <h4 className="font-bold text-xl">{proyecto.title}</h4>
        </div> */}
      </a>
    </Link>
  )
}
