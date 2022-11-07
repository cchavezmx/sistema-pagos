import { gql } from 'graphql-request'

const PDF = `
mutation CreatePDF($pago: ID!) {
  createPDF(pago: $pago)
}
`

const GET_OWNERS = gql`
  query Owners {
    owners {
      _id
      isActive
      name
      slug
      rfc
      razonSocial
    }
  }
`

const GET_PROYECTOS_BY_OWNER = gql`
  query GetProyectosByOwner($owner: ID!) {
    getProyectosByOwner(owner: $owner) {
      _id
      isActive
      address
      title
      img
      owner {
        name
        slug
        rfc
        razonSocial
        _id
      }
    }
  }
`

const GET_LOTES_BY_PROYECTO = gql`
  query GetLotesByProyecto($proyecto: ID!) {
    getLotesByProject(proyecto: $proyecto) {
      isActive
      proyecto    
      lote
      manzana
      precioTotal
      enganche
      financiamiento
      fraccionamiento
      plazo
      mensualidad
      inicioContrato
      _id
      clienteData {
        name,
        _id 
      }      
    }
  }
`

const GET_LOTE_DETAIL = gql`
query Query($lote: ID!, $proyecto: ID!, $cliente: ID!) {
  getAllPagosFromLote(lote: $lote, proyecto: $proyecto, cliente: $cliente) {
    _id
    isActive
    status    
    folio
    consecutivo
    refPago
    deposito
    ctaBancaria
    fraccionamiento
    banco
    tipoPago
    fechaPago
    refBanco
    clienteData {
      name
    }
    proyectoData {
      title
    }
    ownerData {
      name
    }
  }
}
`

const CREATE_PROYECTO = gql`
  mutation CreateProyecto($proyecto: ProyectoInput) {
    createProyecto(proyecto: $proyecto) {
      isActive
    }
  }
`

const CREATE_LOTE = gql`
  mutation CreateLote($newClientUpsert: Boolean!, $lote: LoteInput) {
    createLote(newClientUpsert: $newClientUpsert, lote: $lote) {
      _id
      isActive
    }
  }      
`

const GET_EMAILS_CLIENTES = gql`
  query GetAllClients {
    getAllClients {
      _id
      name
    }
  }
`

const WATCH_LOTE_INFO = gql`
  query WatchLoteInfo($lote: String!, $manzana: String!, $fraccionamiento: String!, $proyectoId: ID) {
    watchLoteInfo(lote: $lote, manzana: $manzana, fraccionamiento: $fraccionamiento, proyectoId: $proyectoId) {    
      isActive
      lote
      cliente
      proyecto
      manzana
      clienteData {
        name
      }
      proyectoData {
        title
      }
    }
  }
`

export {
  PDF,
  GET_OWNERS,
  GET_PROYECTOS_BY_OWNER,
  GET_LOTES_BY_PROYECTO,
  GET_LOTE_DETAIL,
  CREATE_PROYECTO,
  CREATE_LOTE,
  GET_EMAILS_CLIENTES,
  WATCH_LOTE_INFO
}
