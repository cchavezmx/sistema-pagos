import { useState } from 'react'
import { Box, Divider, Drawer, Typography, TextField, Select, MenuItem, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'
import ButtonMaya from '../ButtonMaya.jsx'
import BancoSelector from '../BancoSelector.jsx'
import z from 'zod'
import fetcher from '@/components/fetcher.js'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'

const PagosSwitch = ({ name, value, error, setErrorForm }) => {
  const resetError = () => {
    setErrorForm({})
  }

  const [text, setText] = useState(value)
  const slugName = {
    folio: 'Folio',
    refPago: 'Referencia de Pago',
    monto: 'Monto',
    refBanco: 'Referencia Bancaria',
    ctaBancaria: 'Cuenta Bancaria',
    fechaPago: 'Fecha de Pago',
    description: 'Descripción',
    deposito: 'Depósito'
  }

  switch (name) {
    case 'folio':
    case 'description':
    case 'refBanco':
    case 'monto':
    case 'refPago':
    case 'ctaBancaria':
    case 'depostio':
      return (
        <TextField
          label={slugName[name]}
          variant="outlined"
          error={error[name]}
          name={name}
          value={text}
          onFocus={resetError}
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
          onFocus={resetError}
          error={error[name]}
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
    case '_id': return (
    <TextField
      label={slugName[name]}
      variant="outlined"
      name={name}
      value={value}
      style={{ display: 'none' }}
      error={error[name]}
      onFocus={resetError}
    />
    )
    default:
      return <></>
  }
}

export default function ModificarModal ({ data: dataForm }) {
  const [errorForm, setErrorForm] = useState({})
  const [modal, setModal] = useState(false)
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const { clienteID, proyectoID, loteID } = router.query

  const handledNewPagoForm = async (e) => {
    e.preventDefault()
    setErrorForm({})
    const formSchema = z.object({
      _id: z.string().min(1, 'Este campo es requerido'),
      folio: z.string().min(1, 'Este campo es requerido'),
      refPago: z.string().min(1, 'Este campo es requerido'),
      monto: z.number('Este campos es requerido').min(1, 'Este campo es requerido'),
      ctaBancaria: z.string().min(1, 'Este campo es requerido'),
      banco: z.string().min(1, 'Este campo es requerido'),
      fechaPago: z.string().min(1, 'Este campo es requerido'),
      refBanco: z.string().min(1, 'Este campo es requerido'),
      description: z.string().min(1, 'Este campo es requerido')
    })

    const form = new FormData(e.target)
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
      await fetcher({
        key: '/api/patchPago',
        variables: { pago: payload }
      }).then(res => {
        const { status } = JSON.parse(res)
        if (status === 200) {
          mutate({
            key: '/api/getAllPagosFromLote',
            variables: {
              cliente: clienteID,
              proyecto: proyectoID,
              lote: loteID
            }
          })

          setModal(false)
        }
      })
    } else {
      console.log({ validateForm })
      Object.entries(validateForm.error.issues).forEach(([key, value]) => {
        value.path.forEach((path) => {
          setErrorForm((prev) => ({ ...prev, [path]: value.message }))
        })
      })
    }
  }

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
            Object
              .entries(dataForm)
              .map(([key, value]) => {
                return (
                  <PagosSwitch
                    key={key}
                    name={key}
                    value={value}
                    error={errorForm}
                    setErrorForm={setErrorForm}
                  />
                )
              })
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
