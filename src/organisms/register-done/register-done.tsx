import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { HiArrowSmLeft, HiInformationCircle } from 'react-icons/hi';

import { messageIdConcat } from '@utils/message-id-concat';

import { Button, Link, Text } from '@atoms';

import { Divider, Flex, VStack } from '@chakra-ui/react';

import { colors } from '@styles';

const m = messageIdConcat('register_done');

export const RegisterDone = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (email) return;

    if (router.query.email && typeof router.query.email === 'string') {
      setEmail(router.query.email);
    }
  }, [email, router]);

  useEffect(() => {
    if (email) router.replace('/register-done');
  }, [email]);

  return (
    <Flex
      my="40px"
      px="10px"
      width="100%"
      minH="80vh"
      justify="center"
      align="center"
    >
      <Flex w="100%" maxW="1200px" justify="center" align="center">
        <Flex
          minW="400px"
          py="40px"
          px={['20px', '40px']}
          direction="column"
          justify="center"
          align="center"
          bgColor={colors.white.hex()}
          boxShadow="md"
          border="1px"
          borderColor="gray.100"
          borderRadius="md"
        >
          <HiInformationCircle
            width="20px"
            color={colors.blue_600.hex()}
            size="100px"
          />
          <Text type="heading" message={{ id: m('title') }} marginTop="30px" />
          <VStack
            direction="column"
            justify="center"
            align="center"
            width="100%"
            maxW="350px"
            marginTop="30px"
            textAlign="center"
          >
            <Text message={{ id: m('subtitle'), values: { email } }} />
            <Text
              as="h2"
              fontSize="24px"
              fontWeight="bold"
              message={{ text: email }}
            />
          </VStack>
          <Divider orientation="horizontal" my="10px" />
          <Link href="/login">
            <Button
              leftIcon={<HiArrowSmLeft width="20px" />}
              variant="ghost"
              type="submit"
              message={{ id: m('button.return_to_login_screen') }}
            />
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};
