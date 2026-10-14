# Pastel Calculator

A simple calculator built with HTML, CSS, and vanilla JavaScript. It has a pastel-colored interface and supports basic arithmetic along with memory and grand-total controls.

## CCA 2 CI/CD deployment

This existing calculator is prepared for the CCA 2 CI/CD assignment. Jenkins checks out the GitHub source, verifies the JavaScript syntax, builds and pushes a Docker image to Docker Hub, and deploys it to Minikube on the Jenkins EC2 host.

The Jenkins pipeline has four stages: checkout, build and syntax check, Docker build and push, and Kubernetes deployment. The syntax check uses `node --check script.js` because this project does not include a separate automated test suite.

Before running Jenkins, replace the placeholder Docker Hub repository in `Jenkinsfile` and add a Jenkins username/password credential with ID `dockerhub-creds`. The Docker Hub access token belongs in Jenkins credentials, never in this repository.

After completing the live deployment, add the actual EC2/Jenkins setup details, application access instructions, screenshots, and the source change used for the second pipeline run. Report only stages that were successfully completed.

## Features

- Addition, subtraction, multiplication, and division
- Decimal numbers and positive/negative sign toggle
- Clear Entry (CE), All Clear (AC), and backspace
- Memory add (M+), memory subtract (M-), and memory recall/clear (MRC)
- Grand Total (GT) display and recall
- Error display for division by zero
- Responsive button interaction with hover and press effects

## Project files

- `index.html` — calculator layout and button definitions
- `style.css` — calculator styling and page background
- `script.js` — calculator operations and button behavior
- `notebook.jpg` — background image used by the page
- `Dockerfile` — packages the static website with Nginx
- `Jenkinsfile` — CI/CD pipeline definition
- `k8s/` — Kubernetes Deployment and Service manifests
- `.dockerignore` — files excluded from the Docker build context

## Run locally

No installation or build step is required.

1. Download or clone the project folder.
2. Open `index.html` in a modern web browser.
3. Use the on-screen buttons to perform calculations.

## Controls

| Button | Action |
| --- | --- |
| `+`, `-`, `×`, `÷` | Select an arithmetic operation |
| `=` | Calculate the result |
| `CE` | Clear the current entry |
| `AC` | Reset the current calculation |
| `→` | Delete the last digit |
| `+/-` | Change the sign of the current number |
| `M+`, `M-` | Add the current value to memory or subtract it |
| `MRC` | Recall memory; press again to clear memory |
| `GT` | Recall the accumulated grand total |

## Notes

- The grand total accumulates each calculated result during the current page session.
- `AC` resets the current calculation. It does not clear memory or the grand total.
- The calculator currently accepts input through its on-screen buttons; keyboard controls are not implemented.
