import { IconButton, useColorModeValue } from '@chakra-ui/react'

const LinktrButton = () => {
  const bg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const color = useColorModeValue('blackAlpha.900', 'whiteAlpha.600')

  return (
    <IconButton
      as="a" // <-- render as real <a>
      href="https://linktr.ee/laceandblades/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Linktr Button"
      bg={bg}
      css={{ backdropFilter: 'blur(10px)' }}
      padding="10px"
      boxShadow="0px 0px 12px 0px rgba(0,0,0,0.05)"
      color={color}
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M128 237.4h125.8L164.4 152l49.5-51l85.2 87.8V64H373v124.8l85.2-87.6l49.4 50.8l-89.4 85.2h125.7v70.5H417.5l90 87.6l-49.3 49.8l-122.2-123l-122.2 123l-49.5-49.6l90-87.6H127.9v-70.5zm170.9 171.4h73.9V576h-73.9z"/>
        </svg>
      }
    />
  )
}

export default LinktrButton