import { Autocomplete, TextField } from '@mui/material'
import useSWR from 'swr'

export default function AutocompleteEmail ({ setClientSelected }) {
  const { data: emails } = useSWR({ key: '/api/getAllClients' })

  return (
  <>
    <Autocomplete
      disablePortal
      id="correo"
      options={emails}
      disabled={emails === undefined}
      getOptionLabel={(option) => option.name}
      onChange={(event, newValue) => {
        setClientSelected(newValue)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          sx={{ width: '100%' }}
          id="correo"
          name='correo'
          label="Correo del Cliente"
          />
      )}
    >
    </Autocomplete>
  </>
  )
}
