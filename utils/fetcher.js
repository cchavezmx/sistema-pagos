import { GraphQLClient } from 'graphql-request'
import {
  GET_OWNERS,
  GET_PROYECTOS_BY_OWNER,
  GET_LOTES_BY_PROYECTO,
  GET_LOTE_DETAIL,
  CREATE_PROYECTO,
  CREATE_LOTE,
  GET_EMAILS_CLIENTES,
  WATCH_LOTE_INFO
} from '../graphql/query'
const API_URL = process.env.NEXT_PUBLIC_API_URL

const graphQLClient = new GraphQLClient(API_URL)

const endpoints = {
  '/api/owners': GET_OWNERS,
  '/api/getProyectosByOwner': GET_PROYECTOS_BY_OWNER,
  '/api/getLotesByProject': GET_LOTES_BY_PROYECTO,
  '/api/getAllPagosFromLote': GET_LOTE_DETAIL,
  '/api/createProyecto': CREATE_PROYECTO,
  '/api/createLote': CREATE_LOTE,
  '/api/getAllClients': GET_EMAILS_CLIENTES,
  '/api/watchLoteInfo': WATCH_LOTE_INFO
}

export default async function fetcher ({ key, variables }) {
  console.log('🚀 ~ file: fetcher.js ~ line 22 ~ fetcher ~ key, variables', key, variables)
  const RESPONSE = endpoints[key]
  const [, queryName] = key.split('/api/')
  try {
    const data = await graphQLClient.request(RESPONSE, variables)
      .then((data) => data)

    if (queryName === 'owners' && data.owners.length === 0) {
      return {
        data: {
          owners: []
        }
      }
    }

    if (queryName === 'getProyectosByOwner' && data.getProyectosByOwner.length === 0) {
      return {
        data: {
          getProyectosByOwner: []
        }
      }
    }

    if (queryName === 'getClienteLoteDetail' && data.getAllPagosFromLote.length === 0) {
      return {
        data: {
          getAllPagosFromLote: []
        }
      }
    }

    console.log('🚀 ~ file: fetcher.js ~ line 22 ~ fetcher ~ data', data)
    return data[queryName]
  } catch (error) {
    console.log('🚀 ~ file: fetcher.js ~ line 22 ~ fetcher ~ error', error)
    return error
  }
}
