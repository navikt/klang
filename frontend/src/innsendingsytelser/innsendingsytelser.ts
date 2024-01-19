export enum Innsendingsytelse {
  AAP = 'AAP',
  AAR = 'AAR',
  AGR = 'AGR',
  BAR = 'BAR',
  BID = 'BID',
  BII = 'BII',
  BIL = 'BIL',
  DAG = 'DAG',
  ENF = 'ENF',
  ERS = 'ERS',
  FAR = 'FAR',
  FEI = 'FEI',
  FOR = 'FOR',
  FOS = 'FOS',
  FRI = 'FRI',
  FUL = 'FUL',
  GEN = 'GEN',
  GRA = 'GRA',
  GRU = 'GRU',
  HEL = 'HEL',
  HJE = 'HJE',
  IAR = 'IAR',
  IND = 'IND',
  KLA = 'KLA',
  KNA = 'KNA',
  KOM = 'KOM',
  KON = 'KON',
  KTR = 'KTR',
  LGA = 'LGA',
  MED = 'MED',
  MOB = 'MOB',
  MOT = 'MOT',
  OKO = 'OKO',
  OMS = 'OMS',
  OPA = 'OPA',
  OPP = 'OPP',
  OVR = 'OVR',
  PEN = 'PEN',
  PER = 'PER',
  REH = 'REH',
  REK = 'REK',
  RPO = 'RPO',
  RVE = 'RVE',
  SAA = 'SAA',
  SAK = 'SAK',
  SAP = 'SAP',
  SER = 'SER',
  SIK = 'SIK',
  STO = 'STO',
  SUP = 'SUP',
  SYK = 'SYK',
  SYM = 'SYM',
  TIL = 'TIL',
  TRK = 'TRK',
  TRY = 'TRY',
  TSO = 'TSO',
  TSR = 'TSR',
  UFM = 'UFM',
  UFO = 'UFO',
  UKJ = 'UKJ',
  VEN = 'VEN',
  YRA = 'YRA',
  YRK = 'YRK',
  ALDERSPENSJON = 'ALDERSPENSJON',
  ARBEID = 'ARBEID',
  ARBEIDSAVKLARINGSPENGER = 'ARBEIDSAVKLARINGSPENGER',
  AVTALEFESTET_PENSJON = 'AVTALEFESTET_PENSJON',
  AVTALEFESTET_PENSJON_SPK = 'AVTALEFESTET_PENSJON_SPK',
  AVTALEFESTET_PENSJON_PRIVAT = 'AVTALEFESTET_PENSJON_PRIVAT',
  BARNEBIDRAG_OG_BIDRAGSFORSKUDD = 'BARNEBIDRAG_OG_BIDRAGSFORSKUDD',
  BARNEPENSJON = 'BARNEPENSJON',
  BARNETRYGD = 'BARNETRYGD',
  BILSTONAD = 'BILSTONAD',
  DAGPENGER = 'DAGPENGER',
  DAGPENGER_FERIEPENGER = 'DAGPENGER_FERIEPENGER',
  DAGPENGER_TILBAKEBETALING_FORSKUDD = 'DAGPENGER_TILBAKEBETALING_FORSKUDD',
  EKTEFELLEBIDRAG = 'EKTEFELLEBIDRAG',
  ENGANGSSTONAD = 'ENGANGSSTONAD',
  ENSLIG_MOR_ELLER_FAR = 'ENSLIG_MOR_ELLER_FAR',
  FORELDREPENGER_GENERELL = 'FORELDREPENGER_GENERELL',
  FORELDREPENGER = 'FORELDREPENGER',
  GJENLEVENDE = 'GJENLEVENDE',
  GRAVFERDSSTONAD = 'GRAVFERDSSTONAD',
  GRUNN_OG_HJELPESTONAD = 'GRUNN_OG_HJELPESTONAD',
  HJELPEMIDLER = 'HJELPEMIDLER',
  KONTANTSTOTTE = 'KONTANTSTOTTE',
  KRIGSPENSJON = 'KRIGSPENSJON',
  LONNSGARANTI = 'LONNSGARANTI',
  LONNSKOMPENSASJON = 'LONNSKOMPENSASJON',
  MIDLERTIDIG_KOMPENSASJON = 'MIDLERTIDIG_KOMPENSASJON',
  NAV_LOVEN_14A = 'NAV_LOVEN_14A',
  OKONOMISK_SOSIALHJELP = 'OKONOMISK_SOSIALHJELP',
  OMSORGSPENGER = 'OMSORGSPENGER',
  OMSTILLINGSSTOENAD = 'OMSTILLINGSSTOENAD',
  OPPFOSTRINGSBIDRAG = 'OPPFOSTRINGSBIDRAG',
  OPPHOLD_ELLER_ARBEID_I_NORGE = 'OPPHOLD_ELLER_ARBEID_I_NORGE',
  OPPHOLD_ELLER_ARBEID_UTENFOR_NORGE = 'OPPHOLD_ELLER_ARBEID_UTENFOR_NORGE',
  OPPLAERINGSPENGER = 'OPPLAERINGSPENGER',
  PLEIEPENGER = 'PLEIEPENGER',
  REISEKOSTNADER_VED_SAMVAER = 'REISEKOSTNADER_VED_SAMVAER',
  SUPPLERENDE_STONAD = 'SUPPLERENDE_STONAD',
  SUPPLERENDE_STONAD_UFORE_FLYKTNINGER = 'SUPPLERENDE_STONAD_UFORE_FLYKTNINGER',
  SVANGERSKAPSPENGER = 'SVANGERSKAPSPENGER',
  SYKDOM_I_FAMILIEN = 'SYKDOM_I_FAMILIEN',
  SYKEPENGER = 'SYKEPENGER',
  TIDLIGERE_FAMILIEPLEIER = 'TIDLIGERE_FAMILIEPLEIER',
  TILTAKSPENGER = 'TILTAKSPENGER',
  TILLEGGSSTONADER = 'TILLEGGSSTONADER',
  UFORETRYGD = 'UFORETRYGD',
  YRKESSKADE = 'YRKESSKADE',
  FEIL = 'FEIL',
}

const INNSENDINGSYTELSER = Object.values(Innsendingsytelse);

export const ensureStringIsInnsendingsytelse = (value: string | null = null): Innsendingsytelse | null => {
  if (value === null) {
    return null;
  }

  return INNSENDINGSYTELSER.find((innsendingsytelse) => innsendingsytelse === value) ?? null;
};
