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

interface InvitationWithoutAccountCreationEmail {
  url?: string;
  organizationName: string;
}

export const InvitationWithoutAccountCreationEmail = ({
  url,
  organizationName,
}: InvitationWithoutAccountCreationEmail) => (
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
              You can accept or decline the invitation from your account
              settings.
            </Text>
            <Text className="text-sm text-slate-600">
              <Button
                className="mx-auto box-border rounded-[8px] bg-slate-900 px-2.5 py-2 text-center font-semibold text-white"
                href={url}
              >
                Click here to view your invitations
              </Button>
            </Text>
          </Section>
          <Section></Section>
          <Text className="text-sm text-slate-600">Best, Dimitris</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

InvitationWithoutAccountCreationEmail.PreviewProps = {
  url: "",
  organizationName: "ACME Corp",
} as InvitationWithoutAccountCreationEmail;

export default InvitationWithoutAccountCreationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};
