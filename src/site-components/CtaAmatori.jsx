"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{"e-63":{"id":"e-63","name":"","animationType":"preset","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-41","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-64"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"a746127c-ff6d-c15d-3816-c3672c11eed3","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"a746127c-ff6d-c15d-3816-c3672c11eed3","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1705183193118}},"actionLists":{"a-41":{"id":"a-41","title":"Modal 1 [Open]","actionItemGroups":[{"actionItems":[{"id":"a-41-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".form-contattaci","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4be0"]},"value":"none"}},{"id":"a-41-n-2","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"","duration":200,"target":{"selector":".form-contattaci","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4be0"]},"value":0,"unit":""}},{"id":"a-41-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"selector":".modal1_content-wrapper-2","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4bdf"]},"yValue":100,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]},{"actionItems":[{"id":"a-41-n-4","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".form-contattaci","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4be0"]},"value":"flex"}},{"id":"a-41-n-5","actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"ease","duration":200,"target":{"selector":".form-contattaci","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4be0"]},"value":1,"unit":""}},{"id":"a-41-n-6","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"ease","duration":500,"target":{"selector":".modal1_content-wrapper-2","selectorGuids":["7ec9fe2c-41cd-2a15-a3ba-8fe0875f4bdf"]},"yValue":0,"xUnit":"PX","yUnit":"%","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1644220869174}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function CtaAmatori(
    {
        as: _Component = _Builtin.Block
    }
) {
    _interactions.useInteractions(_interactionsData);

    return (
        <_Component className="cta-amatori" tag="section"><_Builtin.Block className="section_cta29" tag="section"><_Builtin.Block className="padding-global" tag="div"><_Builtin.Block className="container-small" tag="div"><_Builtin.Block className="padding-section-large-3" tag="div"><_Builtin.Block className="text-align-center-2" tag="div"><_Builtin.Block className="margin-bottom" tag="div"><_Builtin.Block className="section-title-container no-color" tag="div"><_Builtin.Block className="spacer-medium" tag="div" /><_Builtin.Heading className="text-weight-semibold text-color-white" tag="h2">{"Tesserati con Triono"}</_Builtin.Heading><_Builtin.Paragraph className="text-size-medium text-color-white">{"scopri i vantaggi del tesseramento amatori e unisciti alla nostra comunità ciclistica appassionata. Tesserati ora!"}</_Builtin.Paragraph><_Builtin.Block className="spacer-medium" tag="div" /></_Builtin.Block></_Builtin.Block><_Builtin.Block className="margin-top" tag="div"><_Builtin.Block className="button-group is-center" tag="div"><_Builtin.Link
                                            className="pulsante1"
                                            data-w-id="a746127c-ff6d-c15d-3816-c3672c11eed3"
                                            button={true}
                                            block=""
                                            options={{
                                                href: "#"
                                            }}>{"Chiedi informazioni"}</_Builtin.Link><_Builtin.Link
                                            className="pulsante1 is-secondary"
                                            button={true}
                                            block=""
                                            options={{
                                                href: "https://www.trionoracing.it/gli-amatori-triono"
                                            }}>{"Scopri la squadra Triono"}</_Builtin.Link></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block><_Builtin.Block className="cta29_background-video-wrapper" tag="div"><_Builtin.Block className="video-overlay-layer" tag="div" /><_Builtin.BackgroundVideoWrapper
                        className="cta29_background-video"
                        tag="div"
                        data-beta-bgvideo-upgrade={false}
                        sources={[
                            "https://uploads-ssl.webflow.com/654772104c75805e8c012a75/658357dfb1e2021176c38393_Sequenza 01-transcode.webm",
                            "https://uploads-ssl.webflow.com/654772104c75805e8c012a75/658357dfb1e2021176c38393_Sequenza 01-transcode.mp4"
                        ]}
                        posterImage="https://uploads-ssl.webflow.com/654772104c75805e8c012a75/658357dfb1e2021176c38393_Sequenza 01-poster-00001.jpg"
                        autoPlay={true}
                        loop={true} /></_Builtin.Block></_Builtin.Block></_Component>
    );
}