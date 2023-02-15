import { chromium } from 'playwright'

export default async function handler (req, res) {
  const { title, content = '' } = req.body
  try {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    // const html = await createInvoice(pago, owner)
    const html = `
    <!DOCTYPE html>        
    <html>
      <head>
        <meta charset="utf-8">
        <title>PDF Result Template</title>
        <style>
          body {
            display: grid;  
            justify-content: center;        
            position: relative;
          }     
          
          div {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-direction: column;
          }
        </style>
      </head>
      <body>
        <h1 style="text-align: center">${title}</h1>
        <div>
          ${content}
        </div>    
      </body>
    </html>
    `
    await page.setContent(html)

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: true,
      margin: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })

    await browser.close()
    // convert pdf to base64
    const base64 = pdf.toString('base64')
    return res.status(200).json({ pdf: base64 })
  } catch (error) {
    console.log(error)
  }
}
