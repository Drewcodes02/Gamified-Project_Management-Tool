# Testing Documentation for My final year project 

## Overview

This document outlines the testing strategies and methodologies employed in the development of Drews-FinalYearProject, a web-based project management tool with gamification elements. The project's testing approach is designed to ensure reliability, performance, and user satisfaction through a combination of automated and manual testing techniques.

This testing strategies and methodologies employed in my development. A web based p[roject management tool with gamification elements. This is to ensure reliability, performance and user satisfaction through a combination of automated and manual testing 
## Unit Testing

### Backend

- **Tools Used**: Jest and Supertest for Node.js.
- **Scope**: Models, controllers, and utility functions.
- **Process**: Each backend function is tested in isolation to ensure it performs as expected. For example, user authentication functions are tested for both successful and failed authentication scenarios.

### Frontend

- **Tools Used**: Jest and Testing Libraries for frontend components.
- **Scope**: JavaScript utility functions.
- **Process**: Frontend unit tests verify that components render correctly with given props and that user interactions like clicking buttons produce the expected outcome.

## Integration Testing

- **Tools Used**: Jest with Supertest for API endpoints.
- **Scope**: End-to-end workflows involving multiple components and systems, such as task creation, updating, and deletion.
- **Process**: Tests simulate user actions from the frontend to the backend, ensuring that the entire stack works together as intended. For example, creating a task involves sending a request to the backend, updating the database, and reflecting the change on the frontend.


## Manual Testing

- **Scope**: User interface and user experience.
- **Process**: Manual exploratory testing is conducted to identify usability issues and ensure that the application is intuitive and user-friendly. Feedback from these sessions is used to improve the UI/UX.

## Challenges and Solutions

- **Challenge**: Ensuring consistency in testing across different environments.
- **Solution**: Docker containers are used to standardise the development, testing, and production environments.

- **Challenge**: Identifying and replicating complex user interactions.
- **Solution**: User sessions and interactions are logged in detail, allowing testers to replicate issues reported by users accurately.

## Conclusion

This testing strategy for my project ensured that my application is robust and user friendly. This was needed to make sure any new changes are always tested before deployment. this was minimise bugs and improve the overall quality of the application

