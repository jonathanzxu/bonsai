# 🚀 Bonsai

This is a Next.js project that was initiated with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The public repository link is hosted on Github and can be found at [https://github.com/jonathanzxu/bonsai](https://github.com/jonathanzxu/bonsai).

## 📚 Description

Bonsai is a web-based task manager application developed using Next.js.

## 🏁 Getting Started

### 📋 Prerequisites

- Node.js: Ensure Node.js is installed on your machine. [Download here](https://nodejs.org/en/download/).
- A MongoDB Atlas account: This project utilizes MongoDB Atlas for database management. An account can be created [here](https://www.mongodb.com/cloud/atlas/register).
- Google Account: Google OAuth is used for authentication in this project. This can be done [here](https://console.cloud.google.com/).
- Next.js: This project is developed with Next.js. It can be installed globally on your machine using the appropriate npm command listed in the Installation section.

### 🔧 Installation & Setup

1. **Clone the repository**

   The repository can be cloned to your local machine by executing the following command in your terminal:

   ```bash
   git clone https://github.com/jonathanzxu/bonsai.git
   ```

2. **Run setup script**
   
   The setup script can be run by executing in the root of the project:

   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

Alternatively, manually set up the project.

1. **Navigate to the project directory**

   After cloning the repository, navigate to the project directory by executing:

   ```bash
   cd bonsai
   ```

2. **Install the dependencies**

   The project dependencies can be installed by executing:

   ```bash
   npm install
   ```

3. **Setup the Environment Variables**

   The environment variables need to be set up next. Follow these steps:

    - Open the `.env` file in your text editor.
    - Append the following lines in the file:

      ```bash
      MONGO=<Your MongoDB connection string>
      NEXTAUTH_SECRET=<Your NextAuth secret>
      NEXTAUTH_URL=<Your NextAuth URL>
      GOOGLE_CLIENT_ID=<Your Google Client ID>
      GOOGLE_CLIENT_SECRET=<Your Google Client Secret>
      ```

    - Replace the placeholders with your actual values. Here's how you can obtain each of these:

        - **MongoDB connection string**: This is provided by MongoDB Atlas. After creating an account and a new cluster, the connection string can be found under the "Connect" option of your cluster. Ensure to replace `<password>` with your database user password and `<dbname>` with the name of your database.

        - **NextAuth secret**: This is a secret used to encrypt session data. A random string can be generated for this purpose. There are many ways to generate a random string, one of them is to use an online random string generator.

        - **NextAuth URL**: This is the base URL of your application. During development, it's usually `http://localhost:3000`.

        - **Google Client ID and Google Client Secret**: These are provided by Google Cloud Platform. After creating a new project and setting up the OAuth consent screen, credentials for the OAuth client ID can be created. The client ID and client secret will be provided after the OAuth client ID is created.

    - After obtaining these values, replace the placeholders in the `.env` file with the actual values and save the file.

4. **Start the development server**

   The development server can be started by executing:

   ```bash
   npm run dev
   ```

   The project should now be running at `http://localhost:3000`.


## 🛠 Technologies Used

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Shadcn/ui](https://ui.shadcn.com/)


## 📚 References

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Shadcn Documentation](https://ui.shadcn.com/docs)
- [Next.js 13 Authentication By GTCoding](https://www.youtube.com/watch?v=PEMfsqZ2-As)
- [Next-Auth Login By Programming with Umair](https://www.youtube.com/watch?v=1SjqRn_Ira4)
- [Next.js 14 Complete Course 2024 By Lama Dev](https://www.youtube.com/watch?v=vCOSTG10Y4o)