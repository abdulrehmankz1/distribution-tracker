# Distribution Tracker

Distribution Tracker is a logistics and distribution management application built with Payload CMS and Next.js. It helps manage trips, vehicles, employees, dealers, products, and related entities to streamline distribution operations.

## Repository

You can find the source code for this project at:  
[https://github.com/abdulrehmankz1/distribution-tracker.git](https://github.com/abdulrehmankz1/distribution-tracker.git)

## Features

- Manage trips with status tracking (Pending, In Progress, Complete)
- Assign drivers, helpers, and vehicles to trips
- Track delivery locations and delivered items with quantities
- Manage vehicles with types and fuel information
- Manage employees, dealers, products, expenses, and inventory
- Media management for uploads and assets
- User authentication and admin panel access

## Quick Start

This project can be deployed directly from Payload Cloud hosting, which sets up MongoDB and cloud S3 object storage for media.

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/abdulrehmankz1/distribution-tracker.git
   cd distribution-tracker
   ```

2. Copy the example environment variables and update:
   ```bash
   cp .env.example .env
   ```
   Add your `MONGODB_URI` from your cloud project to the `.env` file.

3. Install dependencies and start the development server:
   ```bash
   pnpm install
   pnpm dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. Follow the on-screen instructions to log in and create your first admin user.

### Docker (Optional)

If you prefer to use Docker for local development instead of a local MongoDB instance:

- Modify the `MONGODB_URI` in your `.env` file to:
  ```
  mongodb://127.0.0.1/<dbname>
  ```
- Update the `docker-compose.yml` file's `MONGODB_URI` to match the above `<dbname>`.
- Run the following command to start the database:
  ```bash
  docker-compose up
  ```
  Add `-d` to run in the background.

## How It Works

The app is built using Payload CMS with pre-configured collections tailored for distribution tracking:

- **Trips**: Manage trip details including trip ID, date, status, assigned driver/helper, vehicle, origin, destination, delivered items, and notes.
- **Vehicles**: Manage vehicle details such as vehicle number, type (Bike, Suzuki, Mazda, Truck, Loader Rickshaw, Other), and fuel type (Petrol, Diesel, CNG, Electric).
- **Employees**: Manage employees with roles such as drivers and helpers.
- **Dealers**: Manage dealer information for delivery destinations.
- **Products**: Manage products to be delivered.
- **Expenses, Inventory, Media, Users**: Additional collections to support app functionality.

## Questions

If you have any issues or questions, reach out on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).
