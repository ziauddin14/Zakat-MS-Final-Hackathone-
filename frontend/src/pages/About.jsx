import React, { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Heart,
  Shield,
  Users,
  Globe,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const Counter = ({ from = 0, to, duration = 2, prefix = "", suffix = "" }) => {
  const nodeRef = useRef();
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const node = nodeRef.current;
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          node.textContent = `${prefix}${Math.round(value)}${suffix}`;
        },
      });
      return () => controls.stop();
    }
  }, [from, to, inView, prefix, suffix, duration]);

  return (
    <span ref={nodeRef} className="tabular-nums">
      {prefix}
      {from}
      {suffix}
    </span>
  );
};

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 pt-24 pb-12"
    >
      {/* Hero Section */}
      <div className="container mx-auto px-6 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6"
          >
            OUR MISSION
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Revolutionizing Zakat Management with{" "}
            <span className="text-primary">Transparency</span> &{" "}
            <span className="text-primary">Trust</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-10 leading-relaxed"
          >
            ZakatFlow is a next-generation platform dedicated to making the
            obligation of Zakat simple, transparent, and impactful. We bridge
            the gap between donors and deserving beneficiaries through
            technology.
          </motion.p>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "100% Transparent",
              desc: "Every penny is tracked. We provide real-time updates on how your donations are being utilized to change lives.",
            },
            {
              icon: Heart,
              title: "Sharia Compliant",
              desc: "Our processes and Zakat distribution channels are strictly monitored by certified scholars to ensure adherence to Islamic principles.",
            },
            {
              icon: Globe,
              title: "Global Reach",
              desc: "From local communities to international crises, we connect your Zakat to the most urgent needs around the world.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                <item.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story/Content Section */}
      <div className="bg-white py-20 mb-20 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="Helping hands"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <div className="lg:w-1/2">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-gray-900 mb-6"
              >
                Why We Started
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-gray-600 mb-6 text-lg"
              >
                We noticed a gap in the traditional Zakat systems—lack of
                feedback and difficulty in reaching verified beneficiaries.
                ZakatFlow was born to solve this.
              </motion.p>
              <motion.ul
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-4 mb-8"
              >
                {[
                  "Verified Beneficiaries Only",
                  "Automated Zakat Calculation",
                  "Direct-to-Recipient Transfer",
                  "Zero Admin Fees Option",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-gray-700 font-medium"
                  >
                    <CheckCircle className="text-green-500" size={20} />
                    {item}
                  </li>
                ))}
              </motion.ul>
              <Link to="/signup">
                <button className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all flex items-center gap-2">
                  Join Our Cause <ArrowRight size={20} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 mb-20">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { value: 50, suffix: "K+", label: "Donors" },
              { value: 12, prefix: "$", suffix: "M", label: "Distributed" },
              { value: 100, suffix: "+", label: "Projects" },
              { value: 25, label: "Countries" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <Counter
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-primary-100/80 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
