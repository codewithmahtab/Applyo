# Applyo 

Applyo is a modern, full-stack job application platform designed to help users discover, save, and apply to jobs seamlessly while providing companies with a streamlined way to post opportunities and manage applications.

## 🚀 Getting Started

Follow these steps to configure and run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/applyo.git
cd applyo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and configure your essential environment variables:

```env
# Database connection string
DATABASE_URL="your_database_url_here"

# JWT Secret for authentication
ACCESS_SECRET="your_jwt_secret"
REFRESH_SECRET="your_jwt_secret"

```

### 4. Setup Database

Initialize the database schema and generate the database client:

```bash
npx prisma db push
npx prisma generate
```

*(Optional)* Seed the database with initial demo data:
```bash
npm run seed
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📜 License

This project is licensed under the MIT License.
