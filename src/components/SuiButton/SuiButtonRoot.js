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

// @mui material components
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export default styled(Button)(({ theme, ownerState }) => {
  const { palette, functions, borders } = theme;
  const { color, variant, size, circular, iconOnly } = ownerState;

  const { white, text, transparent, gradients } = palette;
  const { boxShadow, linearGradient, pxToRem, rgba } = functions;
  const { borderRadius } = borders;

  // styles for the button with variant="contained"
  const containedStyles = () => {
    // background color value
    let backgroundValue;
    if (color === "info") {
      backgroundValue = "linear-gradient(#40c5f4, #009de3)";
    } else {
      backgroundValue = palette[color] ? palette[color].main : color;
    }
    // backgroundColor value when button is focused
    const focusedBackgroundValue = palette[color] ? palette[color].focus : color;

    // boxShadow value
    // const boxShadowValue = palette[color]
    //   ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
    //   : boxShadow([0, 0], [0, 3.2], dark.main, 0.5);

    // color value
    let colorValue = white.main;

    if (color === "white") {
      colorValue = text.main;
    } else if (color === "light") {
      colorValue = gradients.dark.state;
    } else if (color === "#f2f2f2") {
      colorValue = "#0ba4e5";
    } else {
      colorValue = white.main;
    }

    // color value when button is focused
    let focusedColorValue = white.main;

    if (color === "white") {
      focusedColorValue = text.main;
    } else if (color === "primary" || color === "error" || color === "dark") {
      focusedColorValue = white.main;
    }
    return {
      width: "max-content",
      minWidth: "auto",
      background: backgroundValue,
      color: colorValue,

      "&:hover": {
        backgroundColor: backgroundValue,
      },

      "&:focus:not(:hover)": {
        backgroundColor: focusedBackgroundValue,
        // boxShadow: boxShadowValue,
      },

      "&:disabled": {
        backgroundColor: "light",
        color: focusedColorValue,
      },
    };
  };

  // styles for the button with variant="outlined"
  const outliedStyles = () => {
    // background color value
    const backgroundValue = color === "white" ? rgba(white.main, 0.1) : transparent.main;

    // color value
    const colorValue = palette[color] ? palette[color].main : white.main;

    // boxShadow value
    const boxShadowValue = palette[color]
      ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
      : boxShadow([0, 0], [0, 3.2], white.main, 0.5);

    // border color value
    let borderColorValue = palette[color] ? palette[color].main : rgba(white.main, 0.75);

    if (color === "white") {
      borderColorValue = rgba(white.main, 0.75);
    }

    return {
      width: "max-content",
      minWidth: "auto",
      background: backgroundValue,
      color: colorValue,
      borderColor: borderColorValue,

      "&:hover": {
        background: transparent.main,
        borderColor: colorValue,
      },

      "&:focus:not(:hover)": {
        background: transparent.main,
        boxShadow: boxShadowValue,
      },

      "&:active:not(:hover)": {
        backgroundColor: colorValue,
        color: white.main,
        opacity: 0.85,
      },

      "&:disabled": {
        color: colorValue,
        borderColor: colorValue,
      },
    };
  };

  // styles for the button with variant="gradient"
  const gradientStyles = () => {
    // background value
    const backgroundValue =
      color === "white" || !gradients[color]
        ? white.main
        : linearGradient(gradients[color].main, gradients[color].state);

    // color value
    let colorValue = white.main;

    if (color === "white") {
      colorValue = text.main;
    } else if (color === "light") {
      colorValue = gradients.dark.state;
    }

    return {
      width: "max-content",
      minWidth: "auto",
      background: backgroundValue,
      color: colorValue,

      "&:focus:not(:hover)": {
        boxShadow: "none",
      },

      "&:disabled": {
        background: backgroundValue,
        color: colorValue,
      },
    };
  };

  // styles for the button with variant="text"
  const textStyles = () => {
    // color value
    const colorValue = palette[color] ? palette[color].main : white.main;

    // color value when button is focused
    const focusedColorValue = palette[color] ? palette[color].focus : white.focus;

    return {
      color: colorValue,
      width: "max-content",
      minWidth: "auto",
      "&:hover": {
        color: focusedColorValue,
      },

      "&:focus:not(:hover)": {
        color: focusedColorValue,
      },
    };
  };

  // styles for the button with circular={true}
  const circularStyles = () => ({
    borderRadius: borderRadius.section,
  });

  // styles for the button with iconOnly={true}
  const iconOnlyStyles = () => {
    // width, height, minWidth and minHeight values
    let sizeValue = pxToRem(38);

    if (size === "small") {
      sizeValue = pxToRem(24);
    } else if (size === "large") {
      sizeValue = pxToRem(52);
    }

    // padding value
    let paddingValue = `${pxToRem(11)} ${pxToRem(11)} ${pxToRem(10)}`;

    if (size === "small") {
      paddingValue = pxToRem(4.5);
    } else if (size === "large") {
      paddingValue = pxToRem(16);
    }

    return {
      width: sizeValue,
      minWidth: sizeValue,
      height: sizeValue,
      minHeight: sizeValue,
      padding: paddingValue,

      "& .material-icons": {
        marginTop: 0,
      },

      "&:hover, &:focus, &:active": {
        transform: "none",
      },
    };
  };

  return {
    ...(variant === "contained" && containedStyles()),
    ...(variant === "outlined" && outliedStyles()),
    ...(variant === "gradient" && gradientStyles()),
    ...(variant === "text" && textStyles()),
    ...(circular && circularStyles()),
    ...(iconOnly && iconOnlyStyles()),
  };
});
