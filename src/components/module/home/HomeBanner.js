import React from "react";
import styled from "styled-components";
import { Button } from "../../button";

const HomeBanerStyle = styled.div`
  margin-bottom: 30px;
  min-height: 520px;
 background-image: linear-gradient(
      to right bottom,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary}
    );
  .banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
   

  }
  .banner-content {
    max-width: 400px;
    color: white;
  }
  .banner-heading {
    margin-bottom: 28px;
  }
  .banner-decs {
    margin-bottom: 48px;
  }
`;
const HomeBanner = () => {
  return (
    <HomeBanerStyle>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-heading">My blogging</h1>
            <p className="banner-decs">
              Lorem Lorem Lorem Lorem Lorem Lorem Lorem Lorem
            </p>
            <Button kind="secondary" to="/sign-up">
              {" "}
              Get Started
            </Button>
          </div>
          <div className="banner-img">
            <img src="../banner.png" alt="banner-img"></img>
          </div>
        </div>
      </div>
    </HomeBanerStyle>
  );
};

export default HomeBanner;
