import React from 'react';
import { motion } from 'framer-motion';
import { Hand, Users, Heart, Star, BookOpen, Globe, MapPin, Languages } from 'lucide-react';
import { FaSignLanguage } from 'react-icons/fa';

// Multi-lingual headlines representing all of India
const headlines = [
  "भारतीय सांकेतिक भाषा सीखें", // Hindi
  "Learn Indian Sign Language", // English
  "ভারতীয় সাংকেতিক ভাষা শিখুন", // Bengali
  "भारतीय सांकेतिक भाषा शिका", // Marathi
  "ભારતીય સાંકેતિક ભાષા શીખો", // Gujarati
  "భారతీయ సంకేత భాష నేర్చుకోండి", // Telugu
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-primary to-secondary text-white py-20 px-4 rounded-xl overflow-hidden mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-7xl"
              initial={{ opacity: 0.1 }}
              animate={{
                y: [Math.random() * 20, Math.random() * -20, Math.random() * 20],
                x: [Math.random() * 20, Math.random() * -20, Math.random() * 20],
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <FaSignLanguage />
            </motion.div>
          ))}
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className="mb-6">
              <motion.div
                className="text-7xl mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
              >
                <Hand className="inline-block" />
              </motion.div>
            </div>
            
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              About SignSetu
            </motion.h1>
            
            <motion.p
              className="text-xl text-blue-100 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              Bridging communication gaps across India through accessible sign language learning
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Globe className="mr-3" /> Our Mission
              </h2>
              <p className="text-blue-50">
                SignSetu aims to make sign language learning accessible, interactive, and culturally
                relevant for all Indians. We believe in breaking communication barriers and fostering
                an inclusive society where everyone can express themselves freely.
              </p>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="mr-3" /> Our Vision
              </h2>
              <p className="text-blue-50">
                To create a platform where sign language is celebrated as an integral part of India's linguistic
                diversity. We envision a future where sign language is widely recognized, respected,
                and learned across the country.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="container mx-auto px-4 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          SignSetu in Numbers
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "2.78M", label: "Deaf Community", subtext: "बधिर समुदाय" },
            { number: "28+", label: "States & UTs", subtext: "राज्य व केंद्रशासित प्रदेश" },
            { number: "1500+", label: "Signs Available", subtext: "उपलब्ध संकेत" },
            { number: "22+", label: "Languages", subtext: "भाषाएं" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + (i * 0.1), duration: 0.7 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold text-primary mb-2"
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
              >
                {stat.number}
              </motion.div>
              <div className="font-semibold text-gray-800">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.subtext}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Multilingual Section */}
      <motion.section
        className="container mx-auto px-4 py-16 bg-gray-50 rounded-xl mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Supporting India's Linguistic Diversity
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {headlines.map((headline, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + (i * 0.1), duration: 0.7 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)" 
                }}
              >
                <p className="font-medium text-center">{headline}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team & Values Section */}
      <motion.section
        className="container mx-auto px-4 mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: <Users className="text-primary text-3xl mb-4" />, 
                title: "Inclusivity",
                description: "We design for everyone, ensuring our platform is accessible to people of all abilities."
              },
              { 
                icon: <BookOpen className="text-primary text-3xl mb-4" />, 
                title: "Education",
                description: "We believe in the transformative power of learning and making education accessible to all."
              },
              { 
                icon: <Languages className="text-primary text-3xl mb-4" />, 
                title: "Cultural Relevance",
                description: "Our content respects and reflects India's rich cultural and linguistic diversity."
              },
              { 
                icon: <MapPin className="text-primary text-3xl mb-4" />, 
                title: "Local Context",
                description: "We include regional variations of signs to ensure relevance across India."
              },
              { 
                icon: <Heart className="text-primary text-3xl mb-4" />, 
                title: "Community",
                description: "We work closely with the deaf community to ensure authenticity and respect."
              },
              { 
                icon: <Star className="text-primary text-3xl mb-4" />, 
                title: "Innovation",
                description: "We constantly improve our platform with new technology and teaching methods."
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                className="bg-white p-6 rounded-lg shadow-md text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + (i * 0.1), duration: 0.7 }}
                whileHover={{ y: -7, transition: { duration: 0.2 } }}
              >
                <div className="flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4 rounded-xl mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.7 }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
          >
            Ready to Start Your Sign Language Journey?
          </motion.h2>
          
          <motion.p
            className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
          >
            Join thousands of learners across India discovering the beauty of visual communication.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
          >
            <motion.a
              href="/"
              className="px-8 py-3 bg-white text-primary rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Learning
            </motion.a>
            
            <motion.a
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
