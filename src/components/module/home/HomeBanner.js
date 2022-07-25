import React from "react";
import styled from "styled-components";
import { Button } from "../../button";

const HomeBanerStyle = styled.div`
  margin-bottom: 30px;
  min-height: 440px;
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
    font-size: 30px;
    margin-bottom: 24px;
  }
  .banner-decs {
    margin-bottom: 34px;
    @media screen and (max-width: 768px) {
      font-size: 16px;
      line-height: 18px;
    }
  }
  button {
    @media screen and (max-width: 768px) {
      height: 46px;
    }
  }
  @media screen and (max-width: 768px) {
    min-height: 330px;
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
              Hiện nay có rất nhiều người có xu hướng viết lách và mong muốn tạo
              riêng cho mình một blog cá nhân nhưng lại ngại lập cho mình một
              blog cá nhân trên website bởi các thao tác thường phức tạp. Chính
              vì vậy mình đã thực hiện ý tưởng là làm website để mọi người có
              thể lưu trữ các bài viết của mình và có thể chia sẻ với mọi người
              xung quanh.
            </p>
            <Button kind="secondary" to="/sign-up">
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
