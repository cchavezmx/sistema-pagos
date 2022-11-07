import { PDF } from '../../graphql/query'
const API_URL = process.env.API_URL

export default async function pdfgenerate (req, res) {
  try {
    const pdf = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: PDF, variables: { pago: req.body.pago } })
    })

    const { data } = await pdf.json()
    return res.status(200).json({ data: data.createPDF })
  } catch (error) {
    console.log(error)
  }
}
