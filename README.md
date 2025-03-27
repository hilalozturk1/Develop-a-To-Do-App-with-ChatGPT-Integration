# Todo Application - Getting Started Guide

This project is a Todo application that allows users to manage their tasks effectively. It integrates OpenAI to provide task suggestions and supports image file attachments for visual context.

## Live Demo

Explore the live application here: [http://54.238.170.91/](http://54.238.170.91/)

## Features

-   **User Authentication:** Register and log in to manage your tasks.
-   **Task Management:** Add, update, and delete tasks.
-   **Task Completion:** Mark tasks as completed.
-   **Image Attachments:** Add image files to tasks for visual descriptions.
-   **OpenAI Integration:** Receive task recommendations powered by ChatGPT (gpt-3.5-turbo).
-   **Database:** MongoDB for data storage.

## Setup and Run

### Prerequisites

-   Node.js and npm (or yarn, bun)
-   MongoDB account and database
-   OpenAI API key

### Steps

1.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    ```

    -   Copy `.env.example` to `.env` and add your MongoDB URI, OpenAI API key, jwt secrect key, port.

2.  **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    npm run build
    ```

    -   This step builds the production-ready frontend in the `build` directory.

3.  **Docker Setup (Optional):**

    ```bash
    docker-compose up --build
    ```

    -   This command runs both the backend and frontend in Docker containers. Access the app at `http://localhost:3000`.

4.  **Manual Deployment (AWS Example):**

    -   Start the backend:

        ```bash
        cd backend
        npm run start
        ```

    -   Serve the frontend with Nginx using the following configuration:

        ```nginx
        user www-data;
        worker_processes auto;
        pid /run/nginx.pid;
        error_log /var/log/nginx/error.log;
        include /etc/nginx/modules-enabled/*.conf;

        events {
            worker_connections 768;
        }

        http {
            server {
                listen 80;
                server_name 54.238.170.91;

                location /api/ {
                    proxy_pass http://54.128.170.91:5000/;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
                }

                location /uploads/ {
                    root /home/ubuntu/backend/public/;
                }

                location / {
                    root /home/ubuntu/build;
                    index index.html;
                    try_files $uri $uri/ /index.html;
                }
            }

            sendfile on;
            tcp_nopush on;
            types_hash_max_size 2048;

            include /etc/nginx/mime.types;
            default_type application/octet-stream;

            ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
            ssl_prefer_server_ciphers on;

            access_log /var/log/nginx/access.log;

            gzip on;

            include /etc/nginx/conf.d/*.conf;
            include /etc/nginx/sites-enabled/*;
        }
        ```

    -   For running the backend as a systemd service, use this `application.service` file:

        ```ini
        [Unit]
        Description=Todo App Service
        After=network.target

        [Service]
        User=ubuntu
        WorkingDirectory=/home/ubuntu/backend
        ExecStart=npm run start
        Restart=always

        [Install]
        WantedBy=multi-user.target
        ```

        -   Enable and start the service:

            ```bash
            sudo systemctl enable application.service
            sudo systemctl start application.service
            ```

## Usage

1.  Access the app in your browser: [http://54.238.170.91/](http://54.238.170.91/)
2.  Register or log in.
3.  Add, update, or delete tasks.
4.  Mark tasks as completed.
5.  Attach image files to tasks.
6.  Use OpenAI suggestions when adding new tasks.
