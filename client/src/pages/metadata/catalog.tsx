import * as React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardActionArea,
  CardContent,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import { useMetadata } from "../../hooks/useMetadata";
import { useClientConfig } from "../../config/client-config";
import { publicAssetUrl } from "../../utils/public-asset-url";

type Category = {
  title: string;
};

const CATEGORIES: Category[] = [
  { title: "Administrativa gränser" },
  { title: "Arealtäckande bilder och bakgrundskartor" },
  { title: "Areella näringar" },
  { title: "Atmosfär, klimatologi och meteorologi" },
  { title: "Biologi och ekologi" },
  { title: "Byggnader och byggnadsanläggningar" },
  { title: "Ekonomi" },
  { title: "Fastigheter och fysisk planering" },
  { title: "Försvar" },
  { title: "Geovetenskap" },
  { title: "Hälsa" },
  { title: "Höjddata" },
  { title: "Kust och hav" },
  { title: "Miljö" },
  { title: "Positionering" },
  { title: "Samhälle och kultur" },
  { title: "Sjöar och vattendrag" },
  { title: "Tekniska försörjningssystem" },
  { title: "Transporter" },
];

function normalize(v: string) {
  return v.toLowerCase().trim();
}

export default function MetadataCatalog() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const { data: items = [], isLoading, isError } = useMetadata();
  const config = useClientConfig();
  const defaultCategoryImgSrc = React.useMemo(
    () => publicAssetUrl(config.defaultCategoryImage || "kompass.jpg"),
    [config.defaultCategoryImage]
  );

  const countsByKategori = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      const k = (it.kategori ?? "").trim();
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => normalize(c.title).includes(q));
  }, [query]);

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 1, md: 4 }, mb: 6 }}>
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Kommunens metadatakatalog
        </Typography>
        <Typography variant="body2" sx={{ mb: 5 }}>
          Sök efter kommunens geodatamängder...
        </Typography>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sök ämnesområde…"
          size="small"
          fullWidth
          sx={{ maxWidth: 700, mb: 2, backgroundColor: "background.paper" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {isError ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Kunde inte hämta antal per ämnesområde.
        </Alert>
      ) : null}

      <Grid container spacing={2}>
        {filtered.map((c) => (
          // Config is keyed by title: config.categoryImages?.["Administrativa gränser"] = "kompass.jpg"
          <Grid key={c.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                height: "100%",
                overflow: "hidden",
                transition: "transform 120ms ease, box-shadow 120ms ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (t) =>
                    t.palette.mode === "dark"
                      ? "0 10px 30px rgba(0,0,0,0.35)"
                      : "0 10px 30px rgba(17,24,39,0.12)",
                },
              }}
            >
              <CardActionArea
                onClick={() =>
                  navigate(
                    `/metadata/list?kategori=${encodeURIComponent(c.title)}`
                  )
                }
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    minHeight: 120,
                    maxHeight: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.default",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0,
                  }}
                >
                  <Box
                    component="img"
                    src={
                      config.categoryImages?.[c.title]
                        ? publicAssetUrl(config.categoryImages[c.title])
                        : defaultCategoryImgSrc
                    }
                    alt={c.title}
                    sx={{
                      // Fill the header area consistently (may crop edges).
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </Box>
                <CardContent sx={{ py: 1.5, width: "100%", flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, textAlign: "center" }}
                  >
                    {c.title}{" "}
                    <Box component="span" sx={{ color: "text.secondary" }}>
                      (
                      {isLoading
                        ? "…"
                        : String(countsByKategori.get(c.title) ?? 0)}
                      )
                    </Box>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
