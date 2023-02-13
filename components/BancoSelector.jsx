import { Select, MenuItem, FormHelperText } from '@mui/material'

const bancosList = [
  'ABC CAPITAL',
  'BANKAOOL',
  'BANORTE/IXE',
  'Banorte',
  'FINTERRA',
  'INBURSA',
  'INDUSTRIAL',
  'SANTANDER',
  'UNIÓN',
  'BBVA BANCOMER',
  'BBVA SERVICIOS',
  'HSBC',
  'SALDO A FAVOR'
]

const BancoSelector = ({ prevData }) => {
  return (
  <div className="hook__pagos">
    <FormHelperText>Selecciona el banco</FormHelperText>
    <small style={{ color: 'red' }}>requerido*</small>
    <Select name="banco" fullWidth defaultValue={prevData || ''}>
    {
      bancosList
        .sort().map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)
    }
    </Select>
  </div>
  )
}

export default BancoSelector
