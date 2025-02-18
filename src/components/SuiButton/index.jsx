/**
=========================================================
* Soft UI Dashboard React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { forwardRef } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Custom styles for SuiButton
import SuiButtonRoot from "~/components/SuiButton/SuiButtonRoot";

const SuiButton = forwardRef(
  ({ color, variant, size, circular, iconOnly, children, ...rest }, ref) => {
    const protectBtnClick = (event) => {
      if (rest && rest.onClick) {
        rest.onClick(event);
        const target = event.currentTarget;
        target.disabled = true;
        setTimeout(() => {
          if (target) target.disabled = false;
        }, 1000);
      }
    };

    return (
      <SuiButtonRoot
        {...rest}
        ref={ref}
        variant={variant === "gradient" ? "contained" : variant}
        size={size}
        ownerState={{ color, variant, size, circular, iconOnly }}
        onClick={protectBtnClick}
      >
        {children}
      </SuiButtonRoot>
    );
  }
);

// Setting default values for the props of SuiButton
SuiButton.defaultProps = {
  size: "medium",
  variant: "contained",
  color: "white",
  circular: false,
  iconOnly: false,
};

// Typechecking props for the SuiButton
SuiButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  variant: PropTypes.oneOf(["text", "contained", "outlined", "gradient"]),
  color: PropTypes.string,
  circular: PropTypes.bool,
  iconOnly: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default SuiButton;
