
import AppRouter from "./routes/AppRouter";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  
  body {
    background-color: white;
    margin: 0;
    color: black;
    font-family: 'Livvic';
    font-size: 16px;
  }
`;

const App: React.FC = () => {
  return (
    <div className="App">
      <GlobalStyle />
      <AppRouter />
    </div>
  )
}

export default App
