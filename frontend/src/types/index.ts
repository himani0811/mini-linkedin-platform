export interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  job_title?: string;
  location?: string;
  posts_count?: number;
}

export interface Post {
  id: number;
  content: string;
  created_at: string;
  author_id: number;
  author_name: string;
  author_avatar?: string;
  author_job_title?: string;
  likes_count?: number;
  liked_by_user?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, bio?: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  loading: boolean;
}
