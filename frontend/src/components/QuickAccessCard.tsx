import React from 'react';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, description, icon, link }) => {
  return (
    <a 
      href={link}
      className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </a>
  );
};

export default QuickAccessCard;