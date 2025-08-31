# Luna - Supportive AI Companion

Luna is a supportive web-based chatbot designed specifically for teenage girls, providing a safe, judgment-free space for discussing sensitive topics including mental health, relationships, menstrual health, and other traditionally taboo subjects that affect their daily lives.

## ✨ Features

- **Interactive Chat Interface** - Empathetic AI responses with topic-aware conversations
- **Topic Categories** - Mental health, relationships, periods, and general wellness discussions
- **Anonymous Conversations** - Private conversation history stored locally
- **Resource Library** - Curated resources and helpful tips based on conversation topics
- **Dark Mode Support** - Toggle between light and dark themes
- **Mobile-First Design** - Optimized for smartphones with warm, approachable interface

## 🎨 Design

Inspired by Headspace and Calm's approachable interfaces, Luna features:
- **Colors**: Warm pink (#E91E63), soft purple (#9C27B0), gentle orange (#FF9800)
- **Typography**: Nunito and Open Sans fonts for readability
- **UI Elements**: Rounded chat bubbles, soft shadows, pastel color palette
- **Responsive**: Mobile-first design with comfortable spacing

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd luna
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Add your OpenAI API key to your environment
   export OPENAI_API_KEY="your-openai-api-key"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5000`

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** components built on Radix UI
- **TanStack Query** for state management
- **Wouter** for lightweight routing

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL support
- **OpenAI API** for AI responses
- **In-memory storage** for development

## 📁 Project Structure

```
luna/
├── client/src/          # Frontend React application
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utilities and API clients
│   └── hooks/          # Custom React hooks
├── server/             # Backend Express server
│   ├── routes.ts       # API route handlers
│   └── storage.ts      # Data storage interface
├── shared/             # Shared types and schemas
└── README.md
```

## 🛡️ Privacy & Safety

- **Anonymous Usage** - No personal information required
- **Local Storage** - Conversation history stored on device
- **Safe Space** - Designed for sensitive topic discussions
- **Crisis Resources** - Emergency support resources included

## 🤝 Contributing

Luna is designed to be a safe, supportive space for teenage girls. When contributing:

1. Maintain the warm, empathetic tone
2. Follow accessibility best practices
3. Ensure mobile-first responsive design
4. Test all conversation flows
5. Keep user privacy as top priority

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you need immediate help or crisis support:
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention Lifeline**: Call 988
- **Emergency**: Call 911

---

*Luna is a safe space for discussing sensitive topics. Remember that while Luna provides support and resources, she is not a replacement for professional mental health care when needed.*