import { useEffect, useState } from 'react'
import { Box, Drawer, TextField, Typography, Stack } from '@mui/material'
import CustomButton from '../styleComponents/CustomButton'
import { useRouter } from 'next/router'
import { z } from 'zod'
import fetcher from '../../utils/fetcher'
import { useSWRConfig } from 'swr'
import { toast } from 'react-toastify'
import DataLoteIndetifier from '../DataLoteIndetifier'

export default function CreateNewLoteModal ({ open, handleClose }) {
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
      clienteName,
      manzana,
      lote,
      fraccionamiento,
      precioTotal,
      enganche,
      financiamiento,
      plazo,
      mensualidad,
      inicioContrato,
      correo
    } = Object.fromEntries(form)

    console.log('🚀 ~ file: CreateNewLoteModal.jsx:35 ~ handledSubmit ~ correo', correo)
    const variablesSchema = z.object({
      name: z.string().min(1, 'Este campo es requerido').max(50),
      email: z.string().email('Este campo debe ser un correo valido').min(1, 'Este campo es requerido').max(50),
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
      name: clienteName,
      email: correo,
      manzana,
      lote,
      fraccionamiento,
      precioTotal: Number(precioTotal),
      enganche: Number(enganche),
      financiamiento: Number(financiamiento),
      plazo: Number(plazo),
      mensualidad: Number(mensualidad),
      inicioContrato: new Date(inicioContrato)

    }
    const isValid = variablesSchema.safeParse(variables)
    console.log('🚀 ~ file: CreateNewLoteModal.jsx:67 ~ handledSubmit ~ isValid', isValid)
    if (isValid.success) {
      fetcher({ key: '/api/createLote', variables: { lote: variables, newClientUpsert: true } })
        .then((res) => {
          if (res.isActive) {
            mutate({ key: '/api/getLotesByProject', variables: { proyecto: proyectoid } })
            handleClose()
            toast.success('Lote creado correctamente')
          }
          if (JSON.stringify(res).match(/Error: El cliente ya existe/)) {
            setErrores({ correo: 'El cliente ya existe, intenta con otro correo' })
          }
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
        <Box sx={{ flexDirection: 'column', width: 300, height: null, backgroundColor: 'white', padding: 2, zIndex: 1 }}>
        <Typography sx={{ textAlign: 'center', fontSize: 20, margin: '15px 0' }}>Nuevo Lote</Typography>
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
                error={errores.clienteName}
                helperText={errores.clienteName}
                />
              <TextField
                fullWidth
                id="correo"
                name='correo'
                label="Correo del Cliente"
                error={errores.correo}
                helperText={errores.correo}
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
