// lotes por proyecto
import { useState } from 'react'
import useSWR from 'swr'
import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { DataGrid, esES, GridToolbar } from '@mui/x-data-grid'
import { numberFormat, dateFormat } from 'utils/NumberFormat'
import NewLoteModal from 'components/Modals/NewLoteModal'

export default function ProyectoId () {
  const router = useRouter()
  const { proyectoid, title } = router.query

  const { data: getLotesByProject } = useSWR(proyectoid ? { key: '/api/getLotesByProject', variables: { proyecto: proyectoid } } : null)

  const ButtonView = (item) => {
    const { clienteData, clientID, _id, proyecto } = item.row
    return (
      <div className="flex justify-center gap-1 w-[100vw]">
        <button
          onClick={() => router.push(`/client/${clientID}/proyecto/${proyecto}/lote/${_id}/slug/${clienteData}`)}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Detalle
        </button>
        <button
          className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">
          Actualizar
        </button>
      </div>
    )
  }

  const formatRows = (data) => {
    return data.map((item) => {
      return {
        ...item,
        id: item._id,
        clienteData: item.clienteData.name,
        clientID: item.clienteData._id,
        precioTotal: numberFormat(item.precioTotal),
        lote: item.lote.length > 0 ? item.lote : 'N/A',
        manzana: item.manzana ?? 'N/A',
        fraccionamiento: item.fraccionamiento ?? 'N/A',
        inicioContrato: dateFormat(item.inicioContrato)
      }
    })
  }

  const columns = [
    { field: 'clienteData', headerName: 'Cliente', minWidth: 180, flex: 2 },
    { field: 'id', headerName: 'ID', width: 70, hide: true },
    { field: 'lote', headerName: 'Lote', width: 90 },
    { field: 'manzana', headerName: 'Manzana', width: 90 },
    { field: 'fraccionamiento', headerName: 'Fracc', width: 100 },
    { field: 'inicioContrato', headerName: 'Inicio Contrato', width: 130, type: 'date' },
    { field: 'precioTotal', headerName: 'Precio Total', width: 130 },
    { field: 'Detalle', headerName: '', minWidth: 200, renderCell: ButtonView, flex: 1 }
  ]

  const [modalNewClient, setModalNewClient] = useState(false)
  return (
    <div>
      <div className="subtitle_seccion mb-8">
        <span>
          <h6><strong className="text-slate-500">LOTES / </strong> {title}</h6>
        </span>
        <div className="flex justify-center mt-3">
        <button
          style={{ height: '40px', width: '200px' }}
          onClick={() => setModalNewClient(true)}
          className="text-lg bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-2 border-b-4 border-green-700 hover:border-green-500 rounded">
          Nuevo Lote
        </button>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="grid gap-4">
            {
              getLotesByProject &&
              <Box sx={{ height: '60vh', overflow: 'auto' }}>
                <DataGrid
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                rows={formatRows(getLotesByProject)}
                columns={columns}
                pageSize={25}
                rowsPerPageOptions={[25]}
                experimentalFeatures={{ newEditingApi: true }}
                components={{
                  Toolbar: GridToolbar
                }}
              />
             </Box>
            }
        </div>
      </div>
      <NewLoteModal open={modalNewClient} handleClose={() => setModalNewClient(false)} />
    </div>
  )
}
