import React from 'react'

const TestimonialCard = ({ quote, name, title, avatar }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center transform transition duration-300 hover:border-accent border-2 border-transparent">
      <img src={avatar || '/assets/default_avatar.jpg'} alt={name || 'Testimonial Avatar'} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-primary" />
      <p className="text-gray-700 italic mb-4 text-lg">“<span className="relative top-1 left-0 text-3xl font-serif leading-none text-primary">❝</span> {quote || 'No quote provided.'}”</p>
      <h4 className="font-bold text-lg text-dark">{name || 'Anonymous User'}</h4>
      <p className="text-gray-500 text-sm">{title || 'Student'}</p>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      quote: "This LMS transformed my learning journey. The courses are insightful and the instructors are top-notch!",
      name: "Alice Johnson",
      title: "Student at University X",
      avatar: "/assets/profile_img.png"
    },
    {
      id: 2,
      quote: "I've never experienced such engaging and effective online education. Highly recommend to anyone looking to upskill.",
      name: "Bob Williams",
      title: "Software Engineer",
      avatar: "/assets/profile_img_3.png"
    },
    {
      id: 3,
      quote: "The flexibility and quality of courses allowed me to balance my studies with my full-time job seamlessly.",
      name: "Carol Davis",
      title: "Marketing Specialist",
      avatar: "/assets/profile_img3.png"
    },
  ];

  return (
    <section className="bg-gray-100" data-aos="fade-up">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Students Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection