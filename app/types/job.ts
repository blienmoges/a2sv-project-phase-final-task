
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string[];
  opType: string;
  categories: string[];
  logoUrl: string;
  orgName: string;
  datePosted: string;
  isBookmarked?: boolean;
  
  // Optional fields
  responsibilities?: string[];
  ideal_candidate?: {
    age: string;
    gender: string;
    traits: string[];
  };
  about?: {
    posted_on: string;
    deadline: string;
    location: string;
    start_date: string;
    end_date: string;
    categories: string[];
    required_skills: string[];
  };
  company?: string;
  image?: string;
  type?: string;
}