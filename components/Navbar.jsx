import Link from 'next/link'
import { Button } from '@mui/material'
import { SportsMartialArts, Search } from '@mui/icons-material'

function Navbar () {
  return (
    <nav className="shadow-md flex items-center justify-between flex-wrap bg-[#1f2937] p-4">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link href="/">
          <a>
            <span className="font-bold text-4xl tracking-tight">Grupo Maya</span>
          </a>
        </Link>
      </div>
      <div className="gap-3 flex">
        <Button startIcon={<Search />} variant="contained" color="primary" href="/proyecto/nuevo">Clientes</Button>
        <Button startIcon={<SportsMartialArts />} variant="contained" color="secondary" href="/owner/nuevo">Morosos</Button>
      </div>
    </nav>

  )
}

export default Navbar
