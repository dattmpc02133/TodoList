import {Outlet} from "react-router-dom";
import Header from "./components/Header/Header";
import { Container } from "react-bootstrap";


function App() {
  return (
    <>
         <Header/>

       <Container> <Outlet /></Container>
    </>
  );
}

export default App;
