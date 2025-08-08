'use client'

import { motion, stagger, useAnimate } from 'motion/react';
import { useEffect } from 'react';

type AnimateType = {
  text: string;
};

const AnimatedText = ({ text }: AnimateType) => {
  const [scope, animate] = useAnimate();

  const AnimateText = () => {
    animate(
      'span',
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0
      },
      {
        duration: 0.3,
        delay: stagger(0.01),
        ease: "easeInOut"
      }
    );
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      AnimateText();
    });
  }, []);

  return (
    <div
      ref={scope}
      className="lg:h-56 h-[288px] mx-auto lg:w-[1400px] w-[320px] lg:p-4 lg:text-[16px] text-[13px] text-justify mt-6 text-black overflow-hidden"
    >
      {text.split('').map((word, idx) => (
        <motion.span key={idx} initial={{ opacity: 0, y: 10 }}>
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedText;
