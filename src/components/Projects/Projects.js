import React, { useEffect, useState } from "react";
import { Container, Row, Col, Ratio } from "react-bootstrap";
// import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Dots } from "react-preloaders";

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
  console.log(gitpro);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Project</strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {gitpro.map((e) => {
            return !e ? (
              <Dots />
            ) : (
              <Col md={5} className="project-card" key={e.id}>
                <Card
                  className="project-card-view"
                  style={{ border: "1px solid rgb(94 202 255 / 62%)" }}
                >
                  <Card.Body>
                    {e.homepage ? (
                      <Ratio aspectRatio="16x9" style={{ marginBottom: 10 }}>
                        <embed
                          type="image/svg+xml"
                          src={!e.homepage ? <Dots /> : `https://${e.homepage}`}
                        />
                      </Ratio>
                    ) : (
                      ""
                    )}
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
                        exact
                        variant="primary"
                        href={`https://${e.homepage}`}
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
