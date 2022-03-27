import React, { useCallback, useContext, useMemo } from 'react';

import { HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi';
import { signOut, useSession } from 'next-auth/client';

import { logout } from '@api/auth';

import { Text, Link, Button } from '@atoms';

import { AuthContext } from '@modules/root/context/auth';

import { Flex, HStack } from '@chakra-ui/react';

import { colors } from '@styles';

export const Navbar = () => {
  const { auth, authenticate } = useContext(AuthContext);
  const [session] = useSession();

  const requestLogout = useCallback(async () => {
    await signOut();
    await logout();
    await authenticate();
  }, []);

  const authLinks = useMemo(() => {
    if (!auth)
      return (
        <>
          <Link href="/login">
            <Text
              color="whitesmoke"
              fontSize="sm"
              message={{ id: 'navbar.login' }}
            />
          </Link>
          <Link href="/register">
            <Text
              color="whitesmoke"
              fontSize="sm"
              message={{ id: 'navbar.register' }}
            />
          </Link>
        </>
      );
    else {
      const { user } = session || {};
      const userAvatarUrl = user?.image || auth.avatarUrl;
      const userAvatar = userAvatarUrl ? (
        <Flex borderRadius="50%" overflow="hidden" width="30px" height="30px">
          <img src={userAvatarUrl} />
        </Flex>
      ) : (
        <HiOutlineUserCircle width="20px" color={colors.whitesmoke.hex()} />
      );
      return (
        <>
          {userAvatar}
          <Button
            rightIcon={<HiOutlineLogout color="whitesmoke" />}
            variant="solid"
            onClick={requestLogout}
            message={{ id: 'navbar.logout' }}
          ></Button>
        </>
      );
    }
  }, [auth, session]);

  return (
    <Flex
      bgColor={colors.teal_500.hex()}
      width="100%"
      height={70}
      justify="space-between"
      px={[4, 7]}
    >
      <Flex width={600} justify="space-between" align="center">
        <Link href="/">
          <Text
            type="heading"
            message={{ id: 'brand_name' }}
            size="md"
            color="whitesmoke"
          />
        </Link>
      </Flex>
      <HStack
        minWidth={[180, 200]}
        spacing="20px"
        align="center"
        justifyContent="flex-end"
      >
        <Link href="/component-pallette">
          <Text color="whitesmoke" fontSize="sm" message={{ text: 'Paleta' }} />
        </Link>
        {authLinks}
      </HStack>
    </Flex>
  );
};
