import { PDF } from '../../graphql/query'
const API_URL = process.env.API_URL

export default async function pdfgenerate (req, res) {
  console.log('🚀 ~ file: pdfgenerate.js:5 ~ pdfgenerate ~ req', req.body)
  const { owner, pago } = req.body
  try {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: PDF, variables: { pago, owner } })
    })
      .then(r => r.json())
      .then(data => {
        return res.status(200).json(data)
      })

    // const { data } = await pdf.json()
    // console.log('🚀 ~ file: pdfgenerate.js:16 ~ pdfgenerate ~ data', data)
    // return res.status(200).json({ data: data.createPDF })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
}
