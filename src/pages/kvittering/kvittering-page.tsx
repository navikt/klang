import React, { useState, useEffect } from 'react';
import Kvittering from '../../components/kvittering/kvittering';
import { useSelector } from 'react-redux';
import { Store } from '../../store/reducer';
import KvitteringLoading from '../../components/kvittering/kvitteringLoading';
import { getJournalpostId, FinalizedKlage } from '../../services/klageService';
import { StaticContext } from 'react-router';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { logError } from '../../utils/logger/frontendLogger';

const KvitteringPage = (props: RouteComponentProps<{}, StaticContext, FinalizedKlage>) => {
    const [waitingForJoark, setWaitingForJoark] = useState<boolean>(true);
    const [informStillWorking, setInformStillWorking] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [journalPostId, setJournalPostId] = useState<string>('');

    const { activeKlage } = useSelector((state: Store) => state);

    useEffect(() => {
        if (!activeKlage.id) {
            return;
        }

        // Melding om at den fortsatt jobber etter 8 sek.
        const stillWorkingTimerId = setTimeout(() => setInformStillWorking(true), 8000);

        waitForJournalpostId(activeKlage.id)
            .then(journalpostId => {
                setSuccess(true);
                setJournalPostId(journalpostId);
            })
            .catch((err: Error) => logError(err))
            .finally(() => {
                setWaitingForJoark(false);
                clearTimeout(stillWorkingTimerId);
            });

        // Cleanup function.
        return () => clearTimeout(stillWorkingTimerId);
    }, [activeKlage.id]);

    if (!activeKlage.id) {
        return <Redirect to="/" />;
    } else {
        if (waitingForJoark) {
            return <KvitteringLoading informStillWorking={informStillWorking} />;
        } else {
            return (
                <Kvittering
                    klageId={activeKlage.id}
                    journalPostId={journalPostId}
                    finalizedDate={props.location.state.finalizedDate}
                    success={success}
                />
            );
        }
    }
};

export default KvitteringPage;

const MAX_TRIES = 15;
const waitForJournalpostId = async (klageId: number) => {
    let tries = 0;
    while (klageId && tries < MAX_TRIES) {
        tries++;
        try {
            const journalPostId = await getJournalpostId(klageId);
            if (journalPostId.length !== 0) {
                return journalPostId;
            }

            // Wait one second before next attempt.
            await new Promise<never>(resolve => setTimeout(resolve, 1000));
        } catch (err) {
            logError(err, `Failed to get journalpost ID for klage ${klageId}.`);
        }
    }
    throw new Error('Get journalpost ID timed out after 15 seconds.');
};
