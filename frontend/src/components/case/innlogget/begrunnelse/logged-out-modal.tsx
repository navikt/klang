import { useTranslation } from '@app/language/use-translation';
import { AppEventEnum } from '@app/logging/action';
import { appEvent } from '@app/logging/logger';
import { useAppSelector } from '@app/redux/configure-store';
import { getLoginRedirectPath } from '@app/user/login';
import { BodyShort, Button, Dialog, HStack, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';
import { Link } from 'react-router';

export const LoggedOutModal = () => {
  const { show } = useAppSelector(({ loggedOutModal }) => loggedOutModal);
  const { skjema } = useTranslation();

  useEffect(() => {
    if (show) {
      appEvent(AppEventEnum.LOGGED_OUT_MODAL_OPEN);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  const { loggedOut, login, logout, yes } = skjema.begrunnelse.loggedOutModal;

  return (
    <Dialog open>
      <Dialog.Popup style={{ padding: 'var(--ax-space-20)' }}>
        <Dialog.Header withClosebutton={false}>
          <Dialog.Title>{loggedOut}</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap="space-16">
            <BodyShort>{login}</BodyShort>

            <HStack gap="space-16">
              <Button as={Link} to={getLoginRedirectPath()}>
                {yes}
              </Button>
              <Button as={Link} to="/oauth2/logout" variant="secondary">
                {logout}
              </Button>
            </HStack>
          </VStack>
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  );
};
