import { useEffect, useState } from 'react'
import { TextField } from '@mui/material'
import useSWR from 'swr'

const DataLoteIndetifier = ({ errores, setErrores, proyecto: proyectoId }) => {
  const [lote, setLote] = useState('')
  const [manzana, setManzana] = useState('')
  const [fraccionamiento, setFraccionamiento] = useState('')
  const { data: watchLoteInfo } = useSWR({ key: '/api/watchLoteInfo', variables: { lote, manzana, fraccionamiento, proyectoId } })

  console.log('🚀 ~ file: AddNewLoteModal.jsx ~ line 12 ~ DataLoteIndetifier ~ watchLoteInfo', watchLoteInfo)
  useEffect(() => {
    if (Array.isArray(watchLoteInfo) && watchLoteInfo.length > 0) {
      setErrores((prev) => ({ ...prev, lote: 'Verifica los datos del lote, puede estar repetido' }))
    }

    if (Array.isArray(watchLoteInfo) && watchLoteInfo.length === 0) {
      setErrores((prev) => ({ ...prev, lote: null }))
    }
  }, [watchLoteInfo])

  return (
  <>
    <TextField
      fullWidth
      id="lote"
      name='lote'
      label="Lote"
      error={errores.lote}
      helperText={errores.lote}
      onChange={(e) => setLote(e.target.value)}
    />
    <TextField
      fullWidth
      id="title"
      name='manzana'
      label="Manzana"
      error={errores.manzana}
      helperText={errores.manzana}
      onChange={(e) => setManzana(e.target.value)}
    />
    <TextField
      fullWidth
      id="fraccionamiento"
      name='fraccionamiento'
      label="Fraccionamiento"
      error={errores.fraccionamiento}
      helperText={errores.fraccionamiento}
      onChange={(e) => setFraccionamiento(e.target.value)}
    />
  </>
  )
}

export default DataLoteIndetifier
