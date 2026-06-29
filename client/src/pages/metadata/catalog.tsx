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
  Chip,
  CircularProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { useNavigate } from "react-router-dom";
import { useMetadata } from "../../hooks/useMetadata";
import { useClientConfig } from "../../config/client-config";
import { publicAssetUrl } from "../../utils/public-asset-url";
import { MetadataViewSwitcher } from "./metadata-view-switcher";
import {
  metadataMatchesQuery,
  normalizeSearchQuery,
} from "../../utils/metadata-search";

type Category = {
  title: string;
};

const CATEGORIES: Category[] = [
  { title: "Administrativa gränser" },
  { title: "Arealtäckande bilder och bakgrundskartor" },
  { title: "Areella näringar" },
  { title: "Atmosfär, klimatologi och meteorologi" },
  { title: "Biologi och ekologi" },
  { title: "Byggnader och byggnadskonstruktioner" },
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
  return normalizeSearchQuery(v);
}

function toListUrl(options?: { kategori?: string; q?: string }) {
  const params = new URLSearchParams();
  const kategori = (options?.kategori ?? "").trim();
  const q = (options?.q ?? "").trim();
  if (kategori) params.set("kategori", kategori);
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/metadata/list?${qs}` : "/metadata/list";
}

type ImageLoadState = "idle" | "loading" | "loaded" | "error";

function usePreloadImages(urls: string[]) {
  const [stateByUrl, setStateByUrl] = React.useState<
    Record<string, ImageLoadState>
  >({});

  React.useEffect(() => {
    if (urls.length === 0) return;

    let cancelled = false;
    const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

    setStateByUrl((prev) => {
      const next = { ...prev };
      for (const u of uniqueUrls) {
        if (!next[u]) next[u] = "idle";
      }
      return next;
    });

    for (const u of uniqueUrls) {
      const img = new Image();

      setStateByUrl((prev) => (prev[u] ? { ...prev, [u]: "loading" } : prev));

      img.onload = () => {
        if (cancelled) return;
        setStateByUrl((prev) => ({ ...prev, [u]: "loaded" }));
      };
      img.onerror = () => {
        if (cancelled) return;
        setStateByUrl((prev) => ({ ...prev, [u]: "error" }));
      };
      img.src = u;
    }

    return () => {
      cancelled = true;
    };
  }, [urls]);

  const markLoaded = React.useCallback((url: string) => {
    if (!url) return;
    setStateByUrl((prev) => ({ ...prev, [url]: "loaded" }));
  }, []);

  const markError = React.useCallback((url: string) => {
    if (!url) return;
    setStateByUrl((prev) => ({ ...prev, [url]: "error" }));
  }, []);

  return { stateByUrl, markLoaded, markError };
}

export default function MetadataCatalog() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [isSearchHelpOpen, setIsSearchHelpOpen] = React.useState(false);
  const { data: items = [], isLoading, isError } = useMetadata();
  const config = useClientConfig();
  const defaultCategoryImgSrc = React.useMemo(
    () => publicAssetUrl(config.defaultCategoryImage || ""),
    [config.defaultCategoryImage],
  );

  const categoryImgSrc = React.useCallback(
    (categoryTitle: string) => {
      return config.categoryImages?.[categoryTitle]
        ? publicAssetUrl(config.categoryImages[categoryTitle])
        : defaultCategoryImgSrc;
    },
    [config.categoryImages, defaultCategoryImgSrc],
  );

  const allCategoryImageUrls = React.useMemo(() => {
    const urls: string[] = [defaultCategoryImgSrc];
    for (const c of CATEGORIES) urls.push(categoryImgSrc(c.title));
    return urls;
  }, [categoryImgSrc, defaultCategoryImgSrc]);

  const { stateByUrl, markLoaded, markError } =
    usePreloadImages(allCategoryImageUrls);

  const countsByKategori = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const it of items) {
      const k = (it.kategori ?? "").trim();
      if (!k) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const matchesByKategori = React.useMemo(() => {
    const map = new Map<string, number>();
    const q = normalize(query);
    if (!q) return map;

    for (const it of items) {
      const k = (it.kategori ?? "").trim();
      if (!k) continue;
      if (!metadataMatchesQuery(it, query)) continue;
      map.set(k, (map.get(k) ?? 0) + 1);
    }

    return map;
  }, [items, query]);

  const filtered = React.useMemo(() => {
    const q = normalize(query);
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => {
      if (normalize(c.title).includes(q)) return true;
      return (matchesByKategori.get(c.title) ?? 0) > 0;
    });
  }, [matchesByKategori, query]);

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 1, md: 4 }, mb: 6 }}>
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, mr: 1 }}>
          Metadatakatalog för geodata
        </Typography>
        <Typography variant="body2" sx={{ mb: 5 }}>
          Sök efter geodatamängder...
        </Typography>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            const q = query.trim();
            if (!q) return;
            e.preventDefault();
            navigate(toListUrl({ q }));
          }}
          placeholder="Sök…"
          size="small"
          fullWidth
          sx={{ maxWidth: 700, mb: 3, backgroundColor: "background.paper" }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {query.trim().length > 0 ? (
                    <IconButton
                      size="small"
                      aria-label="Rensa sök"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setQuery("")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null}
                  <Tooltip title="Söktips" arrow>
                    <IconButton
                      size="small"
                      edge="end"
                      aria-label="Söktips"
                      onClick={() => setIsSearchHelpOpen(true)}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <MetadataViewSwitcher view="catalog" />
        </Box>
      </Box>

      <Dialog
        open={isSearchHelpOpen}
        onClose={() => setIsSearchHelpOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Söktips</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Du kan söka på både innehåll och metadata. Det betyder att du kan få
            träffar även om ordet inte finns i ämnesområdets titel, till exempel
            via beskrivning, ansvarig part, plats eller andra uppgifter om
            datamängden.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Exempel på vad du kan söka på
          </Typography>

          <List dense disablePadding sx={{ mb: 1 }}>
            <ListItem disableGutters>
              <ListItemText primary="Ämne, nyckelord och kategori" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Organisation, ansvarig part och kontakt" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Plats, område och geografiska namn" />
            </ListItem>
            <ListItem disableGutters>
              <ListItemText primary="Datakälla, status och andra uppgifter om datamängden" />
            </ListItem>
          </List>

          <Typography variant="body2" color="text.secondary">
            Tips: prova att kombinera flera ord, till exempel “geoteknik
            bygglov” eller “vattendrag WMS”.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setIsSearchHelpOpen(false)}
            variant="contained"
          >
            Stäng
          </Button>
        </DialogActions>
      </Dialog>

      {isError ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Kunde inte hämta antal per ämnesområde.
        </Alert>
      ) : null}

      <Grid container spacing={4}>
        {filtered.map((c) => (
          // Config is keyed by title: config.categoryImages?.["Administrativa gränser"] = "kompass.png"
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
                    toListUrl({
                      kategori: c.title,
                      q: query.trim() || undefined,
                    }),
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
                    position: "relative",
                    bgcolor: "background.default",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    flexShrink: 0,
                  }}
                >
                  {(() => {
                    const src = categoryImgSrc(c.title);
                    const state = stateByUrl[src] ?? "idle";
                    const showSpinner = state !== "loaded" && state !== "error";

                    return (
                      <>
                        {showSpinner ? (
                          <CircularProgress
                            size={32}
                            sx={{ position: "absolute" }}
                            aria-label="Laddar bild"
                          />
                        ) : null}
                        <Box
                          component="img"
                          src={src}
                          alt={c.title}
                          loading="eager"
                          onLoad={() => markLoaded(src)}
                          onError={() => markError(src)}
                          sx={{
                            // Fill the header area consistently (may crop edges).
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                            opacity: state === "loaded" ? 1 : 0,
                            transition: "opacity 160ms ease",
                          }}
                        />
                      </>
                    );
                  })()}
                </Box>
                <CardContent sx={{ py: 1.5, width: "100%", flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ fontWeight: 700, textAlign: "center" }}
                  >
                    <Box
                      sx={{
                        display: "inline-grid",
                        gridTemplateColumns: "minmax(0, 1fr) auto",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: 1,
                        // Keep a consistent text-block height even when the title is short.
                        minHeight: "2.5em",
                        maxWidth: "100%",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          lineHeight: 1.25,
                          textAlign: "center",
                          // Allow wrapping/clamping within the grid cell.
                          minWidth: 0,
                        }}
                      >
                        {c.title}
                      </Box>
                      <Chip
                        size="small"
                        variant="filled"
                        label={
                          isLoading
                            ? "…"
                            : String(
                                query.trim()
                                  ? (matchesByKategori.get(c.title) ?? 0)
                                  : (countsByKategori.get(c.title) ?? 0),
                              )
                        }
                      />
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
