import * as React from "react";
import * as Types from "./types";

declare function Navbar(
    props: {
        as?: React.ElementType;
        logo?: Types.Asset.Image;
        visibilitaScuola?: Types.Visibility.VisibilityConditions;
        visibilitaBikePark?: Types.Visibility.VisibilityConditions;
        visibilitaHome?: Types.Visibility.VisibilityConditions;
        contattaciVisibile?: Types.Visibility.VisibilityConditions;
        visibilitaContattaci?: Types.Visibility.VisibilityConditions;
    }
): React.JSX.Element