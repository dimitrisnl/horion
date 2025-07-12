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

interface InvitationWithAccountCreationEmail {
  url?: string;
  organizationName: string;
}

export const InvitationWithAccountCreationEmail = ({
  url,
  organizationName,
}: InvitationWithAccountCreationEmail) => (
  <Html>
    <Head />
    <Tailwind>
      <Body style={main}>
        <Preview>You&apos;re invited to join {organizationName}</Preview>
        <Container className="px-4">
          <Heading className="mt-8 text-xl">
            You&apos;ve been invited to join {organizationName}
          </Heading>
          <Section>
            <Text className="text-sm text-slate-600">
              You can use the link below to create your account and join the{" "}
              {organizationName} team.
              <br /> This link will expire in 7 days.
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

InvitationWithAccountCreationEmail.PreviewProps = {
  url: "",
  organizationName: "ACME Corp",
} as InvitationWithAccountCreationEmail;

export default InvitationWithAccountCreationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
