import { useState, useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { DataGrid, esES, GridToolbar } from '@mui/x-data-grid'
import data from '../utils/clientes_pagos.json'

export default function AlreadyPaid () {
  const [allData, setAllData] = useState([])
  const [checkboxSelection, setCheckboxSelection] = useState(true)
  const formatRows = (dat) => {
    const rows = dat.map((item) => {
      return {
        ...item,
        lastPago: item.lastPago?.folio,
        idpago: item.lastPago?._id.$oid
      }
    })
    return rows
  }
  useEffect(() => {
    const pagadores = data.map((item) => {
      const { _id, pagos, lote, ...restOfData } = item
      const lastPago = pagos
        .filter(item => item.tipoPago === 'mensualidad')
        .sort((a, b) => a.folio - b.folio).pop()
      return { lote: lote.lote, plazo: lote.plazo, lastPago, id: _id.$oid, ...restOfData }
    })
    const terminados = pagadores.filter(item => item?.lastPago?.folio && item.lastPago.folio >= item.plazo)
    // no repetir pagos con el mismo folio
    const noRepetidos = [...new Set(terminados.map(item => item.lote))]
    const terminadosNoRepetidos = terminados.filter(item => noRepetidos.includes(item.lote))
    setAllData(formatRows(terminadosNoRepetidos))
  }, [])

  const columns = [
    { field: 'id', headerName: 'ID', width: 130 },
    { field: 'lote', headerName: 'Lote', width: 130 },
    { field: 'plazo', headerName: 'Plazo', width: 130 },
    { field: 'lastPago', headerName: 'Ultimo Pago', width: 130 },
    { field: 'nombre', headerName: 'Nombre', width: 230 },
    { field: 'email', headerName: 'Email', width: 130 },
    { field: 'phone', headerName: 'Telefono', width: 130 },
    { field: 'address', headerName: 'Direccion', width: 130 }
  ]

  return (
    <Box sx={{
      display: 'flex',
      width: '100vw',
      padding: '5rem'
    }}>
        {
          allData.length > 0 &&
          <Box sx={{ height: '60vh', width: '100vw' }}>
        <Button
            sx={{ mb: 2 }}
            onClick={() => setCheckboxSelection(!checkboxSelection)}
        >
            Toggle checkbox selection
        </Button>
        <div style={{ height: 600 }}>
            <DataGrid
            checkboxSelection={checkboxSelection}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            rows={allData}
            columns={columns}
            pageSize={100}
            experimentalFeatures={{ newEditingApi: true }}
            components={{
              Toolbar: GridToolbar
            }}
          />
        </div>
         </Box>
        }
    </Box>
  )
}
