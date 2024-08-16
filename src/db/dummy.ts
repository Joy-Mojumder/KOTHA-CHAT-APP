export interface Message {
  id: number;
  senderId: string;
  content: string;
  messageType: "text" | "image";
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

export const USERS = [
  {
    id: "20",
    image: "/avatars/user2.png",
    name: "John Doe",
    email: "johndoe@gmail.com",
  },
  {
    id: "30",
    image: "/avatars/user3.png",
    name: "Elizabeth Smith",
    email: "elizabeth@gmail.com",
  },
  {
    id: "40",
    image: "/avatars/user4.png",
    name: "John Smith",
    email: "johnsmith@gmail.com",
  },
  {
    id: "50",
    image: "/avatars/user4.png",
    name: "Jane Doe",
    email: "janedoe@gmail.com",
  },
] as User[];

export const messages = [
  {
    id: 25,
    senderId: USERS[0].id,
    content: "Hello",
    messageType: "text",
  },
  {
    id: 90,
    senderId: USERS[1].id,
    content: "Hi",
    messageType: "text",
  },
  {
    id: 100,
    senderId: USERS[0].id,
    content: "How are you?",
    messageType: "text",
  },
  {
    id: 19,
    senderId: USERS[1].id,
    content: "I'm good",
    messageType: "text",
  },
  {
    id: 11,
    senderId: USERS[0].id,
    content: "What are you doing?",
    messageType: "text",
  },
  {
    id: 12,
    senderId: USERS[1].id,
    content: "Nothing much",
    messageType: "text",
  },
  {
    id: 13,
    senderId: USERS[0].id,
    content: "Cool",
    messageType: "text",
  },
  {
    id: 15,
    senderId: USERS[1].id,
    content: "Yeah",
    messageType: "text",
  },
  {
    id: 16,
    senderId: USERS[0].id,
    content: "Bye",
    messageType: "text",
  },
  {
    id: 17,
    senderId: USERS[1].id,
    content: "Bye",
    messageType: "text",
  },
] as Message[];
