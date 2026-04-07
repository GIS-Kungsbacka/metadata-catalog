import { Box, useTheme } from "@mui/material";
import { styled } from "@mui/system";
import { motion } from "motion/react";
import { useClientConfig } from "../config/client-config";
import { publicAssetUrl } from "../utils/public-asset-url";

const FullScreenContainer = styled(Box)({
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const SpinnerContainer = styled(Box)({
  position: "relative",
  width: 140,
  height: 140,
  backgroundColor: "transparent",
});

const MotionBox = motion.create(Box);
const MORPH_DURATION = 1.9;
const MORPH_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const MORPH_TIMES = [0, 0.5, 1];

export const SquareSpinnerComponent = () => {
  const { palette } = useTheme();
  const isLight = palette.mode === "light";
  const config = useClientConfig();

  const spinnerLogo = isLight
    ? config.spinnerLogoLight || "kba-spinner-logo.svg"
    : config.spinnerLogoDark || "kba-spinner-logo-two.svg";

  return (
    <FullScreenContainer>
      <SpinnerContainer>
        {/* OUTER SCALE WRAPPER */}
        <MotionBox
          animate={{
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: MORPH_DURATION,
            ease: MORPH_EASE,
            times: MORPH_TIMES,
            repeat: Infinity,
          }}
          sx={{
            position: "absolute",
            inset: 0,
            top: "-5%",
          }}
        >
          {/* OUTER ROTATION LAYER */}
          <MotionBox
            animate={{
              rotate: [0, 180, 360],
              borderRadius: ["20%", "50%", "20%"],
            }}
            transition={{
              duration: MORPH_DURATION,
              ease: MORPH_EASE,
              times: MORPH_TIMES,
              repeat: Infinity,
            }}
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              borderRadius: "20%",
              border: isLight
                ? "3px solid rgba(0, 0, 0, 0.95)"
                : "3px solid rgba(222, 219, 219, 0.98)",
              boxShadow: isLight
                ? "0 0 0 1px rgba(0,0,0,0.35), 0 0 18px rgba(0,0,0,0.18)"
                : "0 0 0 1px rgba(0,0,0,0.55), 0 0 22px rgba(0,0,0,0.3)",
              boxSizing: "border-box",
            }}
          />
        </MotionBox>

        {/* INNER SCALE WRAPPER */}
        <MotionBox
          animate={{
            scale: [1.08, 0.94, 1.08],
          }}
          transition={{
            duration: MORPH_DURATION,
            ease: MORPH_EASE,
            times: MORPH_TIMES,
            repeat: Infinity,
          }}
          sx={{
            position: "absolute",
            top: "8%",
            left: "12%",
            width: "76%",
            height: "76%",
          }}
        >
          {/* INNER ROTATION LAYER */}
          <MotionBox
            animate={{
              rotate: [0, -180, -360],
              borderRadius: ["24%", "50%", "24%"],
            }}
            transition={{
              duration: MORPH_DURATION,
              ease: MORPH_EASE,
              times: MORPH_TIMES,
              repeat: Infinity,
            }}
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "transparent",
              borderRadius: "24%",
              border: isLight
                ? "6px solid rgba(126, 126, 126, 0.98)"
                : "6px solid rgba(177, 176, 176, 0.98)",
              boxSizing: "border-box",
            }}
          />
        </MotionBox>

        {/* CENTER LOGO */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            zIndex: 3,
          }}
        >
          <Box
            component={motion.img}
            animate={{
              y: [0, -2, 0],
              scale: [1, 1.04, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: MORPH_DURATION,
              ease: MORPH_EASE,
              times: [0, 0.5, 1],
              repeat: Infinity,
            }}
            src={publicAssetUrl(spinnerLogo)}
            alt="Loading"
            sx={{
              width: 70,
              height: 70,
              objectFit: "contain",
              filter: isLight
                ? "rgba(24,119,242,0.25)"
                : "rgba(138,180,255,0.35)",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </Box>
      </SpinnerContainer>
    </FullScreenContainer>
  );
};
