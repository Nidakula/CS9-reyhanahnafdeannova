import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Rocket, Code, Database } from "lucide-react";
import useInView from "../Hooks/useInView";

const infoSections = [
  {
    icon: <Rocket className="w-6 h-6 text-purple-300 mr-2" />,
    title: "A focus on apps",
    content: [
      "Heroku is the quickest way for a company to become an apps company. Heroku is a service that enables companies to spend their time developing and deploying apps that immediately start producing value.",
      "An app starts impacting the world when customers start interacting with it. Getting apps out in the wild, out onto the Internet quickly, and iterating fast is what can make or break companies.",
      "Heroku focuses relentlessly on apps and the developer experience around apps. Heroku lets companies of all sizes embrace the value of apps, not the distraction of hardware, nor the distraction of servers - virtual or otherwise."
    ]
  },
  {
    icon: <Code className="w-6 h-6 text-purple-300 mr-2" />,
    title: "Why enabling developers matters",
    content: [
      "Heroku is an amazing developer experience. It gets out of the way where it matters, letting devs get on with what they do best - developing apps.",
      "Great apps come from developers using tools and languages they love. That’s why a great developer experience has always been at the heart of what we do.",
      "Heroku makes deploying, configuring, scaling, and managing apps as simple as possible, so developers can focus on what’s most important: building great apps.",
      "Deploying and maintaining apps should be frictionless, and these capabilities should be part of a company’s DNA."
    ]
  },
  {
    icon: <Database className="w-6 h-6 text-purple-300 mr-2" />,
    title: "Heroku and Data",
    content: [
      "Heroku isn’t just an app hosting platform - it also delivers a full-fledged Database-as-a-Service, complete with features like follower replicas, forking, Dataclips, and built-in health checks.",
      "Because data underpins every meaningful application, Heroku treats apps and their data as an inseparable pair.",
      "Its managed data portfolio spans Heroku Postgres, a Key-Value Store, and Apache Kafka on Heroku, so you can pick the service that fits your workload."
    ]
  }
];

export default function FocusSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section ref={ref} className="bg-gradient-to-br from-[#5222d0] to-[#3c0d99] text-white py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-10">Why Heroku?</h2>
        <div className="space-y-6">
          {infoSections.map((sec, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white/10 rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between px-6 py-4 font-semibold text-lg text-left"
                >
                  <div className="flex items-center">
                    {sec.icon}
                    {sec.title}
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-white/90"
                    >
                      {sec.content.map((p, i) => (
                        <p key={i} className="mb-3 leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
