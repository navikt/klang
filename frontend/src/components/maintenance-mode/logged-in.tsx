import { MaintenanceAlert } from '@app/components/maintenance-mode/alert';
import { useFeatureFlag } from '@app/hooks/use-feature-flag';
import { useTranslation } from '@app/language/use-translation';
import { GlobalAlert, HStack } from '@navikt/ds-react';
import { Outlet } from 'react-router-dom';

export const LoggedInMaintenanceMode = () => {
  const isMaintenanceMode = useFeatureFlag('klang-maintenance-mode');
  const isMaintenanceWarning = useFeatureFlag('klang-maintenance-warning');
  const { common } = useTranslation();

  if (isMaintenanceMode) {
    return <MaintenanceAlert heading={common.maintenance.title} messages={common.maintenance.logged_in} />;
  }

  if (isMaintenanceWarning) {
    return (
      <>
        <HStack justify="center" paddingBlock="space-16">
          <GlobalAlert status="announcement" centered>
            <GlobalAlert.Header>
              <GlobalAlert.Title>{common.maintenance_warning.title}</GlobalAlert.Title>
            </GlobalAlert.Header>

            <GlobalAlert.Content>{common.maintenance_warning.message}</GlobalAlert.Content>
          </GlobalAlert>
        </HStack>

        <Outlet />
      </>
    );
  }

  return <Outlet />;
};
