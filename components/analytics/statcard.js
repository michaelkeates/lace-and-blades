import { Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react'

const StatCard = ({ label, value, valueColor }) => {
  const cardBg = useColorModeValue('whiteAlpha.500', 'whiteAlpha.200')
  const borderColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')

  return (
    <Stat
      p={5}
      bg={cardBg}
      backdropFilter="blur(10px)"
      css={{ backdropFilter: 'blur(10px)' }}
      borderRadius="20px"
    >
      <StatLabel fontSize="xs" opacity={0.7} textTransform="uppercase">
        {label}
      </StatLabel>
      <StatNumber fontSize="3xl" fontWeight="300" color={valueColor}>
        {value}
      </StatNumber>
    </Stat>
  )
}

export default StatCard