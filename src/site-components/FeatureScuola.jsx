"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{"e-67":{"id":"e-67","name":"","animationType":"preset","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-41","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-68"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"655560191f91a5f72f198efd|494362d7-cd93-97e8-6c01-ec54374303c9","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"655560191f91a5f72f198efd|494362d7-cd93-97e8-6c01-ec54374303c9","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1705183268116},"e-93":{"id":"e-93","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-41","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-94"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"494362d7-cd93-97e8-6c01-ec54374303c9","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"494362d7-cd93-97e8-6c01-ec54374303c9","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1705189707082}},"actionLists":{"a-41":{"id":"a-41","title":"Modal 1 [Open]","actionItemGroups":[{"actionItems":[{"id":"a-41-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".form-contattaci","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4be0"]},"value":"none"}},{"id":"a-41-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":200,"target":{"selector":".form-contattaci","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4be0"]},"value":0,"unit":""}},{"id":"a-41-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".modal1_content-wrapper-2","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4bdf"]},"yValue":100,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"actionItems":[{"id":"a-41-n-4","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".form-contattaci","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4be0"]},"value":"flex"}},{"id":"a-41-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"ease","duration":200,"target":{"selector":".form-contattaci","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4be0"]},"value":1,"unit":""}},{"id":"a-41-n-6","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"ease","duration":500,"target":{"selector":".modal1_content-wrapper-2","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4bdf"]},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1644220869174}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function FeatureScuola(
    {
        as: _Component = _Builtin.Block,
        titoloH2 = "I punti di forza della scuola ciclismo Triono",
        image1 = "https://cdn.prod.website-files.com/654772104c75805e8c012a75/659aed71b26d4e6c1de2b8ad_Risorsa%2049.svg",
        testoPrimoBlocco = "Multidisciplinarietà:",
        dettaglioPrimoBlocco = "Offriamo un approccio multidisciplinare unico, abbracciando ciclismo su strada, mountain bike e free style, per sviluppare abilità versatili e una comprensione completa del mondo del ciclismo.",
        visibDettPrimoBlocco = true,
        image2 = "https://cdn.prod.website-files.com/654772104c75805e8c012a75/659ae8fdabd99e2054afef2f_Risorsa%2048.svg",
        testoSecondoBlocco = "Inclusività per Principianti e Esperti:",
        visibDettSecondoBlocco = true,
        visibDettTerzoBlocco = true,
        testoTerzoBlocco = "Focus sullo Sviluppo Giovanile:",
        image3 = "https://cdn.prod.website-files.com/654772104c75805e8c012a75/659b0df5b26d4e6c1df331b0_Risorsa%2050.svg",
        visibilitaBlocco3 = true,
        visibilitaCta = true,

        linkCta = {
            href: "#"
        },

        testoCta = "Chiedi informazioni",
        visibilitaPulsanteInfo = true,
        immagineGrande = "https://cdn.prod.website-files.com/654772104c75805e8c012a75/65479590f4d90d724ee7623e_2ef986a4-c426-4c9e-ba1b-1a3ca51769bf.JPG"
    }
) {
    _interactions.useInteractions(_interactionsData);

    return (
        <_Component className="feature-scuola" tag="section"><_Builtin.Block className="section_layout32" tag="section"><_Builtin.Block className="padding-global-7" tag="div"><_Builtin.Block className="container-large" tag="div"><_Builtin.Block className="padding-section-large-3" tag="div"><_Builtin.Block className="text-align-center" tag="div"><_Builtin.Block className="max-width-large align-center" tag="div"><_Builtin.Block className="margin-bottom margin-large" tag="div"><_Builtin.Block className="section-title-container is-yellow" tag="div"><_Builtin.Block className="spacer-medium" tag="div" /><_Builtin.Heading className="text-weight-semibold" tag="h2">{titoloH2}</_Builtin.Heading><_Builtin.Block className="spacer-medium" tag="div" /></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block><_Builtin.Grid className="layout32_component-2" tag="div"><_Builtin.Block className="layout32_content" tag="div"><_Builtin.Grid className="layout32_item-list-2" tag="div"><_Builtin.Block
                                            className="layout32_item-2"
                                            id="w-node-d2133143-b6ec-c5a6-fa2c-1ee2273f3099-976e201e"
                                            tag="div"><_Builtin.Block className="layout32_item-icon-wrapper-2" tag="div"><_Builtin.Image
                                                    className="icon-1x1-large"
                                                    loading="lazy"
                                                    width="auto"
                                                    height="auto"
                                                    alt=""
                                                    src={image1} /></_Builtin.Block><_Builtin.Block className="layout32_item-text-wrapper-2" tag="div"><_Builtin.Heading className="heading-style-h5" tag="h3">{testoPrimoBlocco}</_Builtin.Heading><_Builtin.Block className="spacer-xsmall-3" tag="div" />{visibDettPrimoBlocco ? <_Builtin.Paragraph>{dettaglioPrimoBlocco}</_Builtin.Paragraph> : null}</_Builtin.Block></_Builtin.Block><_Builtin.Block
                                            className="layout32_item-2"
                                            id="w-node-d2133143-b6ec-c5a6-fa2c-1ee2273f30a2-976e201e"
                                            tag="div"><_Builtin.Block className="layout32_item-icon-wrapper-2" tag="div"><_Builtin.Image
                                                    className="icon-1x1-large"
                                                    loading="lazy"
                                                    width="auto"
                                                    height="auto"
                                                    alt=""
                                                    src={image2} /></_Builtin.Block><_Builtin.Block className="layout32_item-text-wrapper-2" tag="div"><_Builtin.Heading className="heading-style-h5" tag="h3">{testoSecondoBlocco}</_Builtin.Heading><_Builtin.Block className="spacer-xsmall-3" tag="div" />{visibDettSecondoBlocco ? <_Builtin.Paragraph>{"La nostra scuola è aperta a tutti: dai principianti che imparano a pedalare per la prima volta, ai giovani ciclisti già esperti che desiderano perfezionare le loro abilità."}</_Builtin.Paragraph> : null}</_Builtin.Block></_Builtin.Block>{visibilitaBlocco3 ? <_Builtin.Block
                                            className="layout32_item-2"
                                            id="w-node-d2133143-b6ec-c5a6-fa2c-1ee2273f30ab-976e201e"
                                            tag="div"><_Builtin.Block className="layout32_item-icon-wrapper-2" tag="div"><_Builtin.Image
                                                    className="icon-1x1-large"
                                                    loading="lazy"
                                                    width="auto"
                                                    height="auto"
                                                    alt=""
                                                    src={image3} /></_Builtin.Block><_Builtin.Block className="layout32_item-text-wrapper-2" tag="div"><_Builtin.Heading className="heading-style-h5" tag="h3">{testoTerzoBlocco}</_Builtin.Heading><_Builtin.Block className="spacer-xsmall-3" tag="div" />{visibDettTerzoBlocco ? <_Builtin.Paragraph>{"La nostra missione è introdurre i bambini al ciclismo fin dall'infanzia, offrendo un percorso formativo che inizia dalle basi, come il pedalare con le rotelle, fino al raggiungimento di tecniche avanzate."}</_Builtin.Paragraph> : null}</_Builtin.Block></_Builtin.Block> : null}</_Builtin.Grid><_Builtin.Block className="spacer-medium" tag="div" /><_Builtin.Block className="button-group" tag="div">{visibilitaCta ? <_Builtin.Link
                                            className="pulsante1"
                                            data-w-id="494362d7-cd93-97e8-6c01-ec54374303c9"
                                            button={true}
                                            block=""
                                            options={linkCta}>{testoCta}</_Builtin.Link> : null}{visibilitaPulsanteInfo ? <_Builtin.Link
                                            className="pulsante1 is-secondary"
                                            button={true}
                                            block=""
                                            options={{
                                                href: "https://www.trionoracing.it/la-scuola"
                                            }}>{"Scopri la scuola Triono"}</_Builtin.Link> : null}</_Builtin.Block></_Builtin.Block><_Builtin.Block className="layout32_image-wrapper-2" tag="div"><_Builtin.Image
                                        className="layout32_image"
                                        loading="lazy"
                                        width="auto"
                                        height="auto"
                                        alt=""
                                        src={immagineGrande} /></_Builtin.Block></_Builtin.Grid></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Component>
    );
}