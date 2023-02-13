import CardOwner from '../components/CardOwner'
import useSWR from 'swr'
import Link from 'next/link'

export default function Home () {
  const { data: owners } = useSWR({ key: '/api/owners' })
  return (
  <div className="grid">
    <main className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
      {
        owners?.map((owner) => (
        <Link href={`/owner/${owner.slug}/id/${owner._id}/name/${owner.name}`} key={owner.id} >
            <a><CardOwner owner={owner} /></a>
          </Link>
        ))
      }
      {
        !owners && <strong>Cargando...</strong>
      }
    </main>
  </div>
  )
}
