import * as React from "react";
import * as Types from "./types";

declare function FeatureScuola(
    props: {
        as?: React.ElementType;
        titoloH2?: React.ReactNode;
        image1?: Types.Asset.Image;
        testoPrimoBlocco?: React.ReactNode;
        dettaglioPrimoBlocco?: React.ReactNode;
        visibDettPrimoBlocco?: Types.Visibility.VisibilityConditions;
        image2?: Types.Asset.Image;
        testoSecondoBlocco?: React.ReactNode;
        visibDettSecondoBlocco?: Types.Visibility.VisibilityConditions;
        visibDettTerzoBlocco?: Types.Visibility.VisibilityConditions;
        testoTerzoBlocco?: React.ReactNode;
        image3?: Types.Asset.Image;
        visibilitaBlocco3?: Types.Visibility.VisibilityConditions;
        visibilitaCta?: Types.Visibility.VisibilityConditions;
        linkCta?: Types.Basic.Link;
        testoCta?: React.ReactNode;
        visibilitaPulsanteInfo?: Types.Visibility.VisibilityConditions;
        immagineGrande?: Types.Asset.Image;
    }
): React.JSX.Element