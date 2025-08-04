export interface UserType {
  id: number;
  avatar_url: string | null;
  created_at: string;
  email: string;
  full_name: string;
  gender: string;
  is_verified: boolean;
  profile_complete: boolean;
  phone: string | null;
  role: string;
}
