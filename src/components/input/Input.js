import React from "react";
import styled from "styled-components";
import { useController } from "react-hook-form";
import propTypes from "prop-types";

const InputStyles = styled.div`
  position: relative;
  width: 100%;
  input {
    width: 100%;
    padding: ${(props) => (props.hasIcon ? "20px 60px 20px 20px" : "20px")};
    background-color: ${(props) => props.theme.grayLight};
    transition: all 0.2s linear;

    font-weight: 500;
    border-radius: 8px;
    border: 1px solid transparent;
  }
  input:focus {
    background-color: white;
    border-color: ${(props) => props.theme.primary};
  }
  //màu placeholder
  input::-webkit-input-placeholder {
    color: #84878b;
  }
  input::-moz-input-placeholder {
    color: #84878b;
  }
  .input-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;

const Input = ({ name = "", type = "text", children, control, ...props }) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });
  return (
    //vì input là thẻ đóng ko truyền đc childen, nên sử dụng 1 thẻ div bọc ngoài, bên trong có input và icon
    <InputStyles hasIcon={children ? true : false}>
      <input id={name} type={type} {...field} {...props} />
      {children ? <div className="input-icon">{children}</div>:null}
    </InputStyles>
  );
};
Input.propTypes = {
  name: propTypes.string,
  type: propTypes.string,
  children: propTypes.any,
  control: propTypes.any,
};
export default Input;
