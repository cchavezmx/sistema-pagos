import { Modal, Box, Typography } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 2,
  p: 4

}

export default function FirstPaymant ({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant='h4' sx={{ textAlign: 'center', margin: '8px 0' }}>
          ¿Tu cliente tiene pagos anteriores?
        </Typography>
        {/* <Typography variant='h6' sx={{ margin: '8px 0' }}>
        </Typography> */}
        <Typography variant='p' fontSize='20px' sx={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <p>
            Si tu cliente ya tiene pagos registrados, debes crear un pago de tipo: <strong>&quot;Saldo inicial&quot; </strong>
            para registar el avanze de su deuda.
          </p>
          <p>
            En este documento debes indicar el monto que el cliente ya ha pagado
            y la mensualidad en la que se encuentra.
          </p>
          <p>
            De esta forma el sistema calculará el saldo pendiente de tu cliente
            y tomara el consecutivo de la mensualidad siguiente.
          </p>
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          {/* <Button variant='outlined'>
            Registrar pago inicial
          </Button> */}
        </Box>
      </Box>
    </Modal>
  )
}
