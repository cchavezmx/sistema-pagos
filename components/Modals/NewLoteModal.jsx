import { useState } from 'react'
import { Box, Modal, Typography } from '@mui/material'
import { STYLES } from '../../utils/consts.js'
import CustomButton from '../styleComponents/CustomButton'
import CreateNewLoteModal from './CreateNewLoteModal'
import AddNewLoteModal from './AddNewLoteModal'
import AutocompleteEmail from '../styleComponents/AutocompleteEmail'

export default function NewLoteModal ({ open, handleClose }) {
  const [openCreateNewLoteModal, setOpenCreateNewLoteModal] = useState(false)
  const [modalNewLote, setModalNewLote] = useState(false)
  const [clientSelected, setClientSelected] = useState(null)
  const [addLoteToClientSelected, setAddLoteToClientSelected] = useState(false)

  const handledOpenCreateNewLoteModal = () => {
    setOpenCreateNewLoteModal(true)
    handleClose()
  }

  const toggleModalNewLote = () => {
    setModalNewLote(!modalNewLote)
    handleClose()
  }

  const acceptClientSelected = () => {
    toggleModalNewLote()
    setAddLoteToClientSelected(true)
  }

  const handleCloseSelectClientModal = () => {
    setModalNewLote()
    setClientSelected(null)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...STYLES.modal, width: 400, flexDirection: 'column' }}>
          <CustomButton onClick={() => handledOpenCreateNewLoteModal()}>Nuevo Cliente</CustomButton>
          <CustomButton type='outline' onClick={toggleModalNewLote}>Cliente Existente</CustomButton>
        </Box>
      </Modal>
      <Modal open={modalNewLote} onClose={() => handleCloseSelectClientModal()}>
        <Box sx={{ ...STYLES.modal, backgroundColor: 'white', color: 'black', width: 400, height: 300, gap: 5 }}>
          <Typography variant='h4'>Selecciona un cliente</Typography>
          <AutocompleteEmail setClientSelected={setClientSelected} />
          <CustomButton disabled={!clientSelected} onClick={() => acceptClientSelected()}>Crear Lote</CustomButton>
        </Box>
      </Modal>
      <CreateNewLoteModal
        open={openCreateNewLoteModal}
        handleClose={() => setOpenCreateNewLoteModal(false)}
        />
      <AddNewLoteModal
        open={addLoteToClientSelected}
        handleClose={() => setAddLoteToClientSelected(false)}
        clientSelected={clientSelected}
        />
    </div>
  )
}
