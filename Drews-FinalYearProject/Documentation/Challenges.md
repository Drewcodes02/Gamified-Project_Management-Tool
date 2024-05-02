# Development Challenges and Solutions

Throughout the development of my final year project I came across a few challenges that really tested my skills that I have learnt over the past 4 years. This document outlines some of the challenges I faced and how I overcame them.

## Challenge 1: Real-Time Communication
Implementing real-time chat functionality was crucial for the project to enable seamless collaboration among users. bBut, establishing a stable and efficient IbSocket connection was a challenge.

### Solution:
I decided to use the `ws` library, a simple to use IbSocket library for Node.js. To ensure stability, I implemented robust error handling and reconnection logic. This included catching connection errors, automatically attempting to reconnect on connection loss, and ensuring that messages are queued and not lost during brief disconnections.

## Challenge 2: Task Progress Tracking
Another challenge was tracking and visualising the progress of tasks in a way that was both informative and user-friendly. I needed a solution that could dynamically update and display progress without requiring page reloads.

### Solution:
I integrated Chart.js for creating dynamic and interactive charts. For the backend, I developed an API endpoint that aggregates task progress data and sends it to the frontend. On the frontend, I used AJAX to fetch this data and update the charts in real-time, providing users with immediate visual feedback on their project's progress.

## Challenge 3: Scalable Task Assignment
As projects grew in size, efficiently assigning tasks to users and managing these assignments became complex. I needed a scalable solution that could handle a growing number of tasks and users.

### Solution:
I optimised my database schema by implementing a more relational structure using MongoDB's referencing capabilities. This allowed me to efficiently query tasks by assignment and project. Additionally, I implemented pagination and filtering on the frontend to manage the display of tasks, making it easier for users to navigate and manage large sets of tasks.

## Challenge 4: Secure Authentication
Ensuring that user data and project information remained secure was paramount. I needed a secure yet straightforward authentication system that could protect sensitive information.

### Solution:
I implemented JSON Web Tokens (JWT) for authentication. This method allowe me to securely transmit information between the server and clients as a JSON object. I ensured that tokens I stored securely and implemented middleware to protect routes that required user authentication.

## Challenge 5: User Engagement Through Gamification
Integrating gamification to enhance user engagement was a novel approach for me. The challenge was to design a points and rewards system that was motivating and fair.

### Solution:
I designed a comprehensive gamification system that awards points for task completion and collaboration. I created a leaderboard to foster a sense of competition and a rewards page where users can redeem points for benefits. The system was designed to be flexible, allowing for easy adjustments based on user feedback.

## Conclusion
Overcoming these challenges were difficult but worth it as I learnt a great deal and required a combination of my skills i've learnt, creativity and persistence. Each solution not only fixed the problem but also helped the overall robustness and user experience. Through these challenges I learnt a great amount with Ib development, real time communication, data visualisation, database management, security and gamification which i have all learnt a great deal of the past 4 years and glad i got to put these into my development project.
