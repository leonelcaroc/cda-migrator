````markdown
# README.md

## Setup Guide

### Step 1: Clone the GitHub Repository

Clone the project repository to your local machine.

```bash

git clone https://github.com/leonelcaroc/cda-migrator.git

cd cda-migrator

```

### Step 2: Create a VM and Setup MySQL

1. Create a Virtual Machine (VM).

2. Install Docker.

3. Pull and run the MySQL 8 Docker image.

```bash

docker pull mysql:8

```

### Step 3: Import Database

Import the e-coopris `main.sql` file into the MySQL database.
[Download `main.sql`](https://drive.google.com/drive/folders/1kDgb3Qs7dmDVKw3p1VGW_XeIDeXDZLXU?usp=sharing)

### Step 4: Run the Application

Don't RUN it if you're still unsure, please ask first because it will trigger migration immediately.

Start the application using:

```bash

yarn dev

```

### Step 5: Monitor Logs

While the application is running:

Watch the logs displayed in the terminal.

Also monitor the following files located in the project root directory:

`migration_errors_log.txt`

`user_credentials_log.txt`
````
