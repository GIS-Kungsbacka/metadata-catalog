import type { Metadata } from "../types/metadata";
import type { ManagementPlan } from "../types/management-plan";

export const metadataFieldHelp: Partial<Record<keyof Metadata, string>> = {
  schemaNamn:
    "Visar vilken databas eller grupp datamängden tillhör. Tänk på det som en mapp där liknande data samlas.",
  namn: "Det tekniska namnet på datamängden, ofta samma som tabellnamnet i databasen.",
  metaDataVersion:
    "Versionsnummer som visar vilken utgåva av metadatauppgifterna du tittar på.",
  beskrivning:
    "En kort förklaring av vad datamängden innehåller och vad den kan användas till.",
  syfte:
    "Beskriver varför informationen samlas in och vilka behov den ska lösa.",
  kategori:
    "Typ av geodata, till exempel miljö, planering eller trafik. Hjälper dig hitta rätt sorts information.",
  nyckelOrd:
    "Sökord som gör det lättare att hitta datamängden när man söker i katalogen.",
  projekt: "Namnet på det projekt som datamängden är kopplad till, om något.",
  dataKallaTyp:
    "Hur datan har skapats eller samlats in, till exempel genom mätning, register eller intervju.",
  ursprung:
    "Varifrån informationen kommer, till exempel kommuner, myndigheter eller externa leverantörer.",
  metod:
    "Beskriver steg för steg hur datan har tillverkats eller bearbetats.",
  metodUrl:
    "Länk till mer detaljerad dokumentation om hur datan har skapats.",
  geografiskBegransning:
    "Vilket geografiskt område datan gäller, till exempel en kommun eller region.",
  skalniva:
    "Hur detaljerad kartan eller datan är avsedd att vara, till exempel översikt eller detaljnivå.",
  skapelseDatum: "Datum då datamängden först skapades.",
  tidsperiodStartdatum:
    "Första datum som informationen i datamängden gäller från.",
  tidsperiodSlutdatum:
    "Sista datum som informationen i datamängden gäller till.",
  tidsUpplosning:
    "Tidsintervall mellan datapunkter, till exempel per år, månad eller dag.",
  uppdateringsFrekvens:
    "Hur ofta datamängden uppdateras med ny information, till exempel årligen eller löpande.",
  fullstandighet:
    "Hur komplett datamängden är jämfört med verkligheten. Visar om något saknas.",
  anvandarBegransningLicens:
    "Anger om det finns regler eller licenser som begränsar hur datan får användas.",
  anvandarBegransningLicensText:
    "Beskriver i text vilka licensvillkor eller användningsregler som gäller.",
  sakerhetsKlass:
    "Visar hur känslig informationen är och vilka skyddsregler som gäller vid hantering.",
  kolumnBeskrivningUrl:
    "Länk till en lista som förklarar alla fält och attribut i själva datamängden.",
  relateradeResurser:
    "Länkar till andra kartlager, dokument eller data som hör ihop med denna datamängd.",
  arendeNummerOpenE:
    "Diarienummer i ärendehanteringssystemet, används för att spåra ärendet.",
  bestallareNamn:
    "Namn på den person eller organisation som beställt eller efterfrågat datamängden.",
  bestallareEpost: "E-postadress till beställaren om du behöver ställa frågor.",
  handlaggare:
    "Den person som ansvarar för att driva ärendet internt i organisationen.",
  status:
    "Visar var i processen datamängden befinner sig, till exempel under arbete, godkänd eller publicerad.",
};

export const managementPlanFieldHelp: Partial<
  Record<keyof ManagementPlan, string>
> = {
  titel:
    "Den läsbara titeln på förvaltningsplanen, ofta mer beskrivande än det tekniska namnet.",
  namn: "Det tekniska namnet på datamängden som förvaltningsplanen gäller.",
  schemaNamn:
    "Visar vilken databas eller grupp datamängden tillhör.",
  forvaltningsplanVersion:
    "Versionsnummer som visar vilken utgåva av förvaltningsplanen du tittar på.",
  dataAgare:
    "Organisation eller person som äger datamängden och fattar beslut om innehållet.",
  dataForvaltare:
    "Den som ansvarar för att datan hålls aktuell, korrekt och välskött över tid.",
  dataAdministrator:
    "Personer som sköter den tekniska hanteringen, till exempel drift och uppdatering i system.",
  dataKonsument:
    "Vem som använder eller behöver datamängden i sitt arbete.",
  handlaggare:
    "Den person som ansvarar för att driva ärendet internt i organisationen.",
  publicerad:
    "Var eller hur datamängden är publicerad och tillgänglig för användare.",
  oppnaData:
    "Anger om datamängden är öppen för allmänheten att använda fritt eller med villkor.",
  atkomst:
    "Beskriver hur man får tillgång till datamängden, till exempel via webbtjänst eller beställning.",
  integration:
    "Hur datamängden kan kopplas till eller användas i andra system och tjänster.",
  redigeringsKalla:
    "Var och hur datan kan uppdateras eller redigeras av ansvariga personer.",
  dokumentSkUrl:
    "Länk till en sammanfattande produktbeskrivning (SK) om datamängden.",
  dokuementInfoUrl:
    "Länk till mer information och dokumentation om datamängden.",
  ovrigInformation:
    "Övriga kommentarer eller tilläggsuppgifter som inte passar i andra fält.",
  kritiskDatamangd:
    "Anger om datamängden är klassad som kritisk för samhällets funktion och behöver extra skydd.",
  arkivering:
    "Beskriver hur datan ska hanteras när den inte längre är i aktiv användning.",
  arkiveringTidpunkt:
    "Datum när arkivering planeras eller har genomförts.",
  skapadTidPunkt: "Datum och tid då posten skapades i systemet.",
  skapadAv: "Vem som skapade posten i systemet.",
  andradTidPunkt: "Datum och tid för senaste ändring av posten.",
  andradAv: "Vem som senast ändrade posten.",
  arendeNummberOpenE:
    "Diarienummer i ärendehanteringssystemet, används för att spåra ärendet.",
  bestallareNamn:
    "Namn på den person eller organisation som beställt eller efterfrågat datamängden.",
  bestallareEpost: "E-postadress till beställaren om du behöver ställa frågor.",
  sakerhetsklass:
    "Visar hur känslig informationen är och vilka skyddsregler som gäller vid hantering.",
  datakallaTyp:
    "Hur datan har skapats eller samlats in, till exempel genom mätning, register eller intervju.",
  status:
    "Visar var i processen datamängden befinner sig, till exempel under arbete, godkänd eller publicerad.",
};
