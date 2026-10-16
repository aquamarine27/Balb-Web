export interface User {
  id: number;
  username: string;
  avatarUrl: string | null;
}

export interface Quiz {
  id: number;
  title: string;
  imageUrl: string | null;
  duration: number; // минуты или секунды пока хз
}
