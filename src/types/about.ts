export interface Education {
  degree: string;
  university: string;
  location: string;
  period: string;
  focus: string;
}

export interface WorkExperience {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
  technologies: string[];
}

export interface ProjectHighlight {
  title: string;
  tagline: string;
  badge?: string;
  description: string;
  highlights: string[];
  techStack: string[];
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface Language {
  name: string;
  level: string;
  badge: string;
}

export interface Methodology {
  title: string;
  text: string;
}

export interface CustomCvData {
  education?: Education;
  workExperience?: WorkExperience[];
  featuredProjects?: ProjectHighlight[];
  skillCategories?: SkillCategory[];
  languages?: Language[];
  softSkills?: string[];
  methodologies?: Methodology[];
  location?: string;
  website?: string;
  cv_url?: string;
}

export interface AboutContent {
  id?: number;
  profile_image?: string;
  headline?: string;
  sub_headline?: string;
  who_i_am_1?: string;
  who_i_am_2?: string;
  github_url?: string;
  linkedin_url?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  cv_url?: string;
  cta_text_2?: string;
  skills?: string;
  expertise_text?: string;
  cta_text_1?: string;
  updated_at?: string;
}
