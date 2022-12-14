// lotes por proyecto
import { useState } from 'react'
import useSWR from 'swr'
import { Box, Tooltip, Chip } from '@mui/material'
import { useRouter } from 'next/router'
import { DataGrid, esES, GridToolbar } from '@mui/x-data-grid'
import { numberFormat } from 'utils/NumberFormat'
import NewPagoModal from '@/components/Modals/NewPagoModal'
import { blueGrey, orange } from '@mui/material/colors'
import ModificarModal from '@/components/Modals/ModificarModal'
import fetcher from '@/components/fetcher'
import { toast } from 'react-toastify'
export default function LoteID () {
  const router = useRouter()
  const { clienteID, proyectoID, loteID, clienteName } = router.query
  console.log('🚀 ~ file: [clienteName].jsx ~ line 14 ~ LoteID ~  clienteID, proyectoID, loteID, clienteName', clienteID, proyectoID, loteID, clienteName)

  const { data: getAllPagosFromLote, mutate } = useSWR({
    key: '/api/getAllPagosFromLote',
    variables: {
      cliente: clienteID,
      proyecto: proyectoID,
      lote: loteID
    }
  })

  const handledPago = (idpago) => {
    try {
      console.log('🚀 ~ file: [clienteName].jsx:28 ~ handledPago ~ idpago', idpago)
      // TODO SE DEBE AGREAGAR INFORMACION ADICIONAL PARA EL PAGO
      // TODO ARREGLAR EL MODIFICAR PAGO
      const isPaid = fetcher({
        key: '/api/pagarPago',
        variables: {
          pago: idpago
        }
      })
      if (isPaid) {
        mutate()
      }
    } catch (error) {
      console.log('🚀 ~ file: [clienteName].jsx ~ line 37 ~ handledPago ~ error', error)
      toast('Error al pagar el pago', { type: 'error' })
    }
  }

  const ButtonView = (item) => {
    return (
    <div className="flex justify-center gap-1 w-[100vw]">
      <button
      onClick={() => handledPago(item.row._id)}
      disabled={item.row.isPaid}
      className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded disabled:opacity-25 disabled:cursor-not-allowed">
        Pagar
      </button>
      <button
      onClick={() => console.log(item)}
      disabled={!item.row.isPaid}
      className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-4 border-b-4 border-teal-700 hover:border-teal-500 rounded disabled:opacity-25 disabled:cursor-not-allowed">
        Imprimir
      </button>
      <ModificarModal data={item.row} />
    </div>
    )
  }

  const buttonRefText = (item) => {
    return (
      <Tooltip title={item.row.refPago}>
        <span>{item.row.refPago}</span>
      </Tooltip>
    )
  }

  const formatRows = (data) => {
    return data.map((item) => {
      return {
        ...item,
        id: item._id,
        folio: Number(item.folio),
        deposito: numberFormat(item.monto) || 0
      }
    })
  }

  const statusRows = ({ row }) => {
    const label = row.isPaid ? 'Pagado' : 'Pendiente'
    const color = row.isPaid ? 'success' : 'warning'

    return <Chip label={label} color={color} />
  }

  const tipoPagoRows = ({ row }) => {
    const label = row.tipoPago ?? 'unknown'

    const types = {
      mensualidad: { slug: 'Mensualidad', color: orange[400] },
      extra: { slug: 'Extra', color: 'success' },
      acreditado: { slug: 'Acreditado', color: 'danger' },
      unknown: { slug: 'Desconocido', color: 'warning' },
      saldoinicial: { slug: 'Saldo Inicial', color: blueGrey.A400 }
    }

    return <Chip label={types[label]?.slug} sx={{ backgroundColor: types[label]?.color, color: 'white' }} />
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, hide: true },
    { field: 'consecutivo', headerName: 'Folio', width: 100 },
    { field: 'folio', headerName: 'No. Pago', minWidth: 80 },
    { field: 'status', headerName: 'Estatus', width: 120, renderCell: statusRows },
    { field: 'refPago', headerName: 'Referencia', minWidth: 120, flex: 2, renderCell: buttonRefText },
    { field: 'tipoPago', headerName: 'Tipo de Pago', width: 140, renderCell: tipoPagoRows },
    { field: 'monto', headerName: 'deposito', width: 130 },
    { field: '', headerName: 'Acciones', minWidth: 320, flex: 1, renderCell: ButtonView, headerAlign: 'center' }
  ]

  const [openModal, setOpenModal] = useState(false)
  const toogleCloseModal = () => setOpenModal(!openModal)
  return (
    <div>
      <div className="subtitle_seccion mb-8">
        <span>
          <h6><strong className="text-slate-500">Detalle, Cliente: / </strong> {clienteName}</h6>
        </span>
        <div className="flex justify-center mt-3 gap-1">
        <button
          style={{ height: '40px', width: '200px' }}
          onClick={() => setOpenModal(true)}
          className="text-lg bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-2 border-b-4 border-green-700 hover:border-green-500 rounded">
          Nuevo pago
        </button>
        <button
          style={{ height: '40px', width: '200px' }}
          // onClick={() => setModalNewClient(true)}
          disabled
          className="text-lg bg-blue-500 hover:bg-blue-400-400 text-white font-bold py-1 px-2 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Generar reporte
        </button>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="grid gap-4">
            {
              getAllPagosFromLote &&
              <Box sx={{ height: '60vh', minWidth: '90vh' }}>
                <DataGrid
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                rows={formatRows(getAllPagosFromLote)}
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
      <NewPagoModal
        open={openModal}
        pagoData={router.query}
        toogleClose={toogleCloseModal}
        mutate={mutate}
      />
    </div>
  )
}
