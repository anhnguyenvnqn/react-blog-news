import React from 'react';
import styled, { css } from 'styled-components';
import { LoadingSpinner } from '../loading';
import { NavLink } from 'react-router-dom';
import propTypes, { node } from "prop-types"

const ButtonStyles = styled.button` 
padding: 0 24px;
border-radius:8px;
font-weight: 600;
font-size: 18px;
line-height: 1;
color: white;
cursor: pointer;


height: ${props => props.height || "66px"};
width: ${props => props.width || "100%"};

${props => props.kind === "secondary" && css`

background-color: white;
color: ${props => props.theme.primary};
`}

${props => props.kind === "primary" && css`
    color: white;
    background-image: linear-gradient(
    to right bottom,
    ${props => props.theme.primary},
    ${props => props.theme.secondary}
    );
`};

&:disabled {
    opacity: 0.5;
    pointer-events: none;
}
`
/**
 * @param {*} onClick Handler onClick
 * @requires
 * @param {string} type type of 'button' || 'submit'
 * @returns 
 */

const Button = ({ type = 'button', onClick = () => {}, children, kind='primary', ...props }) => {
    const { isLoading, to } = props;
    // !! là conver thành bolume
    const child = !!isLoading ? <LoadingSpinner></LoadingSpinner> : children;
    if (to !== "" && typeof to === "string") {
        return (
            <NavLink to={to} style={{display:'inline-block'}}>
                <ButtonStyles type={type} onClick={onClick} kind={kind} {...props}>
                    {child}
                </ButtonStyles>
            </NavLink>
        )
    }
    return (
        <ButtonStyles type={type} onClick={onClick} kind={kind} {...props} >
            {child}
        </ButtonStyles>
    );
};
// dùng propTypes để bắt lỗi, cảnh báo ở devtool, gợi ý khi hover vào component
Button.propTypes = {
    type: propTypes.oneOf(["button", "submit"]),
    isLoading: propTypes.bool,
    onClick: propTypes.func,
    children: propTypes.node,
    kind: propTypes.oneOf(["primary", "secondary"]),

}

export default Button;