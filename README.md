<div align="center">

<a href="[Speakeasy](https://speakeasyapi.dev/)">
  <img src="https://github.com/speakeasy-api/speakeasy/assets/68016351/e959f81a-b250-4003-8c5c-a45b9463fc95" alt="Speakeasy Logo" width="400">
<h2>Speakeasy ElysiaJS OpenAPI Example</h2>
</a>

</div>

This example ElysiaJS app demonstrates the Speakeasy-recommended practices for creating clear OpenAPI documents and SDKs.

This project has five example CRUD API endpoints in `src/controllers/users.ts`, which can be used respectively to get all users, to get a user by id, to create a user, to delete a user, and to update a user.

## Prerequisites

You need to have [Bun](https://bun.sh/) installed on your system to run this project.

To generate an SDK, you need to have the Speakeasy CLI installed or be comfortable using the Speakeasy dashboard UI.

## Installation

Install the application on your local machine:

1. Clone the repository:

```bash
git clone https://github.com/speakeasy-api/speakeasy-elysiajs-example.git
```

2. Navigate into the directory:

```bash
cd speakeasy-elysiajs-example
```

3. Install all dependencies for the application using Bun:

```bash
bun install
```

4. [Install the Speakeasy CLI](https://github.com/speakeasy-api/speakeasy#installation):

```bash
brew install speakeasy-api/homebrew-tap/speakeasy
```

## Running the application

You can use the provided script to run the application in development mode. It will watch for any changes in the source code and automatically restart the server.

```bash
bun run dev
```

## Generating an OpenAPI document

Run the following command to generate an OpenAPI document YAML file in your root folder:

```bash
bun run generate:openapi
```

## Generating an SDK with Speakeasy

Run the following command to generate a Speakeasy SDK:

```bash
speakeasy quickstart
```

## License

This project is licensed under the terms of the Apache 2.0 license.
