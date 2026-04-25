import Link from 'next/link'
import Image from 'next/image'
import styled from '@emotion/styled'

const LogoBox = styled.span`
margin-top: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;         /* match navbar buttons */
  width: 40px;          /* square container */
  line-height: 1;
  transition: transform 0.2s;

  img {
    display: block;      /* prevent baseline offset */
    height: 100%;
    width: auto;
    border-radius: 4px;
    transition: transform 0.2s;
  }

  &:hover img {
    transform: scale(1.2);
  }
`

const Logo = () => {
  const logo = `/images/logo.png`

  return (
    <Link href="/" scroll={false}>
      <LogoBox>
        <Image src={logo} alt="logo" width={40} height={40} />
      </LogoBox>
    </Link>
  )
}

export default Logo