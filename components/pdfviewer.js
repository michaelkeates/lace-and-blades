// components/PDFViewer.js
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, Text } from '@chakra-ui/react'

// Dynamically import react-pdf Document and Page
const PDFDocument = dynamic(() => import('react-pdf').then(mod => mod.Document), {
  ssr: false,
})
const PDFPage = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false,
})

export default function PDFViewer({ file, maxWidth = 800 }) {
  const [width, setWidth] = useState(0)

  // Track viewport width to scale PDF thumbnail
  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth * 0.95)
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Set PDF.js worker
  useEffect(() => {
    import('react-pdf').then(mod => {
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${mod.pdfjs.version}/pdf.worker.min.js`
    })
  }, [])

  if (width === 0) return <Text>Loading PDF...</Text>

  return (
    <Box my={4} overflowX="auto">
      <PDFDocument file={file} loading={<Text>Loading PDF...</Text>}>
        <PDFPage pageNumber={1} width={Math.min(width, maxWidth)} />
      </PDFDocument>
    </Box>
  )
}