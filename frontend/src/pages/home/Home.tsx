
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const Home: React.FC = () => {
  return (
    <Container>
      <Title>Welcome to the Home Page</Title>
    </Container>
  );
};

export default Home;
