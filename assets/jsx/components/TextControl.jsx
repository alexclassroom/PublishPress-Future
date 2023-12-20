/*
 * Copyright (c) 2023. PublishPress, All rights reserved.
 */
import { Fragment } from "&wp.element";
import { TextControl as WPTextControl } from "&wp.components";

export const TextControl = function (props) {
    let description;

    if (props.unescapedDescription) {
        // If using this option, the HTML has to be escaped before injected into the JS interface.
        description = <p className="description" dangerouslySetInnerHTML={{ __html: props.description }}></p>;
    } else {
        description = <p className="description">{props.description}</p>;
    }

    const onChange = function (value) {
        if (props.onChange) {
            props.onChange(value);
        }
    };

    return (
        <Fragment>
            <WPTextControl
                type="text"
                label={props.label}
                name={props.name}
                id={props.name}
                className={props.className}
                value={props.value}
                placeholder={props.placeholder}
                onChange={onChange}
            />

            {description}
        </Fragment>
    )
}
