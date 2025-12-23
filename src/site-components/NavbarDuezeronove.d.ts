import * as React from "react";
import * as Types from "./types";

declare function NavbarDuezeronove(
    props: {
        as?: React.ElementType;
        logo?: Types.Asset.Image;
        titolo1Visibilita?: Types.Visibility.VisibilityConditions;
        visibilitaBikePark?: Types.Visibility.VisibilityConditions;
        visibilitaHome?: Types.Visibility.VisibilityConditions;
        contattaciVisibile?: Types.Visibility.VisibilityConditions;
        visibilitaContattaci?: Types.Visibility.VisibilityConditions;
        titolo1Testo?: React.ReactNode;
        titolo2Visibilita?: Types.Visibility.VisibilityConditions;
        titolo2Testo?: React.ReactNode;
        titolo3Visibilita?: Types.Visibility.VisibilityConditions;
        titolo3Testo?: React.ReactNode;
        testoCta?: React.ReactNode;
        linkCta?: Types.Basic.Link;
    }
): React.JSX.Element