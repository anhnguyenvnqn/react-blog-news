import React, { useEffect } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import HomeBanner from '../components/module/home/HomeBanner';
import HomeFeature from '../components/module/home/HomeFeature';
import HomeList from '../components/module/home/HomeList';
import HomeNewest from '../components/module/home/HomeNewest';

const HomePageStyle = styled.div`

`

const HomePage = () => {
    useEffect(() => {
        document.title = "Blogging - HomePage";
      });
    return (
        <HomePageStyle>
            <Layout>             
                <HomeBanner></HomeBanner>
                <HomeFeature></HomeFeature>
                <HomeNewest></HomeNewest>
                <HomeList></HomeList>
                 
            </Layout>
        </HomePageStyle>
    );
};

export default HomePage;