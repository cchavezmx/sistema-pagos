import { useState } from 'react'
import { Box, Divider, Drawer, Typography, TextField, Select, MenuItem, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'
import ButtonMaya from '../ButtonMaya.jsx'
import BancoSelector from '../BancoSelector.jsx'
import z from 'zod'

const PagosSwitch = ({ name, value }) => {
  console.log('🚀 ~ file: ModificarModal.jsx ~ line 41 ~ TextLoco ~ key, value', name, value)
  const [text, setText] = useState(value)
  const slugName = {
    folio: 'Folio',
    refPago: 'Referencia de Pago',
    monto: 'Monto',
    banco: 'Banco',
    ctaBancaria: 'Cuenta Bancaria',
    fechaPago: 'Fecha de Pago',
    description: 'Descripción'
  }

  switch (name) {
    case 'folio':
    case 'description':
    case 'monto':
    case 'refPago':
    case 'ctaBancaria':
      return (
        <TextField
        label={slugName[name]}
        variant="outlined"
        name={name}
        value={text}
        onChange={(e) => setText(e.target.value)}
        />
      )
    case 'fechaPago':
      return (
        <TextField
        type="date"
        label={name}
        variant="outlined"
        name={name}
        value={new Date(+value).toISOString().slice(0, 10)}
        onChange={(e) => setText(e.target.value)}
        />
      )
    case 'tipoPago':
      return (
          <>
          <FormHelperText>Selecciona tipo de pago </FormHelperText>
          <Select
            value={value}
            key={name}
            >
            <MenuItem value="mensualidad">Mensualidad</MenuItem>
            <MenuItem value="extra" >Extra</MenuItem>
            <MenuItem value="acreditado">Acreditado</MenuItem>
            <MenuItem value="saldoinicial">Saldo Incial</MenuItem>
          </Select>
        </>
      )
    case 'banco':
      return <BancoSelector prevData={value}/>
    default:
      break
  }
}

export default function ModificarModal ({ data: dataForm }) {
  console.log('🚀 ~ file: ModificarModal.jsx ~ line 9 ~ ModificarModal ~ dataForm', dataForm)
  const [errorForm, setErrorForm] = useState({})
  const [modal, setModal] = useState(false)
  const handledNewPagoForm = async (e) => {
    e.preventDefault()
    setErrorForm({})
    const formSchema = z.object({
      refPago: z.string().min(1, 'Este campo es requerido'),
      refBanco: z.string().min(1, 'Este campo es requerido'),
      monto: z.number('Este campos es requerido').min(1, 'Este campo es requerido'),
      fechaPago: z.string().min(1, 'Este campo es requerido'),
      ctaBancaria: z.string().min(1, 'Este campo es requerido'),
      banco: z.string().min(1, 'Este campo es requerido'),
      tipoPago: z.string().min(1, 'Este campo es requerido')
    })

    const form = new FormData()
    const data = Object.fromEntries(form)

    const payload = {
      ...data,
      monto: Number(data.monto)
      // cliente: pagoData.clienteID,
      // proyecto: pagoData.proyectoID,
      // lote: pagoData.loteID
    }

    const validateForm = formSchema.safeParse(payload)
    if (validateForm.success === true) {
      console.log('Formulario valido')
    }
  }

  console.log(errorForm)

  return (
    <>
    <Drawer
      open={modal}
      anchor="right"
      onClose={() => setModal(false)}
      sx={{ color: 'black' }}
    >
      <Box sx={{ padding: '10px', display: 'grid' }}>
        <Divider>
          <Typography variant='h6' paddingY={3}>Modificar datos de pago</Typography>
        </Divider>
        <form style={{
          width: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }} onSubmit={handledNewPagoForm}>
          {
            Object.entries(dataForm).map(([key, value]) => <PagosSwitch key={key} name={key} value={value} />)
          }
          <Stack direction="row" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ButtonMaya>Guardar cambios</ButtonMaya>
            <ButtonMaya variant="gray" type="button" onClick={() => setModal(false)}>Cerrar</ButtonMaya>
          </Stack>
        </form>
      </Box>
    </Drawer>
    <button
      onClick={() => setModal(true)}
      disabled={!dataForm.isPaid}
      className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded disabled:cursor-not-allowed disabled:opacity-25">
        Modificar
      </button>
    </>
  )
}
