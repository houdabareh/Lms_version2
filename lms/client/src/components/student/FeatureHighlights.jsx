import React from 'react';

const FeatureHighlights = () => {
  const features = [
    {
      icon: '⭐',
      title: 'AI-Powered Learning Paths',
      description: 'Personalized recommendations and adaptive content to accelerate your progress.',
    },
    {
      icon: '🏆',
      title: 'Industry-Recognized Certifications',
      description: 'Earn certificates that validate your skills and boost your career.',
    },
    {
      icon: '💡',
      title: 'Interactive Live Sessions',
      description: 'Engage with expert instructors and peers in real-time, dynamic workshops.',
    },
    {
      icon: '💼',
      title: 'Career-Ready Skills',
      description: 'Gain practical, in-demand skills directly applicable to today\'s job market.',
    },
  ];

  return (
    <section className="py-12 bg-white text-center" data-aos="fade-up">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Why Choose Us?</h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">Discover the unique advantages of our platform designed to transform your learning journey.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2 bg-gray-50" data-aos="zoom-in" data-aos-delay={index * 100}>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights; 