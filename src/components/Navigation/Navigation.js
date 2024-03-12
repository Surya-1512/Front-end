import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Navigation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="bright" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">WearNow</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
              <Nav.Link href="/weather">Weather</Nav.Link>
              <Nav.Link href="/try-on">Try-On</Nav.Link>
              <Nav.Link href="/occasion">Occasion</Nav.Link>
              <Nav.Link href="/men">Men</Nav.Link>
              <Nav.Link href="/women">Women</Nav.Link>
              <Nav.Link href="/bestseller">BestSellers</Nav.Link>
              <Nav.Link href="/recommand">Recommendation</Nav.Link>
              <Nav.Link href="/contact">Contact Us</Nav.Link>
              
            
            </Nav>
            {currentUser ? (
              <Button variant="outline-dark" onClick={handleSignout} style={{ marginLeft: "10px" }}>
                Logout
              </Button>
            ) : (
              <Nav.Link href="/login">Login/SignUp</Nav.Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
