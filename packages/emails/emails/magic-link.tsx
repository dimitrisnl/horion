import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  url?: string;
}

export const MagicLinkEmail = ({url}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body style={main}>
        <Preview>Log in with this magic link.</Preview>
        <Container className="px-4">
          <Heading className="mt-8 text-xl">
            Here&apos;s your magic link
          </Heading>
          <Section>
            <Text className="text-sm text-slate-600">
              You can use this link to log in to your account. <br />
              It will expire in 5 minutes, so please use it soon.
            </Text>
            <Text className="text-sm text-slate-600">
              <Button
                className="mx-auto box-border rounded-[8px] bg-slate-900 px-2.5 py-2 text-center font-semibold text-white"
                href={url}
              >
                Click here to sign in
              </Button>
            </Text>
          </Section>
          <Section>
            <Text className="text-xs text-slate-600">
              If you didn&apos;t request this, please ignore this email.
            </Text>
          </Section>
          <Text className="text-sm text-slate-600">Best, Dimitris</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

MagicLinkEmail.PreviewProps = {
  url: "",
} as MagicLinkEmailProps;

export default MagicLinkEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
