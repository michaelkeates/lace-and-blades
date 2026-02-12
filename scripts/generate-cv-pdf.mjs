import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function generatePDF() {
  const browser = await puppeteer.launch({
    headless: 'new'
    // `headless: true` (default) enables old Headless;
    // `headless: 'new'` enables new Headless;
    // `headless: false` enables “headful” mode.
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

  const url = 'http://www.michaelkeates.co.uk/about'

  await page.goto(url)

  //or, add a delay before generating the PDF (in milliseconds)
  //await page.waitForTimeout(2000)
  await page.waitForNetworkIdle(3000)

  //evaluate the page and remove unwanted elements
  await page.evaluate(() => {
    document.body.style.backgroundColor = '#ffffff'
    //const gridElement = document.querySelectorAll('.css-85h89v, .css-481av6')
    const gridElement2 = document.querySelectorAll('.css-1id2kv5')
    const gridElement3 = document.querySelectorAll('.css-vqf3rg, .css-1fj31y')
    const textSize = document.querySelectorAll(
      '.css-1oo097b, .chakra-heading.css-1vukcke, .chakra-badge.css-g6xq4p, .chakra-heading.css-1dilgbf, .chakra-heading.css-5cq7sr, .chakra-badge.css-ujcih5, .css-p6ed0u'
    )
    const textSize2 = document.querySelectorAll(
      '.css-14rgeuu, .css-9zshpp, .emoji_emailLink__rvK9O, .css-1dsdcac, .chakra-heading.css-1x30byp'
    )
    const textSize3 = document.querySelectorAll('.chakra-text.css-5m355k, .chakra-heading.css-17cjct2, .chakra-heading.css-9n0xbk, .chakra-heading.css-17wi6zd')
    const textSize4 = document.querySelectorAll(
      '.chakra-text.css-9c7r58, .chakra-text.css-1bgxado, .chakra-badge.css-13fucok'
    )
    const textSize5 = document.querySelectorAll(
      '.chakra-heading.css-kx7ixn, .emoji_emoji__vYFMy, .chakra-heading.css-kowkqe'
    )
    const textSize6 = document.querySelectorAll('.chakra-text.css-p23alj')
    const textColors = document.querySelectorAll(
      '.css-1oo097b, .css-kowkqe, .chakra-heading.css-17wi6zd, .css-14rgeuu, .chakra-text.css-5m355k, .chakra-heading.css-kx7ixn, .css-1jzpmk, .chakra-text.css-9c7r58, .chakra-heading.css-9n0xbk, .chakra-heading.css-17cjct2, .emoji_emailLink__rvK9O, .css-9zshpp, .chakra-divider.css-svjswr, .chakra-heading.css-1vukcke, .chakra-badge.css-1ajj9qg, .css-1dsdcac, .chakra-heading.css-1dilgbf'
    )
    const borderColor = document.querySelectorAll(
      '.css-svjswr, .chakra-divider.css-mzlxjy'
    )
    const imageSize = document.querySelectorAll('.grid-item-thumbnail')

    const customGridElements = document.querySelectorAll(
      '.css-9t4bud, .css-o75elv, .css-1id2kv5, .css-1oo097b, .css-13hhjt6, .css-1a0pxu, .css-1a0pxu, .css-jt83u2'
    )
    const customGridElements2 = document.querySelectorAll(
      '.css-kowkqe, .css-161046s, .css-gzapkn, .css-1vo7tkn, .css-9t4bud, .css-h47psn, .css-p77vvx'
    )
    const customGridElements3 = document.querySelectorAll(
      '.css-1k7klv9, .css-1oo097b, .css-13hhjt6, .chakra-heading.css-17cjct2, .chakra-divider.css-svjswr, .css-1dsdcac, .chakra-heading.css-9n0xbk, .css-1jzpmk'
    )

    const customGridElements4 = document.querySelectorAll(
      '.another-custom-grid, .css-1art13b'
    )

    const customGridElements5 = document.querySelectorAll(
      '.css-1dsdcac, .css-2lzsxm, .chakra-heading.css-5cq7sr, .chakra-heading.css-1x30byp, .chakra-heading.kowkqe'
    )

    const boxElements = document.querySelectorAll(
      '.css-1jzpmk, .css-o75elv, .css-1a0pxu, .css-n1k3mh'
    )

    //remove background and shadow
    const boxElement = document.querySelectorAll(
      '.css-fzwid6, .css-1a0pxu, .css-98n5v3, .css-19iosgf, .css-qt4sqs, .css-siq2cg, .css-o7muvo'
    )

    const badgeElement = document.querySelector('.chakra-badge.css-1ajj9qg')

    //remove anything with img tag
    const linkBoxElements = document.querySelectorAll(
      '.chakra-linkbox.css-16kwgao, .css-19v23ry'
    )

    const fontweight = document.querySelectorAll('.chakra-heading.css-1dilgbf, .chakra-heading.css-5cq7sr')

    const padding = document.querySelectorAll('.css-o7muvo')

    const profileimage = document.querySelectorAll('.css-s37q7k')

    const capitalize = document.querySelectorAll('.chakra-badge.css-13fucok, .css-13fucok')

    //next section

    //gridElement.forEach(gridElement => {
    //  //modify the grid template columns property to have 7 columns
    //  gridElement.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))'
    //})

    gridElement2.forEach(gridElement2 => {
      //modify the grid template columns property to have 7 columns
      gridElement2.style.gridTemplateColumns = 'repeat(9, minmax(0, 1fr))'
      //gridElement2.style.width = '70%' // Replace '100px' with your desired image width
      //gridElement2.style.height = '70%' // Replace '100px' with your desired image height
    })

    gridElement3.forEach(gridElement3 => {
      //modify the grid template columns property to have 4 columns
      gridElement3.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))'
    })

    textSize.forEach(textSize => {
      if (textSize.classList.contains('chakra-badge')) {
        textSize.style.fontSize = '8px' // Adjust the font size as needed
      }
      textSize.style.fontSize = '9px'
    })

    textSize2.forEach(textSize2 => {
      textSize2.style.fontSize = '8px'
    })

    textSize3.forEach(textSize3 => {
      if (textSize3.classList.contains('chakra-heading')) {
        textSize3.style.fontSize = '11px' // Adjust the font size as needed
      }
      textSize3.style.fontSize = '12px'
    })

    textSize4.forEach(textSize4 => {
      textSize4.style.fontSize = '7px'
    })

    textSize5.forEach(textSize5 => {
      textSize5.style.fontSize = '18px'
    })

    textSize6.forEach(textSize5 => {
      textSize5.style.fontSize = '8px'
    })

    textColors.forEach(textColor => {
      textColor.style.color = '#000000'
    })

    borderColor.forEach(borderColor => {
      borderColor.style.borderColor = 'rgba(0, 0, 0, 0.9)'
    })

    imageSize.forEach(imageSize => {
      imageSize.style.width = '60px'
      imageSize.style.height = '60px'
      //center image
      imageSize.style.marginLeft = 'auto'
      imageSize.style.marginRight = 'auto'
    })

    profileimage.forEach(profileimage => {
      profileimage.style.width = '80px'
      profileimage.style.height = '80px'
      //center image
      profileimage.style.marginLeft = 'auto'
      profileimage.style.marginRight = 'auto'
      //make image round
      profileimage.style.borderRadius = '50%'
    })

    const unwantedElements = document.querySelectorAll(
      '.model.css-14imgav, .css-fx26l1, .css-nkmf85, .css-owexls, .chakra-button.css-r7xd4a, .custom-grid, .css-3isgxm, .css-kjxakp, .emoji_emoji__vYFMy, .css-p77vvx, .chakra-divider.css-mzlxjy, .chakra-divider.css-evmj4r, .emoji_emoji__5Xz14'
    )

    customGridElements.forEach(element => {
      element.style.marginBottom = '2px'
      element.style.paddingBottom = '0px'
      element.style.background = 'transparent'
      element.style.boxShadow = 'none'
    })

    customGridElements2.forEach(element => {
      element.style.marginBottom = '0px'
      element.style.marginTop = '0px'
    })

    customGridElements3.forEach(element => {
      element.style.marginTop = '6px'
      element.style.marginBottom = '6px'
      element.style.paddingBottom = '0px'
    })

    customGridElements4.forEach(element => {
      element.style.marginBottom = '2px'
      element.style.marginTop = '2px'
    })

    customGridElements5.forEach(element => {
      //move text to left
      element.style.marginLeft = '-8px'
      element.style.marginTop = '2px'
    })

    unwantedElements.forEach(element => {
      element.remove()
    })

    boxElements.forEach(boxElement => {
      const title = boxElement.getAttribute('title')

      if (title) {
        boxElement.textContent = title
        boxElement.style.fontSize = '8px'
        boxElement.style.background = 'transparent'
        boxElement.style.boxShadow = 'none'
        boxElement.style.width = '100%'
        boxElement.style.padding = '0'
        boxElement.style.marginLeft = '-5px'
      }
    })

    boxElement.forEach(element => {
      element.style.background = 'transparent'
      element.style.boxShadow = 'none'
      element.style.marginBottom = '0px'
    })

    if (badgeElement) {
      //remove the background by setting the CSS variable '--badge-bg' to 'transparent'
      badgeElement.style.setProperty('--badge-bg', 'transparent')
    }

    linkBoxElements.forEach(linkBoxElement => {
      // Remove the <img> element inside the link box
      const imgElement = linkBoxElement.querySelector('img')
      if (imgElement) {
        imgElement.remove()
      }

      // Apply a negative margin to move the element up
      linkBoxElement.style.marginTop = '-25px' // Adjust the value as needed
    })

    fontweight.forEach(fontweight => {
      fontweight.style.fontWeight = '400'
    })

    padding.forEach(element => {
      element.style.padding = '0' //remove the padding
    })

    capitalize.forEach(element => {
      const words = element.textContent.split(' ');
    
      const capitalizedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
    
      element.textContent = capitalizedWords.join(' ');
    })
  })

  // Add a pseudo-element to the body to create the gap on every page
  await page.evaluate(() => {
    const style = document.createElement('style')
    style.textContent = `
          .chakra-divider.css-mzlxjy {
            margin: 0 !important; /* Override existing margin with !important */
          }
          .chakra-heading.css-5cq7sr {
            font-weight: 600 !important;
          }
          .chakra-heading.css-17cjct2 {
            font-weight: 600 !important;
          }
          .chakra-heading.css-17wi6zd {
            font-weight: 600 !important;
          }
          .chakra-heading.css-9n0xbk {
            font-weight: 600 !important;
          }
          .chakra-heading.css-kowkqe {
            margin-bottom: 2px !important;
          }
        }
      `
    document.head.appendChild(style)
  })

  // ✅ Add this right before page.pdf
  await page.addStyleTag({
    content: `
      @page {
        margin-top: 50mm;  /* space at the top of each page */
        margin-bottom: 50mm; /* space at the bottom of each page */
      }

      body {
        margin: 0 !important; /* prevent double spacing */
        padding-bottom: 40mm !important; /* add visual gap above page break */
      }
    `
  });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    // preferCSSPageSize: true, // optional, remove for consistent @page control
    quality: 100,
    margin: {
      // You can remove these if @page works fine,
      // or leave small values as a fallback
      top: '55mm',
      bottom: '85mm'
    }
  });

  await browser.close()

  // Save the PDF to the public folder
  const publicPath = path.join(process.cwd(), 'public')
  const filePath = path.join(publicPath, 'cv.pdf')
  fs.writeFileSync(filePath, pdfBuffer)
}

generatePDF().catch(error => {
  console.error('Error generating PDF:', error)
  process.exit(1)
})