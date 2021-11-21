import React from "react";
import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faCode,
  faHome,
  faParachuteBox,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className={styles.header}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          <FontAwesomeIcon icon={faParachuteBox} />
          &nbsp; Parachute
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav
            className={`me-auto`}
            variant="pills"
            defaultActiveKey={location.pathname}
            activeKey={location.pathname}
          >
            <Nav.Item>
              <Nav.Link as={Link} eventKey="/" to="/">
                <FontAwesomeIcon icon={faHome} />
                &nbsp; Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} eventKey="/airdrop" to="/airdrop">
                <FontAwesomeIcon icon={faPlane} />
                &nbsp; Airdrop
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                as={Link}
                eventKey="/address-fetcher"
                to="/address-fetcher"
              >
                <FontAwesomeIcon icon={faAddressBook} />
                &nbsp; Address Fetcher
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Nav.Item className={styles.navItem}>
              <Nav.Link
                target="_blank"
                href="https://github.com/exogenesys/parachute"
              >
                <div className="text-white text-bold">
                  <FontAwesomeIcon icon={faCode} />
                  &nbsp; Github
                </div>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
