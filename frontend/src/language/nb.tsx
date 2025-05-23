import { PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { ExternalLink } from '@app/components/link/link';
import type { Innsendingsytelse } from '@app/innsendingsytelser/innsendingsytelser';
import { ErrorMessageKeys } from '@app/language/error-messages';
import { CaseStatus, CaseType, Reason, getEttersendelsePath } from '@app/redux-api/case/types';
import { Link } from '@navikt/ds-react';
import { format } from 'date-fns';
import { Link as ReactRouterLink } from 'react-router-dom';

export type Translations = typeof nb;

export const nb = {
  skjema: {
    steps: {
      [CaseType.KLAGE]: ['Begrunnelse', 'Oppsummering', 'Innsending'],
      [CaseType.ANKE]: ['Begrunnelse', 'Oppsummering', 'Innsending'],
      [CaseType.ETTERSENDELSE_KLAGE]: ['Ettersendelse', 'Oppsummering', 'Innsending'],
      [CaseType.ETTERSENDELSE_ANKE]: ['Ettersendelse', 'Oppsummering', 'Innsending'],
    },
    employer_info: {
      [CaseType.KLAGE]:
        'Hvis du er en fullmektig eller en arbeidsgiver som skal klage, må du logge ut og sende klagen i posten. Du legger inn fødselsnummeret eller D-nummeret til den vedtaket gjelder for, skriver ut klagen og signerer som fullmektig eller arbeidsgiver.',
      [CaseType.ANKE]:
        'Hvis du er en fullmektig eller en arbeidsgiver som skal anke, må du logge ut og sende anken i posten. Du legger inn fødselsnummeret eller D-nummeret til den vedtaket gjelder for, skriver ut anken og signerer som fullmektig eller arbeidsgiver.',
      [CaseType.ETTERSENDELSE_KLAGE]:
        'Hvis du er en fullmektig eller en arbeidsgiver som skal ettersende dokumentasjon, må du logge ut og sende dokumentasjonen i posten. Du legger inn fødselsnummeret eller D-nummeret til den vedtaket gjelder for, skriver ut dokumentasjonen og signerer som fullmektig eller arbeidsgiver.',
      [CaseType.ETTERSENDELSE_ANKE]:
        'Hvis du er en fullmektig eller en arbeidsgiver som skal ettersende dokumentasjon, må du logge ut og sende dokumentasjonen i posten. Du legger inn fødselsnummeret eller D-nummeret til den vedtaket gjelder for, skriver ut dokumentasjonen og signerer som fullmektig eller arbeidsgiver.',
    },
    common: {
      title_fragment: {
        [CaseType.KLAGE]: 'klage',
        [CaseType.ANKE]: 'anke',
        [CaseType.ETTERSENDELSE_KLAGE]: 'ettersendelse for klage',
        [CaseType.ETTERSENDELSE_ANKE]: 'ettersendelse for anke',
      },
      page_title: {
        [CaseType.KLAGE]: 'Klage på vedtak',
        [CaseType.ANKE]: 'Anke på vedtak',
        [CaseType.ETTERSENDELSE_KLAGE]: 'Ettersend dokumentasjon til klage',
        [CaseType.ETTERSENDELSE_ANKE]: 'Ettersend dokumentasjon til anke',
      },
    },
    begrunnelse: {
      loggedOutModal: {
        loggedOut: 'Du ser ut til å ha blitt logget ut',
        login: 'Vil du forsøke å logge inn igjen?',
        yes: 'Ja',
        logout: 'Logg ut',
      },
      autosave: {
        tooltip: 'Vi lagrer endringene dine automatisk.',
        saved: 'Sist lagret',
        failed: 'Kunne ikke lagre',
      },
      attachments: {
        clear_errors: 'Fjern feilmeldinger',
        title: 'Vedlegg',
        upload_button_text: 'Last opp nytt vedlegg',
        description: 'Har du informasjon du ønsker å legge ved, laster du det opp her.',
        supported_types: [
          <span key="1">Filtyper som støttes: </span>,
          <span key="2">
            <b>PNG</b>
          </span>,
          <span key="3">, </span>,
          <span key="4">
            <b>JPEG</b>
          </span>,
          <span key="5"> og </span>,
          <span key="6">
            <b>PDF</b>
          </span>,
          <span key="7">.</span>,
        ],
        size_limit:
          'Filstørrelsen kan ikke være større enn 8 MB, og total størrelse av alle vedlegg kan ikke være større enn 32 MB.',
      },
      saksnummer: {
        title: 'Saksnummer (valgfri)',
        internalTitle: 'Saksnummer',
        change: 'Endre',
      },
      reasons: {
        title: {
          [CaseType.KLAGE]: 'Hva gjelder klagen? (valgfri)',
        },
        texts: {
          [Reason.AVSLAG_PAA_SOKNAD]: 'Jeg har fått avslag på søknaden min',
          [Reason.FOR_LITE_UTBETALT]: 'Jeg har fått for lite utbetalt',
          [Reason.UENIG_I_NOE_ANNET]: 'Jeg er uenig i noe annet i vedtaket mitt',
          [Reason.UENIG_I_VEDTAK_OM_TILBAKEBETALING]: 'Jeg er uenig i vedtaket om tilbakebetaling',
        },
      },
      vedtak_date: {
        title: {
          [CaseType.KLAGE]: 'Vedtaksdato (valgfri)',
          [CaseType.ANKE]: 'Dato for klagevedtaket fra Nav klageinstans',
          [CaseType.ETTERSENDELSE_KLAGE]: 'Vedtaksdato (valgfri)',
          [CaseType.ETTERSENDELSE_ANKE]: 'Dato for klagevedtaket fra Nav klageinstans',
        },
      },
      klageenhet: {
        radio_title:
          'Har du mottatt et brev fra Nav klageinstans eller en annen enhet i Nav om at saken din er sendt til Nav klageinstans?',
      },
      begrunnelse_text: {
        title: {
          [CaseType.KLAGE]: 'Hvorfor er du uenig?',
          [CaseType.ANKE]: 'Hvorfor er du uenig i klagevedtaket?',
          [CaseType.ETTERSENDELSE_KLAGE]: 'Har du noe å legge til? (valgfri)',
          [CaseType.ETTERSENDELSE_ANKE]: 'Har du noe å legge til? (valgfri)',
        },
        description: {
          [CaseType.KLAGE]:
            'Forklar med dine egne ord hva som gjør at du er uenig og hva du ønsker endret. Legg ved dokumenter som kan vise Nav hvorfor du er uenig.',
          [CaseType.ANKE]:
            'Forklar med dine egne ord hva som gjør at du er uenig i klagevedtaket og hva du ønsker endret. Legg ved eventuelle dokumenter du ønsker skal følge saken din til Trygderetten.',
          [CaseType.ETTERSENDELSE_KLAGE]: 'Hvis du har noe du ønsker å legge til, kan du skrive det inn her.',
          [CaseType.ETTERSENDELSE_ANKE]: 'Hvis du har noe du ønsker å legge til, kan du skrive det inn her.',
        },
        placeholder: {
          [CaseType.KLAGE]: 'Forklar her',
          [CaseType.ANKE]: 'Forklar her',
          [CaseType.ETTERSENDELSE_KLAGE]: 'Skriv her',
          [CaseType.ETTERSENDELSE_ANKE]: 'Skriv her',
        },
      },
      next_button: 'Gå videre',
      delete_title: {
        [CaseType.KLAGE]: 'Slett klagen og returner til hovedsiden',
        [CaseType.ANKE]: 'Slett anken og returner til hovedsiden',
        [CaseType.ETTERSENDELSE_KLAGE]: 'Slett ettersendelsen og returner til hovedsiden',
        [CaseType.ETTERSENDELSE_ANKE]: 'Slett ettersendelsen og returner til hovedsiden',
      },
    },
    summary: {
      title: {
        logged_in: 'Se over før du sender inn',
        not_logged_in: 'Se over',
      },
      submit_error: {
        [CaseType.KLAGE]: 'Klarte ikke å sende inn klagen. Ukjent feil.',
        [CaseType.ANKE]: 'Klarte ikke å sende inn anken. Ukjent feil.',
        [CaseType.ETTERSENDELSE_KLAGE]: 'Klarte ikke å sende inn ettersendelsen. Ukjent feil.',
        [CaseType.ETTERSENDELSE_ANKE]: 'Klarte ikke å sende inn ettersendelsen. Ukjent feil.',
      },
      sections: {
        person: {
          title: <>Personopplysninger</>,
          info_from: 'Hentet fra Folkeregisteret og Kontakt- og reserverasjonsregisteret.',
        },
        case: {
          title: 'Opplysninger fra saken',
          vedtak: {
            [CaseType.KLAGE]: 'Vedtaksdato',
            [CaseType.ANKE]: 'Dato for klagevedtaket fra Nav klageinstans',
            [CaseType.ETTERSENDELSE_KLAGE]: 'Vedtaksdato',
            [CaseType.ETTERSENDELSE_ANKE]: 'Dato for klagevedtaket fra Nav klageinstans',
          },
          saksnummer: 'Saksnummer',
          from_system: 'Hentet fra internt system',
        },
        begrunnelse: {
          title: {
            [CaseType.KLAGE]: 'Begrunnelse i klagen din',
            [CaseType.ANKE]: 'Begrunnelse i anken din',
            [CaseType.ETTERSENDELSE_KLAGE]: 'Ettersendelsen din',
            [CaseType.ETTERSENDELSE_ANKE]: 'Ettersendelsen din',
          },
          what: {
            [CaseType.KLAGE]: 'Hva gjelder klagen?',
            [CaseType.ANKE]: 'Hva gjelder anken?',
            [CaseType.ETTERSENDELSE_KLAGE]: 'Hva gjelder ettersendelsen?',
            [CaseType.ETTERSENDELSE_ANKE]: 'Hva gjelder ettersendelsen?',
          },
          why: {
            [CaseType.KLAGE]: 'Hvorfor er du uenig?',
            [CaseType.ANKE]: 'Hvorfor er du uenig i klagevedtaket?',
            [CaseType.ETTERSENDELSE_KLAGE]: 'Har du noe å legge til?',
            [CaseType.ETTERSENDELSE_ANKE]: 'Har du noe å legge til?',
          },
          documents: 'Vedlagte dokumenter',
        },
        login: {
          notice: {
            [CaseType.KLAGE]:
              'Du kan fortsatt logge inn for å sende inn klagen digitalt. Da slipper du å skrive ut og sende klagen i posten selv.',
            [CaseType.ANKE]:
              'Du kan fortsatt logge inn for å sende inn anken digitalt. Da slipper du å skrive ut og sende anken i posten selv.',
            [CaseType.ETTERSENDELSE_KLAGE]:
              'Du kan fortsatt logge inn for å sende inn ettersendelsen digitalt. Da slipper du å skrive ut og sende ettersendelsen i posten selv.',
            [CaseType.ETTERSENDELSE_ANKE]:
              'Du kan fortsatt logge inn for å sende inn ettersendelsen digitalt. Da slipper du å skrive ut og sende ettersendelsen i posten selv.',
          },
          action: 'Logg inn',
        },
        confirm: {
          label: {
            [CaseType.KLAGE]: 'Jeg forstår at jeg selv må skrive ut og sende klagen i posten selv.',
            [CaseType.ANKE]: 'Jeg forstår at jeg selv må skrive ut og sende anken i posten selv.',
            [CaseType.ETTERSENDELSE_KLAGE]:
              'Jeg forstår at jeg selv må skrive ut og sende ettersendelsen i posten selv.',
            [CaseType.ETTERSENDELSE_ANKE]:
              'Jeg forstår at jeg selv må skrive ut og sende ettersendelsen i posten selv.',
          },
          error: {
            [CaseType.KLAGE]: 'Du må bekrefte at du ønsker å skrive ut og sende klagen i posten selv.',
            [CaseType.ANKE]: 'Du må bekrefte at du ønsker å skrive ut og sende anken i posten selv.',
            [CaseType.ETTERSENDELSE_KLAGE]:
              'Du må bekrefte at du ønsker å skrive ut og sende ettersendelsen i posten selv.',
            [CaseType.ETTERSENDELSE_ANKE]:
              'Du må bekrefte at du ønsker å skrive ut og sende ettersendelsen i posten selv.',
          },
        },
      },
      next: (status: CaseStatus, type: CaseType): string =>
        status === CaseStatus.DRAFT ? 'Send inn' : `Se innsendt ${CASE_TYPE_NAMES_LOWER_CASE_NB[type]}`,
      post_link: 'Last ned hvis du heller ønsker å sende i posten',
      documents: 'Vedlagte dokumenter',
      kvitteringInfo: {
        [CaseType.KLAGE]:
          'Du skal få en kvitteringsside når klagen er sendt inn. Dersom du ikke får opp en kvitteringsside til slutt, har du ikke sendt inn klagen, og må sende inn på nytt.',
        [CaseType.ANKE]:
          'Du skal få en kvitteringsside når anken er sendt inn. Dersom du ikke får opp en kvitteringsside til slutt, har du ikke sendt inn anken, og må sende inn på nytt.',
        [CaseType.ETTERSENDELSE_KLAGE]:
          'Du skal få en kvitteringsside når ettersendelsen er sendt inn. Dersom du ikke får opp en kvitteringsside til slutt, har du ikke sendt inn ettersendelsen, og må sende inn på nytt.',
        [CaseType.ETTERSENDELSE_ANKE]:
          'Du skal få en kvitteringsside når ettersendelsen er sendt inn. Dersom du ikke får opp en kvitteringsside til slutt, har du ikke sendt inn ettersendelsen, og må sende inn på nytt.',
      },
    },
    kvittering: {
      title: {
        [CaseType.KLAGE]: 'Kvittering for innsendt klage',
        [CaseType.ANKE]: 'Kvittering for innsendt anke',
        [CaseType.ETTERSENDELSE_KLAGE]: 'Kvittering for ettersendelse til klage',
        [CaseType.ETTERSENDELSE_ANKE]: 'Kvittering for ettersendelse til anke',
      },
      download: {
        [CaseType.KLAGE]: 'Se og last ned klagen din',
        [CaseType.ANKE]: 'Se og last ned anken din',
        [CaseType.ETTERSENDELSE_KLAGE]: 'Se og last ned den ettersendte dokumentasjonen din',
        [CaseType.ETTERSENDELSE_ANKE]: 'Se og last ned den ettersendte dokumentasjonen din',
      },
      sent: 'Sendt inn',
      general_info: {
        title: 'Nå er resten vårt ansvar',
        description: (type: CaseType, ytelse: Innsendingsytelse) => [
          'Du trenger ikke gjøre noe mer. Vi tar kontakt med deg hvis det er noe vi lurer på eller hvis vi trenger flere opplysninger fra deg. Om du har glemt å sende inn noe dokumentasjon til saken din, kan du fortsatt ',
          <Link key="internal" to={`/nb/${getEttersendelsePath(type)}/${ytelse.toLowerCase()}`} as={ReactRouterLink}>
            ettersende dokumentasjon
          </Link>,
          '. Kommer du på noe du har glemt på et senere tidspunkt, kan du gå via ',
          <ExternalLink key="external" href="https://www.nav.no/klage" inline openInSameWindow>
            nav.no/klage
          </ExternalLink>,
          ' ved å trykke på "Ettersend dokumentasjon" for det saken gjelder.',
        ],
      },
      read_more: [
        <span key="1">Du kan lese mer om hvordan vi behandler saken din videre på våre </span>,
        <span key="2">
          <ExternalLink key="tema" href="https://www.nav.no/klagerettigheter" inline>
            temasider om klage og anke
          </ExternalLink>
        </span>,
        <span key="3">.</span>,
      ],
      loading: {
        title: {
          [CaseType.KLAGE]: 'Sender inn klagen ...',
          [CaseType.ANKE]: 'Sender inn anken ...',
          [CaseType.ETTERSENDELSE_KLAGE]: 'Sender inn dokumentasjon ...',
          [CaseType.ETTERSENDELSE_ANKE]: 'Sender inn dokumentasjon ...',
        },
        still_working: 'Jobber fortsatt ...',
      },
      see_estimate: [
        <span key="1">Du kan se </span>,
        <span key="2">
          <ExternalLink key="saksbehandlingstid" href="https://www.nav.no/saksbehandlingstider" inline>
            forventet saksbehandlingstid for klage og anke
          </ExternalLink>
        </span>,
        <span key="3"> i egen oversikt.</span>,
      ],
    },
  },
  innsending: {
    title: 'Hva gjør du nå?',
    steg: {
      [CaseType.KLAGE]: [
        'Skriv ut klagen. Ved utskrift kommer en forside som Nav har laget for deg. Denne skal ligge øverst. Følg oppskriften på forsiden.',
        'Signer forsiden og siste side i klagen.',
        'Legg ved vedleggene.',
        'Send i posten til ',
      ],
      [CaseType.ANKE]: [
        'Skriv ut anken. Ved utskrift kommer en forside som Nav har laget for deg. Denne skal ligge øverst. Følg oppskriften på forsiden.',
        'Signer forsiden og siste side i anken.',
        'Legg ved vedleggene.',
        'Send i posten til ',
      ],
      [CaseType.ETTERSENDELSE_KLAGE]: [
        'Skriv ut dokumentasjonen. Ved utskrift kommer en forside som Nav har laget for deg. Denne skal ligge øverst. Følg oppskriften på forsiden.',
        'Signer forsiden og siste side i dokumentasjonen.',
        'Legg ved vedleggene.',
        'Send i posten til ',
      ],
      [CaseType.ETTERSENDELSE_ANKE]: [
        'Skriv ut dokumentasjonen. Ved utskrift kommer en forside som Nav har laget for deg. Denne skal ligge øverst. Følg oppskriften på forsiden.',
        'Signer forsiden og siste side i dokumentasjonen.',
        'Legg ved vedleggene.',
        'Send i posten til ',
      ],
    },
    steg_simple: {
      [CaseType.KLAGE]: ['Skriv ut klagen.', 'Signer klagen.', 'Legg ved vedleggene.', 'Send i posten til '],
      [CaseType.ANKE]: ['Skriv ut anken.', 'Signer anken.', 'Legg ved vedleggene.', 'Send i posten til '],
      [CaseType.ETTERSENDELSE_KLAGE]: [
        'Skriv ut dokumentasjonen.',
        'Signer dokumentasjonen.',
        'Legg ved vedleggene.',
        'Send i posten til ',
      ],
      [CaseType.ETTERSENDELSE_ANKE]: [
        'Skriv ut dokumentasjonen.',
        'Signer dokumentasjonen.',
        'Legg ved vedleggene.',
        'Send i posten til ',
      ],
    },
  },
  post: {
    should_log_in_digital: {
      [CaseType.KLAGE]:
        'Hvis du logger deg inn, kan du sende inn klagen og vedlegg digitalt her. Du kan fortsette uten å logge deg inn, men husk at du da må skrive ut klagen, signere den og sende den i posten.',
      [CaseType.ANKE]:
        'Hvis du logger deg inn, kan du sende inn anken og vedlegg digitalt her. Du kan fortsette uten å logge deg inn, men husk at du da må skrive ut anken, signere den og sende den i posten.',
      [CaseType.ETTERSENDELSE_KLAGE]:
        'Hvis du logger deg inn, kan du ettersende dokumentasjon digitalt her. Du kan fortsette uten å logge deg inn, men husk at du da må skrive ut dokumentasjonen, signere den og sende den i posten.',
      [CaseType.ETTERSENDELSE_ANKE]:
        'Hvis du logger deg inn, kan du ettersende dokumentasjon digitalt her. Du kan fortsette uten å logge deg inn, men husk at du da må skrive ut dokumentasjonen, signere den og sende den i posten.',
    },
    employer_info: {
      [CaseType.KLAGE]:
        'Hvis du er en fullmektig eller en arbeidsgiver som skal klage, må du sende klagen i posten. Du legger inn fødselsnummeret eller D-nummeret til den som vedtaket gjelder for, skriver ut klagen og signerer som fullmektig eller arbeidsgiver.',
      [CaseType.ANKE]:
        'Hvis du er en fullmektig eller en arbeidsgiver som skal anke, må du sende anken i posten. Du legger inn fødselsnummeret eller D-nummeret til den som vedtaket gjelder for, skriver ut anken og signerer som fullmektig eller arbeidsgiver.',
      [CaseType.ETTERSENDELSE_KLAGE]:
        'Hvis du er en fullmektig eller en arbeidsgiver som skal ettersende dokumentasjon, må du sende dokumentasjonen i posten. Du legger inn fødselsnummeret eller D-nummeret til den som vedtaket gjelder for, skriver ut dokumentasjonen og signerer som fullmektig eller arbeidsgiver.',
      [CaseType.ETTERSENDELSE_ANKE]:
        'Hvis du er en fullmektig eller en arbeidsgiver som skal ettersende dokumentasjon, må du sende dokumentasjonen i posten. Du legger inn fødselsnummeret eller D-nummeret til den som vedtaket gjelder for, skriver ut dokumentasjonen og signerer som fullmektig eller arbeidsgiver.',
    },
  },
  user_loader: {
    loading_user: 'Laster...',
  },
  case_loader: {
    loading: 'Laster...',
    format_error: (id: string, error: Error) => `Klarte ikke hente sak med ID "${id}". ${error.message}`,
  },
  not_found_page: {
    title: 'Finner ikke siden',
    go_back: 'Gå tilbake til nav.no/klage',
  },
  error_messages: {
    [ErrorMessageKeys.MAX_UPLOAD_SIZE]: 'Filstørrelsen kan ikke være større enn 8 MB.',
    [ErrorMessageKeys.TOO_LARGE]: 'Filstørrelsen kan ikke være større enn 8 MB.',
    [ErrorMessageKeys.TOTAL_TOO_LARGE]: 'Total filstørrelse kan ikke være større enn 32 MB.',
    [ErrorMessageKeys.ENCRYPTED]: 'Vi mistenker at filen din er kryptert, den kan derfor ikke sendes med.',
    [ErrorMessageKeys.EMPTY]: 'Du kan ikke sende med en tom fil.',
    [ErrorMessageKeys.VIRUS]: 'Vi mistenker at filen din inneholder et virus, den kan derfor ikke sendes med.',
    [ErrorMessageKeys.FILE_COULD_NOT_BE_CONVERTED]:
      'Du har prøvd å legge til et vedlegg med et format vi ikke støtter. Vedlegg er begrenset til PNG, JPEG, og PDF.',
    skjema: {
      title: 'Feil i skjema',
      fnr_dnr_or_npid: 'Du må fylle inn et gyldig fødselsnummer, D-nummer eller NPID.',
      vedtak_date:
        'Du må enten la feltet stå tomt, eller fylle inn en dato som er en gyldig dato, og som ikke er i fremtiden.',
      vedtak_date_required: 'Du må fylle inn en gyldig dato som ikke er i fremtiden.',
      fornavn: 'Du må fylle inn fornavn og mellomnavn.',
      etternavn: 'Du må fylle inn etternavn.',
      begrunnelse: 'Du må skrive en begrunnelse før du går videre.',
      case_is_at_ka: 'Du må velge om du har mottatt brev.',
      vedleggEllerFritekstLoggedIn: 'Du må laste opp minst ett vedlegg eller skrive en begrunnelse før du går videre.',
      vedleggEllerFritekstLoggedOut:
        'Du må enten velge at du skal sende med vedlegg eller skrive en begrunnelse før du går videre.',
    },
    date: {
      invalid_format: 'Du må velge en gyldig dato.',
      invalid_range: (from: Date, to: Date) =>
        `Du må velge en dato som er mellom ${format(from, PRETTY_FORMAT)} og ${format(to, PRETTY_FORMAT)}`,
    },
    create_error: {
      [CaseType.KLAGE]: 'Klarte ikke å opprette klage',
      [CaseType.ANKE]: 'Klarte ikke å opprette anke',
      [CaseType.ETTERSENDELSE_KLAGE]: 'Klarte ikke å opprette ettersendelse',
      [CaseType.ETTERSENDELSE_ANKE]: 'Klarte ikke å opprette ettersendelse',
    },
  },
  common: {
    next_button: 'Gå videre',
    loading: 'Laster...',
    logged_out: 'Du har blitt logget ut. For å fortsette trenger du bare å logge inn igjen.',
    log_in: 'Logg inn',
    generic_error: 'Noe gikk galt. Vennligst prøv igjen senere.',
    fnr_dnr_or_npid: 'Fødselsnummer, D-nummer eller NPID',
    fornavn: 'For- og mellomnavn',
    etternavn: 'Etternavn',
    download: 'Last ned / skriv ut',
    back: 'Tilbake',
    last_changed: 'Sist endret',
    delete: 'Slett',
    cancel: 'Avbryt',
    yes: 'Ja',
    no: 'Nei',
    expires_in: (exp: string) => `Du vil bli logget ut ${exp}. For å fortsette trenger du bare logge inn igjen.`,
    has_attachments_label: 'Jeg skal sende med vedlegg.',
    not_specified: 'Ikke angitt',
  },
  icons: {
    externalLink: 'Åpne lenke i ny fane',
    summary: 'Oppsummering',
    receipt: 'Kvittering',
  },
};

const CASE_TYPE_NAMES_LOWER_CASE_NB = {
  [CaseType.KLAGE]: 'klage',
  [CaseType.ANKE]: 'anke',
  [CaseType.ETTERSENDELSE_KLAGE]: 'ettersendelse for klage',
  [CaseType.ETTERSENDELSE_ANKE]: 'ettersendelse for anke',
};
