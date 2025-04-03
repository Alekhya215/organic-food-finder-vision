
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type TeamMember } from '@/data/teamData';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square w-full overflow-hidden">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold">{member.name}</h3>
        <p className="text-organic text-sm font-medium mb-2">{member.role}</p>
        <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
        <Button 
          variant="outline" 
          className="w-full border-organic text-organic hover:bg-organic hover:text-white"
          onClick={() => window.open(member.linkedIn, '_blank')}
        >
          Connect on LinkedIn
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
