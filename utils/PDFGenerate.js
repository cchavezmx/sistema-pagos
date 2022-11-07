
export const downloadPDF = async (id) => {
  const { data: pdf } = await fetch('/api/pdfgenerate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pago: '1234' })
  })
    .then(res => res.json())
    .then(res => res)

  // create a link to download the pdf
  const linkSource = `data:application/pdf;base64,${pdf}`
  const downloadLink = document.createElement('a')
  const fileName = 'test.pdf'

  downloadLink.href = linkSource
  downloadLink.download = fileName
  downloadLink.click()
}

export const previewPDF = async (id) => {
  const { data: pdf } = await fetch('/api/pdfgenerate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pago: '1234' })
  })
    .then(res => res.json())
    .then(res => res)

  // create a link to download the pdf
  const linkSource = `data:application/pdf;base64,${pdf}`
  const iframe = document.getElementById('pdf-anchore')
  iframe.src = linkSource
}
