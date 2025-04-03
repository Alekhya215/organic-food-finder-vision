
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  linkedIn: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "Sarah has 15+ years of experience in sustainable agriculture and food systems. She founded OrganicTrace to bring transparency to the organic food supply chain.",
    linkedIn: "https://linkedin.com/in/sarahjohnson",
    image: "https://images.unsplash.com/photo-1571123607351-6f77a489f19f?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "CTO",
    bio: "Michael leads our technology team with expertise in AI, machine learning, and food traceability systems. Previously worked at leading AgTech companies.",
    linkedIn: "https://linkedin.com/in/michaelchen",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Head of Food Science",
    bio: "Elena holds a PhD in Food Science and specializes in organic certification standards and quality assessment protocols.",
    linkedIn: "https://linkedin.com/in/elenarodriguez",
    image: "https://images.unsplash.com/photo-1673259437293-156cd0d4ce8b?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    name: "David Williams",
    role: "Lead Developer",
    bio: "David is an expert in computer vision and barcode scanning technologies, with a passion for creating intuitive user experiences.",
    linkedIn: "https://linkedin.com/in/davidwilliams",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Head of Partnerships",
    bio: "Aisha builds relationships with organic producers, certification bodies, and retailers to expand our database and improve traceability.",
    linkedIn: "https://linkedin.com/in/aishapatel",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
  }
];
