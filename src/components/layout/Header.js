import React from "react";
import { Link, NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/auth-context";
import { Button } from "../button";

const menuLinks = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/myproject",
    title: "My Project",
  },
  // {
  //   url: "/contact",
  //   title: "Contact",
  // },
];

const HeaderStyle = styled.header`
  font-size: 18px;
  padding: 40px;
  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .logo {
    display: block;
    max-width: 50px;
  }
  .menu {
    display: flex;
    align-items: center;
    list-style: none; 
    gap: 20px;
    margin-left: 40px;
    font-weight: 500;
    color: ${props => props.theme.primary};

  }
  .menu-item {
    &.active,
    &:hover {
      background: #f1fbf7;
      color: ${(props) => props.theme.green23B};
    }
  }

  /* .search {
    margin-left: auto;
    align-items: center;
    position: relative;

    width: 100%;
    max-width: 320px;
    padding: 20px;
    margin-right: 20px;

    border: 1px solid #eee;
    border-radius: 8px;
  }
  .search-input {
    flex: 1;
    padding-right: 45px;
  }
  .search-icon {
    position: absolute;
    top: 50%;
    right: 25px;
    transform: translateY(-50%);
  } */
  .header-button {
    margin-left: 20px;
  }
  .header-auth {
      display: flex;
      align-items: center;
      gap: 20px;
      strong {
        @media screen and (max-width: 768px) {
          display: none;
        }
      }
      span {
        color: ${props => props.theme.primary};
        @media screen and (max-width: 768px) {
          display: none;
        }
      }
      .avatar {
        width: 52px;
        height: 52px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 100rem;
         
        }
      }
    }
    `;
function getLastName(name) {
  if (!name) return "User";
  const length = name.split(" ").length;
  return name.split(" ")[length - 1];
}

const Header = () => {
  const { userInfo } = useAuth();

  return (
    <HeaderStyle>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img
              srcSet="../logo.png"
              alt="monkey-blogging"
              className="logo"
            ></img>
          </NavLink>
          <ul className="menu">
            {menuLinks.map((item) => (
              <li className="menu-item" key={item.title}>
                <NavLink to={item.url} className="menu-link">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* <div className="search">
            <input
              type="text"
              className="search-input"
              placeholder="Search posts..."
            />
            <span className="search-icon">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse
                  cx="7.66669"
                  cy="7.05161"
                  rx="6.66669"
                  ry="6.05161"
                  stroke="#999999"
                  strokeWidth="1.5"
                />
                <path
                  d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div> */}
 
          {!userInfo ? (
            <Button
              type="button"
              to="/sign-in"
              height="46px" 
              className="header-button"
            >
              Sign In
            </Button>
          ) : (
            <div className="header-auth">
              <span>Welcome Back! </span>
              <strong>{getLastName(userInfo?.displayName)}</strong>
              <Link to="/profile" className="avatar">
                <img src={userInfo?.avatar} alt="" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </HeaderStyle>
  );
};

export default Header;
