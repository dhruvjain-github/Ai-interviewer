
   # AI Voice Assistant

AI Voice Assistant is a cutting-edge application designed to provide intelligent voice-based interactions. It leverages modern web technologies, cloud services, and AI models to deliver a seamless user experience.

## Features

- Real-time transcription and voice-to-text conversion.
- Text-to-speech synthesis using AWS Polly.
- Integration with AssemblyAI for transcription services.
- Dynamic feedback and note generation using AI models.
- User authentication and session management.

## Technologies Used

- **Frontend**: React, Next.js, TailwindCSS
- **Backend**: Convex, Node.js
- **Cloud Services**:
  - AWS Polly for text-to-speech.
  - AssemblyAI for transcription.
- **State Management**: Convex React
- **UI Components**: Stackframe UI
- **Other Libraries**:
  - RecordRTC for audio recording.
  - Sonner for notifications.
  - Lucide React for icons.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- AWS account for Polly
- AssemblyAI API key
- Convex account for backend services

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/ai-voice-assistant.git
   cd ai-voice-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment variables:
   Create a `.env.local` file in the root directory and add the following:

   ```env
   NEXT_PUBLIC_STACK_PROJECT_ID=YOUR_STACK_PROJECT_ID
   NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=YOUR_STACK_PUBLISHABLE_CLIENT_KEY
   STACK_SECRET_SERVER_KEY=YOUR_STACK_SECRET_SERVER_KEY

   # Deployment used by `npx convex dev`
   CONVEX_DEPLOYMENT=YOUR_CONVEX_DEPLOYMENT

   NEXT_PUBLIC_CONVEX_URL=YOUR_CONVEX_URL

   ASSEMBLY_API_KEY=YOUR_ASSEMBLY_API_KEY

   NEXT_PUBLIC_API_KEY=YOUR_API_KEY

   NEXT_PUBLIC_AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
   NEXT_PUBLIC_AWS_SECRET_KEY=YOUR_AWS_SECRET_ACCESS_KEY
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## Deployment

To deploy the application, use the following command:
```bash
npx convex deploy
```

Ensure that the `.env.local` file is properly configured with production credentials.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- [AWS Polly](https://aws.amazon.com/polly/)
- [AssemblyAI](https://www.assemblyai.com/)
- [Convex](https://convex.dev/)
- [Next.js](https://nextjs.org/)
