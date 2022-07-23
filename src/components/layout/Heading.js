import React from "react";
import styled from "styled-components";


const HeadingStyles = styled.h2`
  position: relative;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 30px;
  font-family: "Montserrat", sans-serif ;
  color: ${props => props.theme.green23B};
  &:before {
    content: "";
    width: 50px;
    height: 4px;
    background-image: linear-gradient(
      to right bottom,
      ${(props) => props.theme.accent},
      ${(props) => props.theme.secondary}
    );
    position: absolute;
    top: -8px;
    left: 0;
    transform: translate(0, -150%);
  }
  @media screen and (max-width: 1023.98px) {
    font-size: 22px;
    margin-bottom: 20px;
  }
`;
const Heading = ({ className = "", children }) => {
  return <HeadingStyles className={className}>{children}</HeadingStyles>;
};

export default Heading;
