import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Home = ({type}) => { // type prop passed down from routes

  const [videos, setVideos] = useState([]);
  useEffect(() => {
    const fetchVideos = async () => { // creating a seperate function otherwise async cannot be used within useEffect
      const res = await axios.get(`/videos/${type}`);
      setVideos(res.data);
    }
    fetchVideos();
  }, [type]) // will run only once

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video}/> // passing video into the card component
      ))}
    </Container>
  )
}

export default Home