import * as React from "react";
import * as Types from "./types";

declare function Card1(
    props: {
        as?: React.ElementType;
        foto?: Types.Asset.Image;
        nome?: React.ReactNode;
        qualifica?: React.ReactNode;
    }
): React.JSX.Element