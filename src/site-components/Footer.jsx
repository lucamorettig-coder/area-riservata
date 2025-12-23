"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function Footer(
    {
        as: _Component = _Builtin.Block,
        logo = "https://cdn.prod.website-files.com/654772104c75805e8c012a75/679f3efad768870c74a1d914_Progetto%20senza%20titolo.svg"
    }
) {
    return (
        <_Component className="footer" tag="footer"><_Builtin.Block className="padding-global" tag="div"><_Builtin.Block className="container-large" tag="div"><_Builtin.Block className="padding-vertical padding-xxlarge" tag="div"><_Builtin.Block className="padding-bottom padding-xxlarge" tag="div"><_Builtin.Grid className="footer4_top-wrapper" tag="div"><_Builtin.NavbarBrand
                                    className="footer4_logo-link"
                                    id="w-node-c2b68f09-b48e-1f5d-4ade-09ca1c27b7fc-1c27b7f6"
                                    options={{
                                        href: "#"
                                    }}><_Builtin.Image
                                        className="image-3"
                                        loading="lazy"
                                        width="196"
                                        height="auto"
                                        alt=""
                                        src={logo} /></_Builtin.NavbarBrand><_Builtin.Grid className="footer4_link-list" tag="div"><_Builtin.Link
                                        className="footer4_link"
                                        button={false}
                                        block=""
                                        options={{
                                            href: "https://www.trionoracing.it/la-scuola"
                                        }}>{"La Scuola"}</_Builtin.Link><_Builtin.Link
                                        className="footer4_link"
                                        button={false}
                                        block=""
                                        options={{
                                            href: "https://www.trionoracing.it/triono-bike-park"
                                        }}>{"Il Bike Park"}</_Builtin.Link><_Builtin.Link
                                        className="footer4_link"
                                        button={false}
                                        block=""
                                        options={{
                                            href: "https://www.duezeronove.it/",
                                            target: "_blank"
                                        }}>{"La 209"}</_Builtin.Link></_Builtin.Grid><_Builtin.Grid
                                    className="footer4_social-list"
                                    id="w-node-c2b68f09-b48e-1f5d-4ade-09ca1c27b809-1c27b7f6"
                                    tag="div"><_Builtin.Link
                                        className="footer4_social-link"
                                        button={false}
                                        block="inline"
                                        options={{
                                            href: "https://www.facebook.com/profile.php?id=100057197720679",
                                            target: "_blank"
                                        }}><_Builtin.HtmlEmbed
                                            className="icon-embed-xsmall"
                                            value="%3Csvg%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewbox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20d%3D%22M22%2012.0611C22%206.50451%2017.5229%202%2012%202C6.47715%202%202%206.50451%202%2012.0611C2%2017.0828%205.65684%2021.2452%2010.4375%2022V14.9694H7.89844V12.0611H10.4375V9.84452C10.4375%207.32296%2011.9305%205.93012%2014.2146%205.93012C15.3088%205.93012%2016.4531%206.12663%2016.4531%206.12663V8.60261H15.1922C13.95%208.60261%2013.5625%209.37822%2013.5625%2010.1739V12.0611H16.3359L15.8926%2014.9694H13.5625V22C18.3432%2021.2452%2022%2017.083%2022%2012.0611Z%22%20fill%3D%22CurrentColor%22%2F%3E%0A%3C%2Fsvg%3E" /></_Builtin.Link><_Builtin.Link
                                        className="footer4_social-link"
                                        button={false}
                                        block="inline"
                                        options={{
                                            href: "https://www.instagram.com/trionoracing_sccentrobici?igsh=dHg4dHFjYzEycXRs",
                                            target: "_blank"
                                        }}><_Builtin.HtmlEmbed
                                            className="icon-embed-xsmall"
                                            value="%3Csvg%20width%3D%22100%25%22%20height%3D%22100%25%22%20viewbox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M16%203H8C5.23858%203%203%205.23858%203%208V16C3%2018.7614%205.23858%2021%208%2021H16C18.7614%2021%2021%2018.7614%2021%2016V8C21%205.23858%2018.7614%203%2016%203ZM19.25%2016C19.2445%2017.7926%2017.7926%2019.2445%2016%2019.25H8C6.20735%2019.2445%204.75549%2017.7926%204.75%2016V8C4.75549%206.20735%206.20735%204.75549%208%204.75H16C17.7926%204.75549%2019.2445%206.20735%2019.25%208V16ZM16.75%208.25C17.3023%208.25%2017.75%207.80228%2017.75%207.25C17.75%206.69772%2017.3023%206.25%2016.75%206.25C16.1977%206.25%2015.75%206.69772%2015.75%207.25C15.75%207.80228%2016.1977%208.25%2016.75%208.25ZM12%207.5C9.51472%207.5%207.5%209.51472%207.5%2012C7.5%2014.4853%209.51472%2016.5%2012%2016.5C14.4853%2016.5%2016.5%2014.4853%2016.5%2012C16.5027%2010.8057%2016.0294%209.65957%2015.1849%208.81508C14.3404%207.97059%2013.1943%207.49734%2012%207.5ZM9.25%2012C9.25%2013.5188%2010.4812%2014.75%2012%2014.75C13.5188%2014.75%2014.75%2013.5188%2014.75%2012C14.75%2010.4812%2013.5188%209.25%2012%209.25C10.4812%209.25%209.25%2010.4812%209.25%2012Z%22%20fill%3D%22CurrentColor%22%2F%3E%0A%3C%2Fsvg%3E" /></_Builtin.Link></_Builtin.Grid></_Builtin.Grid></_Builtin.Block><_Builtin.Block className="line-divider" tag="div" /><_Builtin.Block className="padding-top padding-medium" tag="div"><_Builtin.Grid className="footer4_bottom-wrapper" tag="div"><_Builtin.Block
                                    className="footer4_credit-text"
                                    id="w-node-c2b68f09-b48e-1f5d-4ade-09ca1c27b817-1c27b7f6"
                                    tag="div">{"© 2025 Triono. All rights reserved."}</_Builtin.Block><_Builtin.Link
                                    className="footer4_legal-link"
                                    button={false}
                                    block=""
                                    options={{
                                        href: "#"
                                    }}>{"Privacy Policy"}</_Builtin.Link><_Builtin.Link
                                    className="footer4_legal-link"
                                    button={false}
                                    block=""
                                    options={{
                                        href: "#"
                                    }}>{"Terms of Service"}</_Builtin.Link><_Builtin.Link
                                    className="footer4_legal-link"
                                    button={false}
                                    block=""
                                    options={{
                                        href: "#"
                                    }}>{"Cookies Settings"}</_Builtin.Link></_Builtin.Grid></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Builtin.Block></_Component>
    );
}