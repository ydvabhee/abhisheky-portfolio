import React from 'react';
import metadata from '../../data/metadata.json';
import ScrambledText from '../ui/ScrambledText';

const About: React.FC = () => {
  return (
    <section id="about" className="py-32 px-8 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 border-t border-black/10 dark:border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 overflow-hidden group border border-black/5 dark:border-white/5">
          <img 
            src={metadata.about.profileImage}
            alt="Abhishek K Yadav" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-sm font-bold tracking-[0.2em] mb-8 opacity-50 uppercase">{metadata.about.title}</h2>
          
          <ScrambledText 
            className="text-4xl font-medium leading-tight tracking-tight mb-8"
            scrambleChars=".:"
          >
            {metadata.about.headline}
          </ScrambledText>

          <div className="space-y-6 text-lg opacity-70 dark:opacity-60 max-w-lg">
            {metadata.about.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-black/10 dark:border-white/10 pt-8">
            <div>
              <h4 className="text-xs font-black mb-4 uppercase tracking-widest opacity-40">{metadata.about.skillsTitle}</h4>
              <ul className="text-sm space-y-2 opacity-80">
                {metadata.about.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black mb-4 uppercase tracking-widest opacity-40">{metadata.about.certificationsTitle}</h4>
              <ul className="text-sm space-y-2 opacity-80">
                {metadata.about.certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;