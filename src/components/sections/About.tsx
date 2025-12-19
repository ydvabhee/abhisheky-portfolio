import React from 'react';
import profileImage from '../../assets/profile.jpg';

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 px-8 bg-[#F5F5F5]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="aspect-[3/4] bg-zinc-300 overflow-hidden">
          <img 
            src={profileImage}
            alt="Abhishek K Yadav" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-sm font-bold tracking-[0.2em] mb-8">ABOUT THE ENGINEER</h2>
          <p className="text-4xl font-medium leading-tight tracking-tight mb-8">
            I AM A SOFTWARE ENGINEER WITH A PASSION FOR NURTURING GROWTH IN CODE AND LIFE.
          </p>
          <div className="space-y-6 text-lg opacity-70 max-w-lg">
            <p>
              Hi, I’m Abhishek. My journey began in a hometown garden, where I learned the value of nurturing growth both in life and in my career. Just as in gardening, I approach my work with curiosity, always learning, adapting, and striving to make things grow.
            </p>
            <p>
              I thrive on finding the right solutions to make everything click, and I take pride in building strong relationships with the people I work with. For me, growth is just as much about helping others succeed as it is about achieving my own goals.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-black mb-4 uppercase">Skills</h4>
              <ul className="text-sm space-y-1">
                <li>Full-Stack Development</li>
                <li>AI/ML & LLMs</li>
                <li>Cloud Infrastructure</li>
                <li>Automation Tools</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black mb-4 uppercase">Certifications</h4>
              <ul className="text-sm space-y-1">
                <li>AWS Fundamentals</li>
                <li>Front-End Web Dev (React)</li>
                <li>Bootstrap 4 (Honors)</li>
                <li>Python Computing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;