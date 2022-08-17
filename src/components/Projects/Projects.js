import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
// import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function Projects() {
  const [gitpro, setGitpro] = useState([]);

  const fetchData = () => {
    fetch("https://api.github.com/users/Utsav173/repos")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setGitpro(data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {gitpro.map((e) => {
            return (
              <Col md={4} className="project-card" key={e.id}>
                <Card className="project-card-view">
                  <Card.Body>
                    <Card.Title variant="h3">{e.name}</Card.Title>
                    <Card.Text style={{ textAlign: "justify" }}>
                      Description: {e.description}
                    </Card.Text>
                    <Card.Text style={{ textAlign: "justify" }}>
                      Major Language: {e.language}
                    </Card.Text>
                    <Card.Text style={{ textAlign: "justify" }}>
                      Created on: {e.created_at}
                    </Card.Text>
                    <Button variant="primary" href={e.html_url} target="_blank">
                      <BsGithub /> &nbsp; Github
                    </Button>

                    {e.homepage ? (
                      <Button
                        variant="primary"
                        href={e.homepage}
                        target="_blank"
                        style={{ marginLeft: "10px" }}
                      >
                        <CgWebsite /> &nbsp; demo
                      </Button>
                    ) : (
                      ""
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
