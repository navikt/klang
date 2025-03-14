Digital klage- og ankeinngang
================

Digital innsending av klager, anker og ettersendelser.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub.

## For NAV-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#team-digital-klage](https://nav-it.slack.com/archives/C01L59AQVQA).

Bruk og integrasjon
===================

## Hvordan kommer bruker seg til skjema for klage, anke og ettersendelse?

Bruker må bli sendt direkte til ett av skjemaene fra en annen tjeneste.
Andre tjenester kan f.eks. lenke til skjema for klage med følgende URL `https://klage.nav.no/nb/klage/DAGPENGER?saksnummer=12345`.

> I `dev` er det mulig å gå til forsiden, https://klage.intern.dev.nav.no, for å se en oversikt over alle ytelser og sakstyper. I `prod` redirecter forsiden til https://nav.no/klage.

### Direkte lenke

Brukere kan være logget inn i en tjeneste som har nødvendig informasjon for å sende brukeren direkte til skjemaet, f.eks. en vedtaksløsning (selvbetjeningsløsning).

1. Bruker ser vedtak i selvbetjeningsløsning.
2. Bruker trykker på knappen `Klag på vedtak`.
3. Bruker sendes til klageskjema.

For å lenke direkte til et klageskjema må `innsendingsytelse` være satt i URL-en.
_Det samme gjelder for anker og ettersendelser._

### Saksnummer
`saksnummer` er valgfritt og kan settes som et query-parameter i URL-en.

Saksnummeret settes i klagen/anken/ettersendelsen. Bruker kan fortsatt låse opp feltet og overstyre det.

Dersom saksnummer ikke er oppgitt som query-parameter, får bruker mulighet til å fylle inn saksnummer selv. Feltet er valgfritt.

### Eksempler på fullstendige URLer
| Skjema | URL |
|--------|-----|
| Klage | `https://klage.nav.no/nb/klage/DAGPENGER?saksnummer=12345` |
| Anke  | `https://klage.nav.no/nb/anke/DAGPENGER?saksnummer=12345`  |
| Ettersendelse til klage | `https://klage.nav.no/nb/ettersendelse/klage/DAGPENGER?saksnummer=12345&ka` |
| Ettersendelse til anke | `https://klage.nav.no/nb/ettersendelse/anke/DAGPENGER?saksnummer=12345` |

## URL-format
```
https://klage.nav.no/{språk}/{type}/{innsendingsytelse}?saksnummer={saksnummer}&ka
```
- `språk` = `nb | nn | en`
- `type` = `klage | anke | ettersendelse/klage | ettersendelse/anke`
- `innsendingsytelse` = Se liste over tilgjengelige ytelser under.
- `saksnummer` = Relevant saksnummer.
- `ka` = Kun relevant for klageettersendelse. Om saken er sendt til Nav klageinstans. Om parameteret finnes vil det tolkes som `true`. Unntak er om verdien er `false` eller `0`. Dersom parameteret ikke tolkes til `true`, må bruker ta stilling til valget.

### Hvilke ytelser støttes?
[Se tilgjengelige ytelser her.](https://klage.intern.dev.nav.no/)

## Legge til ny ytelse

Om ingen av ytelsene som støttes passer deres behov er det mulig å opprette en PR i [klage-dittnav-api](https://github.com/navikt/klage-dittnav-api)-prosjektet eller kontakte teamet på Slack i kanalen [#team-digital-klage](https://nav-it.slack.com/archives/C01L59AQVQA).

> Merk at alle ytelser må legges inn på bokmål, nynorsk og engelsk.

## Fortsette på påbegynt klage/anke

Når brukere oppretter klager/anker ved å gå til skjemaet, men ikke sender inn, blir de liggende som påbegynte klager/anker.

Dersom en bruker går til skjemaet med samme parametere igjen senere, vil bruker fortsette på den uferdige klagen/anken.

## Permanente lenker til skjemaer

Alle klager/anker blir opprettet med en unik ID som vises i URL-en. Dvs. at en bruker kan ta vare på lenken til en spesifikk klage/anke og bruke den senere.

Klager/anker som ikke er sendt inn vil kunne redigeres og sendes inn.

Klager/anker som er sendt inn vil kun vise en oppsummering og lenke til innsendt klage/anke som PDF.

> Vedlegg vil være en del av PDFen og ikke eksistere som frittstående filer etter klagen er innsendt.

## Fullmakt

> Under utvikling. Ikke bruk.

Det er også støtte for å oppgi fullmaktsgiver i URLen med query-parameteret `fullmaktsgiver` sammen med de andre parameterne.

Dette parameteret må være fødselsnummeret til personen som har gitt fullmakten til brukeren som skal sende inn klagen (fullmaktsgiver).

Om fullmakten ikke er gyldig blir bruker møtt med en feilmelding. Om fullmakten er gyldig vil bruker få en tydelig infoboks gjennom hele skjemaet om at de klager på vegne av den andre.

Ved hjelp av dette parameteret kan vi i tillegg gi brukere muligheten til å klage på vegne av fullmaktsgiver gjennom et GUI.

Under visse ytelser vil inngangen for klage gi bruker muligheten til å trykke på en knapp "Klage på vegne av andre" som tar bruker til en skjerm der de kan skrive inn fødselsnummer. Når de trykker søk vil systemet enten:

1. Bekrefte at bruker har fullmakt fra person med oppgitt fødselsnummer. Da kan bruker gå videre til skjemaet der `fullmaktsgiver`-queryen automatisk blir satt til oppgitt fødselsnummer.
2. Ikke bekrefte og gi bruker en feilmelding. Ingen informasjon rundt oppgitt fødselsnummer blir vist til bruker.

## Videre flyt

Denne klienten interagerer med https://github.com/navikt/klage-dittnav-api, som igjen sender info videre til https://github.com/navikt/klage-arkiver-journalpost. Se `README` i sistnevnte for informasjon om hvordan journalposter opprettes i Joark.

# Utvikling

## Autorisering mot @navikt-NPM-registeret
1. [Lag et Personal Access Token (PAT)](https://github.com/settings/tokens) med scope: `read:packages`. _Tokenet må være autorisert for organisasjonen `navikt`._
2. Opprett filen `bunfig.toml` i din `$HOME`-mappe med følgende innhold:
  ```toml
  [install.scopes]
  "@navikt" = { token = "ghp_Qj6Xxn8HTUSJL9dNiZ0TW7R5YvupTZclTXsK", url = "https://npm.pkg.github.com/" }
  ```
3. Bytt ut `ghp_Qj6Xxn8HTUSJL9dNiZ0TW7R5YvupTZclTXsK` med ditt eget token.

### Referanser
- https://github.com/navikt/nav-dekoratoren-moduler?tab=readme-ov-file#kom-i-gang
- https://bun.sh/docs/install/registries

```
bun i
bun start
```

## Miljøer

- `DEV`: https://klage.intern.dev.nav.no
- `PROD`: https://klage.nav.no

## Autentisering for lokal utvikling

1. Gå til https://klage.intern.dev.nav.no/nb/klage/DAGPENGER.
2. Logg inn normalt med en testbruker.
3. Endre domene til `localhost` for følgende cookies: `innloggingsstatus-token` og `io.nais.wonderwall.session`.

> Kun i `dev` har denne applikasjonen en egen forside med oversikt over alle ytelser og sakstyper.
