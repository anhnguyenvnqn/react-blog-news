import React from "react";
import styled from "styled-components";
import { useController } from "react-hook-form";


const TextAreaStyles = styled.div`
  position: relative;
  width: 100%;
  textarea {
    width: 100%;
    min-height: 100px;
    border-radius: 8px;
    border: 1px solid transparent;
    font-size: 14px ;
    font-weight: 500;
    padding: ${(props) => (props.hasIcon ? "20px 60px 20px 20px" : "20px")};
    background-color: ${(props) => props.theme.grayLight};
    resize: none;
    transition: all 0.2s linear;
  }
  textarea:focus {
    background-color: white;
    border-color: ${(props) => props.theme.primary};
  }
  textarea::-webkit-input-placeholder {
    color: #84878b;
  }
  textarea::-moz-input-placeholder {
    color: #84878b;
  }
  .textarea-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

const TextArea = ({
    name = "",
    type = "text",
    children,
    control,
    ...props 
}) => {
    const { field } = useController({
        control,
        name,
        defaultValue: "",
    });
    return (
        <TextAreaStyles hasIcon={children ? true : false}>
            <textarea id={name} type={type} {...field} {...props} />
            {children}
        </TextAreaStyles>
    );
};

export default TextArea;
