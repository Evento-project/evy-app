import { Container, Flex, Link, SimpleGrid, Text } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import NextLink from 'next/link'
import React from 'react'
import { LocalFaucetButton } from '../LocalFaucetButton'
import { Head, MetaProps } from './Head'

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Container maxWidth="container.xl">
          <SimpleGrid
            columns={[1, 1, 1, 2]}
            alignItems="center"
            justifyContent="space-between"
            py="16"
          >
            <Flex py={[3, null, null, 0]}>
              <NextLink href="/" passHref legacyBehavior>
                <Link px="4" py="1" fontSize={70} backgroundColor={"yellow.100"} fontWeight="bold" >
                  Evy
                </Link>
              </NextLink>
              <NextLink href="/events" passHref legacyBehavior>
                <Link px="4" py="1" fontWeight="bold" >
                  Events
                </Link>
              </NextLink>
            </Flex>
            <Flex
              order={[-1, null, null, 2]}
              alignItems={'center'}
              justifyContent={['flex-start', null, null, 'flex-end']}
            >
              <ConnectButton />
            </Flex>
          </SimpleGrid>
        </Container>
      </header>
      <main>
        <Container maxWidth="container.xl">{children}</Container>
      </main>
      <footer>
        <Container mt="8" py="8" maxWidth="container.xl">
        </Container>
      </footer>
    </>
  )
}
