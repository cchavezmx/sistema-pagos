import { useEffect, useState } from 'react'
import { Box, Modal, TextField, Typography, Stack } from '@mui/material'
import CustomButton from '../styleComponents/CustomButton'
import { STYLES } from '../../utils/consts.js'
import { z } from 'zod'
import fetcher from '../../utils/fetcher'
import { useSWRConfig } from 'swr'

export default function CreateProyectoModal ({ open, handleClose, owner }) {
  const [errores, setErrores] = useState({})
  const { mutate } = useSWRConfig()
  useEffect(() => {
    return () => setErrores({})
  }, [open])

  const handledSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const { title, address } = Object.fromEntries(form)

    const variablesSchema = z.object({
      title: z.string().min(1, 'Este campo es requerido').max(50),
      address: z.string().min(1, 'Este campo es requerido').max(50)
    })

    const variables = {
      title,
      address,
      isActive: true,
      owner
    }

    const isValid = variablesSchema.safeParse(variables)
    if (isValid.success) {
      fetcher({ key: '/api/createProyecto', variables: { proyecto: variables } })
        .then((res) => {
          if (res.isActive) {
            mutate({ key: '/api/getProyectosByOwner', variables: { owner } })
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
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ color: 'black' }}
      >
        <Box sx={{ ...STYLES.modal, flexDirection: 'column', width: 300, height: null, backgroundColor: 'white' }}>
        <Typography>Crear nuevo proyecto</Typography>
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
                name='title'
                label="Nombre del proyecto"
                error={errores.title}
                helperText={errores.title}
                />
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Descripción"
                error={errores.address}
                helperText={errores.address}
                />
            </Box>
            <Stack marginTop={1}>
              <CustomButton type="submit">Nuevo Cliente</CustomButton>
            </Stack>
            </form>
        </Box>
      </Modal>
    </div>
  )
}
