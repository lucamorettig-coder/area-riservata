import * as React from "react";
import * as Types from "./types";

declare function Footer(
    props: {
        as?: React.ElementType;
        logo?: Types.Asset.Image;
    }
): React.JSX.Element