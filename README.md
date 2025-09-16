# Ticketing System Dashboard

A comprehensive **ticketing system dashboard** built with React, providing role-based access for employees, managers, and owners. The system allows assignment, tracking, and management of tickets, along with real-time chat, notifications, multi-language support, and payment integration.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Folder Structure](#folder-structure)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- **Role-Based Access**: Different views for employees, managers, and owners.  
- **Ticket Management**:  
  - Tickets can have **Open**, **Pending**, or **Completed** statuses.  
  - Tickets are assigned by managers or owners to employees.  
- **Authentication**:  
  - Login, logout, password reset, and forgot password via email.  
- **Real-Time Chat**: Users can chat with each other using **Socket.IO**.  
- **Notifications**: Push notifications for ticket updates and messages.  
- **Multi-Language Support**: Switch between multiple languages using **i18next**.  
- **Multi-Theme Support**: Light and dark modes.  
- **Plans & Payments**: Integration with **Braintree** and **PayPal** for subscription or one-time payments.  
- **User Profiles**: Each user has a personal profile page.  
- **Dashboard Insights**: Analytics and insights for tickets and users using **Recharts**.

---

## Tech Stack

- **Frontend**: React, React Router, React Hook Form, Zod, Tailwind CSS, Lucide React  
- **State Management**: Zustand  
- **API & Data**: Axios, TanStack React Query  
- **Real-Time**: Socket.IO  
- **Payment Integration**: Braintree Web Drop-in, PayPal  
- **Localization**: i18next  

---

## Folder Structure

The project uses a **feature-based structure**:

```
src/
├── features/
│   ├── auth/            # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   ├── chats/
│   ├── dashboard/
│   ├── notifications/
│   ├── plans/
│   ├── profile/
│   ├── tickets/
│   └── users/
├── shared/               # Shared components, utils, hooks
├── App.tsx
├── main.tsx
└── index.css
```

Each feature is **self-contained** with its components, hooks, pages, services, store, types, and schemas.

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/BOD-amrshoukry/dashboard.git
cd dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite specifies).

---

## Usage

- **Login / Signup**: Access the dashboard using registered credentials.  
- **Ticket Management**: Employees view assigned tickets, managers/owners can assign tickets.  
- **Chat**: Communicate with other users in real-time.  
- **Notifications**: Stay updated on ticket changes and messages.  
- **Payments**: Subscribe or pay for plans via Braintree/PayPal.  
- **Theme & Language**: Switch between light/dark themes and supported languages.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/my-feature`)  
3. Make your changes  
4. Commit changes (`git commit -m "Add my feature"`)  
5. Push to the branch (`git push origin feature/my-feature`)  
6. Open a Pull Request  

Please follow the existing code structure and styling conventions.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

