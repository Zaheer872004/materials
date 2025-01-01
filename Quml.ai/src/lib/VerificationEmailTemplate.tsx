import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';
import * as React from 'react';

enum Role {
  'STUDENT',
  'RECRUITER',
}

interface VerificationEmailProps {
  name?: string;
  otp?: string;
  role?: Role;
}

const VerificationEmailTemplate = ({ name = 'User', otp = '123456', role }: VerificationEmailProps) => {
  const previewText = `Verification Code for Your Registration`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-[#f4f4f4] font-sans p-4">
          <Container className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <Section className="p-6 text-center">
              <Heading className="text-xl font-semibold mb-4">
                Quml Application | Verification Code
              </Heading>
              <Text className="text-sm text-gray-600">
                Hello <strong>{name}</strong>,
              </Text>
              <Text className="text-sm text-gray-600 mt-2">
                Thank you for registering. Please use the following verification code to complete your
                registration:
              </Text>
              <Text className="text-2xl font-bold text-blue-600 my-4">{otp}</Text>
              <Text className="text-sm text-gray-600">
                Your role is: <strong>{role}</strong>
              </Text>
              <Text className="text-sm text-gray-600 mt-6">
                If you did not request this code, please ignore this email.
              </Text>
              <Text className="text-sm text-gray-600 mt-6">
                By the way, I'm Zaheer Khan. You can contact me at{' '}
                <strong>
                  <a href="mailto:zaheer.224246108@vcet.edu.in" className="text-blue-500">
                    zaheer.224246108@vcet.edu.in
                  </a>
                </strong>{' '}
                for freelancing projects.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmailTemplate;
