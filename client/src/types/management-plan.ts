export interface ManagementPlan {
  gid: number;
  arendeNummer: string;
  bestallareNamn: string;
  bestallareEpost: string;
  sakerhetsklass: string;
  datakallaTyp: string;
  schema: string;
  namn: string;
  titel: string;
  dataAgare: string;
  dataForvaltare: string;
  dataAdministrator: string[];
  dataKonsument: string[];
  redigeringsKalla: string[];
  publicering: string;
  oppnaData: boolean;
  arkivering: string;
  arkiveringTidpunkt: string;
  atkomst: string[];
  status: string;
  handlaggare: string;
  forvaltningsplanVersion: string;
  skapadTidPunkt: string;
}
