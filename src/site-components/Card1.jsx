"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function Card1(
    {
        as: _Component = _Builtin.Block,
        foto = "",
        nome = "This is some text inside of a div block.",
        qualifica = "This is some text inside of a div block."
    }
) {
    return (
        <_Component className="team2_item shadow-xsmall" tag="div"><_Builtin.Block className="margin-bottom margin-small" tag="div"><_Builtin.Block className=" team2_image-wrapper" tag="div"><_Builtin.Image
                        className="team2_image"
                        width="auto"
                        height="auto"
                        loading="lazy"
                        alt=""
                        src={foto} /></_Builtin.Block></_Builtin.Block><_Builtin.Block className="margin-bottom margin-xsmall" tag="div"><_Builtin.Block className="text-wraper" tag="div"><_Builtin.Block className="text-size-large text-weight-semibold" tag="div">{nome}</_Builtin.Block></_Builtin.Block><_Builtin.Block className="margin-vertical margin-xxsmall" tag="div"><_Builtin.Block className="text-size-small" tag="div">{qualifica}</_Builtin.Block></_Builtin.Block></_Builtin.Block></_Component>
    );
}