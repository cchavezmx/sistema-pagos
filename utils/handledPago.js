// import { saveAs } from 'file-saver'

export const handledPago = (pago) => {
  const { _id } = pago.row
  const currentOwner = localStorage.getItem('owner')
  fetch('/api/pdfgenerate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pago: _id,
      owner: JSON.parse(currentOwner)
    })
  }).then(res => res.json())
    .then(data => {
      const base64 = Buffer.from(data.data.createPDF, 'base64')
      const blob = new Blob([base64], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      window.open(url)
    })
}
