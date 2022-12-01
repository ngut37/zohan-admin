import React, { useMemo } from 'react';

import { HiOutlineLogout } from 'react-icons/hi';

import { messageIdConcat } from '@utils/message-id-concat';

import { Text, Link, Button } from '@atoms';

import { useAuth } from '@modules/root/context/auth';

import { Flex, HStack } from '@chakra-ui/react';

import { colors } from '@styles';

const m = messageIdConcat('navbar');

export const Navbar = () => {
  const { auth, logout } = useAuth();

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
      const { name } = auth || {};
      // TODO: use code below after implementing profile
      // const userAvatarUrl = user?.image || auth.avatarUrl;
      // const userAvatar = userAvatarUrl ? (
      //   <Flex borderRadius="50%" overflow="hidden" width="30px" height="30px">
      //     <img src={userAvatarUrl} />
      //   </Flex>
      // ) : (
      //   <HiOutlineUserCircle width="20px" color={colors.whitesmoke.hex()} />
      // );
      return (
        <>
          <Link href="/">
            <Text
              color="whitesmoke"
              fontSize="sm"
              message={{ text: 'Paleta' }}
            />
          </Link>
          <Link href="/venues">
            <Text
              color="whitesmoke"
              fontSize="sm"
              message={{ id: m('link.venues') }}
            />
          </Link>
          <Text fontWeight={600} color="white" message={{ text: name }} />
          <Button
            rightIcon={<HiOutlineLogout color="whitesmoke" />}
            variant="solid"
            onClick={logout}
            message={{ id: 'navbar.logout' }}
          ></Button>
        </>
      );
    }
  }, [auth]);

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
        {authLinks}
      </HStack>
    </Flex>
  );
};
