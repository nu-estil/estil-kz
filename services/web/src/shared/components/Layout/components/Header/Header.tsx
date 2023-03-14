import AuthWrapper from '@/components/Elements/Button/AuthWrapper'
import Button from '@/components/Elements/Button/Button'
import LikeIcon from '@/components/Icon/LikeIcon'
import MenuIcon from '@/components/Icon/MenuIcon'
import SearchIcon from '@/components/Icon/SearchIcon'
import UserIcon from '@/components/Icon/UserIcon'
import { Title } from '@/components/Typography/Title'
import { config } from '@/config'
import { useAuth } from '@/hooks/useAuth'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useRef, useState } from 'react'
import DesktopNavbar from './components/DesktopNavbar/DesktopNavbar'
import HeaderDropdown from './components/HeaderDropdown/HeaderDropdown'
import MobileNavbar from './components/MobileNavbar/MobileNavbar'
import SearchBar from './components/SearchBar/SearchBar'
import { useNavbar } from './hooks/useNavbar'
import * as Styled from './styles'

function Header() {
  const { isLoggedIn, user } = useAuth()
  const router = useRouter()
  const { open, onClose, onOpen } = useNavbar()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setDropdownOpen(false))

  const isLoginPage = router.pathname === '/auth/login'

  return (
    <Styled.Header>
      <Styled.HeaderWrapper>
        <Styled.IconWrapper className="menu-icon" onClick={onOpen}>
          <MenuIcon />
        </Styled.IconWrapper>
        <Styled.LogoWrapper>
          <Link href="/">
            <Title color="secondary">{config.seo.meta.og.siteName}</Title>
          </Link>
        </Styled.LogoWrapper>
        <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
        <Styled.WidgetsWrapper>
          <Styled.IconWrapper className="search-icon">
            <SearchIcon onClick={() => setSearchOpen(true)} />
          </Styled.IconWrapper>
          <Styled.IconWrapper className="like-icon">
            <AuthWrapper onClick={() => router.push('/products/favorite')}>
              <LikeIcon />
            </AuthWrapper>
          </Styled.IconWrapper>
          {user && !isLoginPage && (
            <Styled.IconWrapper className="user-icon" ref={ref}>
              <AuthWrapper onClick={() => setDropdownOpen(!dropdownOpen)}>
                <UserIcon />
              </AuthWrapper>
              <HeaderDropdown
                user={user}
                open={dropdownOpen}
                onClose={() => setDropdownOpen(false)}
              />
            </Styled.IconWrapper>
          )}
          {!isLoggedIn && !isLoginPage && (
            <Link href={'/auth/login'}>
              <a>
                <Button className="login-button">Войти</Button>
              </a>
            </Link>
          )}
        </Styled.WidgetsWrapper>
      </Styled.HeaderWrapper>
      <MobileNavbar open={open} onClose={onClose} />
      <DesktopNavbar />
    </Styled.Header>
  )
}

export default Header
