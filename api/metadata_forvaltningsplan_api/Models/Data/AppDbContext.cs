using Microsoft.EntityFrameworkCore;

namespace metadata_forvaltningsplan_api.Models.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Metadata> Metadatas => Set<Metadata>();
        public DbSet<ManagementPlan> ManagementPlans => Set<ManagementPlan>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Metadata entity
            modelBuilder.Entity<Metadata>()
                .ToTable("etjanst_metadataspecifikation", "metadata")
                .HasKey(x => x.Gid);
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Gid).HasColumnName("gid");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.ArendeNummerOpenE).HasColumnName("arendenummer_open_e");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.BestallareNamn).HasColumnName("bestallare_namn");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.BestallareEpost).HasColumnName("bestallare_epost");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.SakerhetsKlass).HasColumnName("sakerhetsklass");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.DataKallaTyp).HasColumnName("datakalla_typ");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.SchemaNamn).HasColumnName("schema_namn");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Namn).HasColumnName("namn");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Beskrivning).HasColumnName("beskrivning");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Ursprung).HasColumnName("ursprung");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Syfte).HasColumnName("syfte");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Metod).HasColumnName("metod");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.MetodUrl).HasColumnName("metod_url");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Projekt).HasColumnName("projekt");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.GeografiskBegransning).HasColumnName("geografisk_begransning");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.UppdateringsFrekvens).HasColumnName("uppdateringsfrekvens");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Fullstandighet).HasColumnName("fullstandighet");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Skalniva).HasColumnName("skalniva");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.NyckelOrd).HasColumnName("nyckelord");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Kategori).HasColumnName("kategori");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Tidsperiod).HasColumnName("tidsperiod");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.TidsperiodStartdatum).HasColumnName("tidsperiod_startdatum");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.TidsperiodSlutdatum).HasColumnName("tidsperiod_slutdatum");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.TidsUpplosning).HasColumnName("tidsupplosning");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.SkapelseDatum).HasColumnName("skapelsedatum");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.AnvandarBegransningLicens).HasColumnName("anvandarbegransning_licens");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.AnvandarBegransningLicensText).HasColumnName("anvandarbegransning_licens_text");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.RelateradeResurser).HasColumnName("relaterade_resurser");
            modelBuilder.Entity<Metadata>()
               .Property(x => x.KolumnBeskrivningUrl).HasColumnName("kolumn_beskrivning_url");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Status).HasColumnName("status");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.Handlaggare).HasColumnName("handlaggare");
            modelBuilder.Entity<Metadata>()
                .Property(x => x.MetaDataVersion).HasColumnName("metadata_version");

            // Configure ManagementPlan entity
            modelBuilder.Entity<ManagementPlan>()
                .ToTable("etjanst_forvaltningsplan", "metadata")
                .HasKey(x => x.Gid);
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Gid).HasColumnName("gid");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.ArendeNummberOpenE).HasColumnName("arendenummer_open_e");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.BestallareNamn).HasColumnName("bestallare_namn");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.BestallareEpost).HasColumnName("bestallare_epost");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Sakerhetsklass).HasColumnName("sakerhetsklass");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.DatakallaTyp).HasColumnName("datakalla_typ");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.SchemaNamn).HasColumnName("schema_namn");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Namn).HasColumnName("namn");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Titel).HasColumnName("titel");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.DataAgare).HasColumnName("dataagare");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.DataForvaltare).HasColumnName("dataforvaltare");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.DataAdministrator).HasColumnName("dataadministrator");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.DataKonsument).HasColumnName("datakonsument");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.RedigeringsKalla).HasColumnName("redigeringskalla");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.OppnaData).HasColumnName("oppna_data");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.DokumentSkUrl).HasColumnName("dokument_sk_url");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.DokuementInfoUrl).HasColumnName("dokument_info_url");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.OvrigInformation).HasColumnName("ovrig_information");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.KritiskDatamangd).HasColumnName("kritisk_datamangd");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Arkivering).HasColumnName("arkivering");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.ArkiveringTidpunkt).HasColumnName("arkivering_tidpunkt");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Publicerad).HasColumnName("publicerad");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.PubliceradOppnaData).HasColumnName("publicerad_oppna_data");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Atkomst).HasColumnName("atkomst");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Integration).HasColumnName("integration");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Status).HasColumnName("status");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.Handlaggare).HasColumnName("handlaggare");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.ForvaltningsplanVersion).HasColumnName("forvaltningsplan_version");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.SkapadTidPunkt).HasColumnName("skapad_tidpunkt");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.SkapadAv).HasColumnName("skapad_av");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.AndradTidPunkt).HasColumnName("andrad_tidpunkt");
            modelBuilder.Entity<ManagementPlan>()
                .Property(x => x.AndradAv).HasColumnName("andrad_av");
        }
    }
}
