import { Modal, Box, TextField, Typography } from '@mui/material'
import { STYLES } from '../../utils/consts.js'
import { useState } from 'react'
import fetcher from '@/components/fetcher.js'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { Stack } from '@mui/system'

export default function ModalPago ({ rowData, mutate }) {
  const [errorForm, setErrorForm] = useState({})
  const [openModal, setOpenModal] = useState(false)
  const handledPagarPago = async (payload) => {
    try {
      const isPaid = await fetcher({
        key: '/api/pagarPago',
        variables: {
          pago: payload
        }
      })
      if (isPaid) {
        mutate()
      }
    } catch (error) {
      toast('Error al pagar el pago', { type: 'error' })
    }
  }
  const handleForm = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const validationSchema = z.object({
      refPago: z.string().min(1, 'Este campo es requerido').max(50),
      refBanco: z.string().min(1, 'Este campo es requerido').max(50),
      fechaPago: z.string().min(1, 'Este campo es requerido').max(50)
    })
    const { refPago, refBanco, fechaPago } = Object.fromEntries(form)
    const payload = {
      _id: rowData._id,
      isPaid: true,
      refPago,
      refBanco,
      fechaPago
    }
    console.log('🚀 ~ file: ModalPago.jsx:44 ~ handleForm ~ payload', payload)

    const isValid = validationSchema.safeParse(payload)
    if (isValid.success) {
      handledPagarPago(payload)
      setOpenModal(false)
    } else {
      Object.entries(isValid.error).forEach(([key, value]) => {
        if (key === 'issues') {
          value.forEach((item) => {
            setErrorForm((prev) => ({ ...prev, [item.path[0]]: item.message }))
          })
        }
      })
    }
  }

  return (
    <>
      <button
      onClick={() => setOpenModal(true)}
      disabled={rowData.isPaid}
      className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded disabled:opacity-25 disabled:cursor-not-allowed">
        Pagar
      </button>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        >
        <Box sx={{ ...STYLES.modal, width: '25%', flexDirection: 'column', padding: 30 }}>
          <form
            id="formPago"
            onSubmit={handleForm}
            style={{
              width: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <Typography variant='h4' sx={{
                textAlign: 'center'
              }}>
                 Añadir datos Pago
              </Typography>
              <TextField
                type="text"
                name="refPago"
                label="Referencia de pago"
                error={!!errorForm.refPago}
                onFocus={() => setErrorForm((prev) => ({ ...prev, refPago: '' }))}
                defaultValue={rowData.refPago}
              />
              <TextField
                type="text"
                name="refBanco"
                label="Referencia bancaria"
                error={!!errorForm.refBanco}
                defaultValue={rowData.refBanco}
                onFocus={() => setErrorForm((prev) => ({ ...prev, refBanco: '' }))}
              />
              <TextField
                type="datetime-local"
                name="fechaPago"
                helperText="Fecha de pago"
                error={!!errorForm.fechaPago}
                defaultValue={new Date().toISOString().slice(0, 16)}
                onFocus={() => setErrorForm((prev) => ({ ...prev, fechaPago: '' }))}
              />
              <Stack>
              <button type="submit"
                className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 border-b-4 border-teal-700 hover:border-teal-500 rounded disabled:opacity-25 disabled:cursor-not-allowed">
                  Pagar
                </button>
              </Stack>
            </form>
        </Box>
      </Modal>
    </>
  )
}
