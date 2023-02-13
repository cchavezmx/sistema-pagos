import { useState } from 'react'
import { Box, Divider, Drawer, Typography, TextField, Select, MenuItem, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'
import ButtonMaya from '../ButtonMaya.jsx'
import BancoSelector from '../BancoSelector.jsx'
import fetcher from '@/components/fetcher.js'
import { toast } from 'react-toastify'
import z from 'zod'

// TODO HAY QUE HACER UN MODAL PARA AL DARLE CLICK A PAGAR SE AÑADA EL REF DE PAGO Y REF DE BANCO
// Y AGREGAR UNA OPCION PARA ENVIAR CORREO

export default function NewPagoModal ({ open, toogleClose, pagoData, mutate }) {
  const [errorForm, setErrorForm] = useState({})
  const handledNewPagoForm = async (e) => {
    e.preventDefault()
    setErrorForm({})
    const formSchema = z.object({
      // refPago: z.string().min(1, 'Este campo es requerido'),
      // refBanco: z.string().min(1, 'Este campo es requerido'),
      description: z.string().min(1, 'Este campo es requerido'),
      monto: z.number('Este campos es requerido').min(1, 'Este campo es requerido'),
      fechaPago: z.string().min(1, 'Este campo es requerido'),
      ctaBancaria: z.string().min(1, 'Este campo es requerido'),
      banco: z.string().min(1, 'Este campo es requerido'),
      tipoPago: z.string().min(1, 'Este campo es requerido')
    })

    const form = new FormData(e.target)
    const data = Object.fromEntries(form)

    const payload = {
      ...data,
      monto: Number(data.monto),
      cliente: pagoData.clienteID,
      proyecto: pagoData.proyectoID,
      lote: pagoData.loteID
    }

    const validateForm = formSchema.safeParse(payload)
    if (validateForm.success === true) {
      console.log('Formulario valido')
      console.log({ payload, pagoData })
      await fetcher({ key: '/api/createPago', variables: { pago: payload } })
        .then((res) => {
          console.log('🥺 ~ file: NewPagoModal.jsx ~ line 52 ~ handledNewPagoForm ~ res', res)
          toast.success('Pago creado correctamente')
          mutate()
          toogleClose()
        })
    } else {
      Object.entries(validateForm.error.issues).forEach(([key, value]) => {
        const { path, message } = value
        setErrorForm((prev) => {
          return {
            ...prev,
            [path[0]]: message
          }
        })
      })
    }
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      onClose={toogleClose}
      sx={{ color: 'black' }}
    >
      <Box sx={{ padding: '10px', display: 'grid' }}>
        <Divider>
          <Typography variant='h6' paddingY={3}>Agregar nuevo pago</Typography>
        </Divider>
        <form style={{
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }} onSubmit={handledNewPagoForm}>
          <TextField
            name='monto'
            label="Monto depositado"
            helperText={<span style={{ color: 'red' }}>requerido*</span>}
            error={!!errorForm.monto}
            onFocus={() => setErrorForm((prev) => ({ ...prev, monto: '' }))}
          />
          <TextField
            name='description'
            label="Descripción del pago"
            helperText={<span style={{ color: 'red' }}>requerido*</span>}
            error={!!errorForm.description}
            onFocus={() => setErrorForm((prev) => ({ ...prev, description: '' }))}
          />
          <TextField
            type="text"
            name="refPago"
            label="Referencia de pago"
            error={!!errorForm.refPago}
            onFocus={() => setErrorForm((prev) => ({ ...prev, refPago: '' }))}
          />
          <TextField
            type="text"
            name="refBanco"
            label="Referencia bancaria"
            error={!!errorForm.refBanco}
            onFocus={() => setErrorForm((prev) => ({ ...prev, refBanco: '' }))}
          />
          <TextField
            type="datetime-local"
            name="fechaPago"
            helperText="Fecha de pago"
            error={!!errorForm.fechaPago}
            onFocus={() => setErrorForm((prev) => ({ ...prev, fechaPago: '' }))}
          />
          <TextField
            type="ctaBancaria"
            name="ctaBancaria"
            label="Cuenta bancaria"
            helperText={<span style={{ color: 'red' }}>requerido*</span>}
            error={!!errorForm.ctaBancaria}
            onFocus={() => setErrorForm((prev) => ({ ...prev, ctaBancaria: '' }))}
          />
          <FormHelperText>Selecciona tipo de pago </FormHelperText>
          <Select
            name="tipoPago"
            error={!!errorForm.tipoPago}
            onFocus={() => setErrorForm((prev) => ({ ...prev, tipoPago: '' }))}
            >
            <MenuItem value="mensualidad">Mensualidad</MenuItem>
            <MenuItem value="extra" >Extra</MenuItem>
            <MenuItem value="acreditado">Acreditado</MenuItem>
            <MenuItem value="saldoinicial">Saldo Incial</MenuItem>
          </Select>
          <BancoSelector error={errorForm}/>
          <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ButtonMaya>Agregar pago</ButtonMaya>
            <ButtonMaya variant="gray" type="button" onClick={toogleClose}>Cerrar</ButtonMaya>
          </Stack>
        </form>
      </Box>
    </Drawer>
  )
}
