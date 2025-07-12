import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const WelcomeEmail = () => (
  <Html>
    <Head />
    <Tailwind>
      <Body style={main}>
        <Preview>Welcome to Horion!</Preview>
        <Container className="px-4">
          <Heading className="mt-8 text-xl">
            Welcome, and a quick question!
          </Heading>
          <Section>
            <Text className="text-sm text-slate-600">
              Thank you for signing up for Horion!
              <br /> I&apos;m Dimitrios and I&apos;m excited to have you on
              board.
            </Text>
            <Text className="text-sm text-slate-600">
              <span className="font-semibold">
                If you don&apos;t mind, why did you sign up? What brought you
                here?
              </span>
              <br />
              Just hit reply and let me know. I read and reply to every single
              email.
            </Text>
          </Section>
          <Text className="text-sm text-slate-600">Best, Dimitris</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

WelcomeEmail.PreviewProps = {};

export default WelcomeEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
