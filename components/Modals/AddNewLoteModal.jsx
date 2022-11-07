import { useEffect, useState } from 'react'
import { Box, Drawer, TextField, Typography, Stack } from '@mui/material'
import CustomButton from '../styleComponents/CustomButton'
import { useRouter } from 'next/router'
import { z } from 'zod'
import { useSWRConfig } from 'swr'
import fetcher from '@/components/fetcher'
import DataLoteIndetifier from '../DataLoteIndetifier'

export default function AddNewLoteModal ({ open, handleClose, clientSelected }) {
  const router = useRouter()
  const { proyectoid } = router.query
  const [errores, setErrores] = useState({})
  const { mutate } = useSWRConfig()
  useEffect(() => {
    return () => setErrores({})
  }, [open])

  const handledSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const {
      manzana,
      lote,
      precioTotal,
      enganche,
      financiamiento,
      plazo,
      mensualidad,
      inicioContrato,
      fraccionamiento
    } = Object.fromEntries(form)

    const variablesSchema = z.object({
      manzana: z.string().min(1, 'Este campo es requerido').max(50),
      lote: z.string().min(1, 'Este campo es requerido').max(50),
      fraccionamiento: z.string().min(1, 'Este campo es requerido').max(50),
      precioTotal: z.number().min(1, 'Este campo es requerido'),
      enganche: z.number().min(1, 'Este campo es requerido'),
      financiamiento: z.number().min(1, 'Este campo es requerido'),
      plazo: z.number().min(1, 'Este campo es requerido'),
      mensualidad: z.number().min(1, 'Este campo es requerido')
    })

    const variables = {
      isActive: true,
      proyecto: proyectoid,
      manzana,
      lote,
      fraccionamiento,
      precioTotal: Number(precioTotal),
      enganche: Number(enganche),
      financiamiento: Number(financiamiento),
      plazo: Number(plazo),
      mensualidad: Number(mensualidad),
      inicioContrato: new Date(inicioContrato),
      cliente: clientSelected._id
    }

    const isValid = variablesSchema.safeParse(variables)
    if (isValid.success) {
      fetcher({ key: '/api/createLote', variables: { lote: variables, newClientUpsert: false } })
        .then((res) => {
          if (res.isActive) {
            mutate({ key: '/api/getLotesByProject', variables: { proyecto: proyectoid } })
            handleClose()
          }
        })
        .catch((err) => {
          console.log('🚀 ~ file: CreateProyectoModal.jsx ~ line 49 ~ .catch ~ err', err)
        })
    } else {
      Object.entries(isValid.error).forEach(([key, value]) => {
        if (key === 'issues') {
          value.forEach((item) => {
            setErrores((prev) => ({ ...prev, [item.path[0]]: item.message }))
          })
        }
      })
    }
  }

  return (
    <div>
      <Drawer
        open={open}
        anchor="right"
        onClose={handleClose}
        sx={{ color: 'black' }}
      >
        <Box sx={{ flexDirection: 'column', width: 300, height: null, backgroundColor: 'white', padding: 2 }}>
        <Typography sx={{ textAlign: 'center', fontSize: 20, margin: '15px 0' }}>Asignar nuevo Lote</Typography>
            <form onSubmit={handledSubmit}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                padding: '2',
                gap: 2,
                alignItems: 'center'
              }}>
              <TextField
                fullWidth
                id="title"
                name='clienteName'
                label="Nombre del Cliente"
                defaultValue={clientSelected?.name}
                error={errores.clienteName}
                helperText={errores.clienteName}
                />
              <DataLoteIndetifier
                errores={errores}
                setErrores={setErrores}
                proyecto={proyectoid}
              />
              <TextField
                fullWidth
                type="string"
                id="precioTotal"
                name='precioTotal'
                label="Precio Total"
                error={errores.precioTotal}
                helperText={errores.precioTotal}
              />
              <TextField
                fullWidth
                type="string"
                id="enganche"
                name='enganche'
                label="Enganche"
                error={errores.enganche}
                helperText={errores.enganche}
              />
              <TextField
                fullWidth
                type="string"
                id="financiamiento"
                name='financiamiento'
                label="Financiamiento"
                error={errores.financiamiento}
                helperText={errores.financiamiento}
              />
              <TextField
                fullWidth
                type="string"
                id="plazo"
                name='plazo'
                label="Plazo"
                error={errores.plazo}
                helperText={errores.plazo || 'Mensualidades a pagar'}
              />
              <TextField
                fullWidth
                type="string"
                id="mensualidad"
                name='mensualidad'
                label="Mensualidad"
                error={errores.mensualidad}
                helperText={errores.mensualidad}
              />
              <TextField
                fullWidth
                type="date"
                id="inicioContrato"
                name='inicioContrato'
                // label="Inicio del Contrato"
                error={errores.inicioContrato}
                helperText={errores.inicioContrato || 'Fecha Inicio del Contrato'}
              />
            </Box>
            <Stack marginTop={1}>
              <CustomButton type="submit">Nuevo Lote</CustomButton>
            </Stack>
            </form>
        </Box>
      </Drawer>
    </div>
  )
}
