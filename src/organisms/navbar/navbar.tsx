import React, { useMemo } from 'react';

import { useRouter } from 'next/router';
import { HiOutlineLogout, HiOutlineUserCircle } from 'react-icons/hi';

import { messageIdConcat } from '@utils/message-id-concat';

import { Text, Link, Button } from '@atoms';

import { useAuth } from '@modules/root/context/auth';

import { Flex, HStack } from '@chakra-ui/react';

import { colors } from '@styles';

const m = messageIdConcat('navbar');

export const Navbar = () => {
  const { auth, logout } = useAuth();
  const router = useRouter();

  const authLinks = useMemo(() => {
    if (!auth)
      return (
        <HStack spacing="20px">
          <Link href="/login">
            <Text
              color="whitesmoke"
              fontSize="lg"
              message={{ id: 'navbar.login' }}
            />
          </Link>
          <Link href="/register">
            <Text
              color="whitesmoke"
              fontSize="lg"
              message={{ id: 'navbar.register' }}
            />
          </Link>
        </HStack>
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
      const isStaff = router.route.includes('/staff');
      const isVenue = router.route.includes('/venues');

      const userAvatar = (
        <HiOutlineUserCircle width="20px" color={colors.whitesmoke.hex()} />
      );
      return (
        <>
          <HStack spacing="20px">
            <Button onClick={() => router.push('/venues')} variant="link">
              <Text
                color="whitesmoke"
                fontSize="lg"
                message={{ id: m('link.venues') }}
                transition="border-bottom 0.2s"
                borderBottom={`1px solid ${
                  isVenue ? 'whitesmoke' : 'transparent'
                }`}
                _hover={{ borderBottom: '1px solid whitesmoke' }}
              />
            </Button>
            <Button onClick={() => router.push('/staff')} variant="link">
              <Text
                color="whitesmoke"
                fontSize="lg"
                message={{ id: m('link.staff') }}
                transition="border-bottom 0.2s"
                borderBottom={`1px solid ${
                  isStaff ? 'whitesmoke' : 'transparent'
                }`}
                _hover={{ borderBottom: '1px solid whitesmoke' }}
              />
            </Button>
          </HStack>
          <HStack>
            {userAvatar}
            <Text color="white" message={{ text: name }} />
            <Button
              rightIcon={<HiOutlineLogout color="whitesmoke" />}
              variant="solid"
              onClick={logout}
              message={{ id: 'navbar.logout' }}
            ></Button>
          </HStack>
        </>
      );
    }
  }, [router, auth]);

  return (
    <Flex
      bgColor={colors.teal_500.hex()}
      width="100%"
      height={70}
      justify="space-between"
      px={[4, 7]}
    >
      <HStack
        width="100%"
        spacing="20px"
        align="center"
        justifyContent="space-between"
      >
        <Flex align="center">
          <Link href="/">
            <Text
              type="heading"
              message={{ id: 'brand_name' }}
              size="md"
              color="whitesmoke"
            />
          </Link>
        </Flex>
        {authLinks}
      </HStack>
    </Flex>
  );
};
