import logo from './logo.svg';
import './App.css';
import {Container,Typography} from "@material-ui/core";
import Order from "./components/Order";
import './Images/bc.jpg';



function App() {
  return (
    <div className="App-header" >
   <Container maxWidth="md">
      <Typography 
      gutterBottom
      variant="h2"
      align="center">Shopping App</Typography>
      <Order/>
    </Container>
    </div>
  );
}

export default App;
