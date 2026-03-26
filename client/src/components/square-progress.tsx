import { Box, useTheme } from "@mui/material";
import { styled } from "@mui/system";

const FullScreenContainer = styled(Box)(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const SpinnerContainer = styled(Box)(() => ({
  position: "relative",
  display: "inline-block",
  width: "150px",
  height: "150px",
}));

export const SquareSpinnerComponent = () => {
  const { palette } = useTheme();
  return (
    <FullScreenContainer>
      <SpinnerContainer>
        <Box
          sx={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            opacity: "0.5",
            borderTop: `4px solid ${palette.text.primary}`,
            borderLeft: `4px solid ${palette.text.primary}`,
            borderRight: `4px solid ${palette.text.primary}`,
            borderBottom: `4px solid ${palette.text.primary}`,
            borderRadius: "20%",
            animation: "reverseSpin 2s linear infinite",
            "@keyframes reverseSpin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(-360deg)" },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "80%",
            height: "80%",
            opacity: "0.7",
            borderBottom: `8px solid ${palette.common.black}`,
            borderRight: `8px solid ${palette.common.black}`,
            borderTop: `8px solid ${palette.common.black}`,
            borderLeft: `8px solid ${palette.common.black}`,
            borderRadius: "30%",
            animation: "spin 1.6s linear infinite",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(360deg)",
              },
            },
          }}
        />
        <Box
          component="img"
          sx={{
            position: "absolute",
            top: "60%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            width: "100px",
            height: "100px",
            objectFit: "cover",
            opacity: "0.9",
            borderRadius: "4px",
            filter: `invert(${palette.mode === "light" ? 0 : 1})`,
          }}
          src={`${import.meta.env.BASE_URL.replace(
            /\/$/,
            ""
          )}/kba-spinner-logo.svg`}
        />
      </SpinnerContainer>
    </FullScreenContainer>
  );
};
