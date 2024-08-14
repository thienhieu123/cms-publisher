/**
=========================================================
* Soft UI Dashboard React - v3.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav } = ownerState;

  const { text, transparent } = palette;
  const { xxl } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    background: active && transparentSidenav ? "var(--red-200)" : transparent.main,
    color: active ? "#00a1e4" : text.main,
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: `${pxToRem(10.8)} ${pxToRem(12.8)} ${pxToRem(10.8)} ${pxToRem(16)}`,
    margin: `0 ${pxToRem(16)}`,
    borderRadius: borderRadius.md,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    boxShadow: active && transparentSidenav ? xxl : "none",
    [breakpoints.up("xl")]: {
      boxShadow: () => {
        if (active) {
          return transparentSidenav ? xxl : "none";
        }

        return "none";
      },
      transition: transitions.create("box-shadow", {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },
  };
}

function collapseIconBox(theme, ownerState) {
  const { palette, transitions, breakpoints, borders, functions } = theme;
  const { active, transparentSidenav, color } = ownerState;

  const { light, gradients } = palette;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    background: () => {
      if (active) {
        return "#F10035";
      }
      return "transparent";
      // return "white";
    },

    // opacity: 0,
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    borderRadius: borderRadius.md,
    // display: "flex",
    // justifyContent: "center",
    marginLeft: "15px",
    paddingTop: "4px",
    // placeItems: "center",
    transition: transitions.create("margin", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    [breakpoints.up("xl")]: {
      background: () => {
        let background;

        if (!active) {
          background = transparentSidenav ? "transparent" : light.main;
        } else if (color === "default") {
          background = "transparent";
        } else if (color === "warning") {
          background = gradients.warning.main;
        } else {
          background = "transparent";
        }

        return background;
      },
    },

    "& svg, svg g": {
      fill: active ? "white" : gradients.dark.state,
    },
  };
}

const collapseIcon = ({ palette: { white, gradients } }, { active }) => ({
  color: active ? white.main : gradients.dark.state,
});

function collapseText(theme, ownerState) {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, transparentSidenav, active } = ownerState;

  const { size, fontWeightMedium, fontWeightRegular } = typography;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(12.8),

    [breakpoints.up("xl")]: {
      opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
      maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
      marginLeft: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : pxToRem(12.8),
      transition: transitions.create(["opacity", "margin"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& span": {
      fontWeight: active ? fontWeightMedium : fontWeightRegular,
      fontSize: size.sm,
      lineHeight: 0,
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText };
