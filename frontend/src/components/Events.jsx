import React from 'react';
import { Calendar, Video, Users } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: "Annual National Summit",
      description: "Our flagship event bringing together Muslim medical professionals from across the nation for networking, CME, and spiritual growth.",
      image: "https://images.unsplash.com/photo-1563461661026-49631dd5d68e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      icon: <Calendar className="w-7 h-7" />,
      color: "var(--amma-emerald)",
      tags: ["Keynote speakers", "CME credits", "Networking sessions", "Faith & science workshops"],
      reversed: false
    },
    {
      title: "Clinical Exchange Webinars",
      description: "Monthly online sessions featuring expert presentations, case discussions, and professional development opportunities.",
      image: "https://plus.unsplash.com/premium_photo-1682126126631-0b748439a92b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <Video className="w-7 h-7" />,
      color: "var(--amma-burgundy)",
      tags: ["Monthly schedule", "Expert presenters", "Interactive Q&A", "Recorded access"],
      reversed: true
    },
    {
      title: "Local Chapter Mixers",
      description: "Regular gatherings in your area to build community, share experiences, and collaborate on local initiatives.",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      icon: <Users className="w-7 h-7" />,
      color: "var(--amma-gold)",
      tags: ["Quarterly meetings", "Community building", "Local service projects", "Social connections"],
      reversed: false
    }
  ];

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6 font-bold text-[var(--amma-emerald)]">
            Events & Programs
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700">
            Engage with the community through our diverse range of educational and networking events.
          </p>
        </div>

        <div className="space-y-20">
          {events.map((event, index) => (
            <div
              key={index}
              className={`grid lg:grid-cols-2 gap-12 items-center ${event.reversed ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={event.reversed ? 'lg:order-2' : ''}>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className={event.reversed ? 'lg:order-1' : ''}>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-white"
                  style={{ backgroundColor: event.color }}
                >
                  {event.icon}
                </div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: event.color }}>
                  {event.title}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {event.description}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {event.tags.map((tag, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: event.color }}></div>
                      <span className="text-sm text-gray-600 font-medium">{tag}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="px-6 py-3 rounded-lg border-2 font-bold transition-all hover:shadow-lg"
                  style={{ borderColor: event.color, color: event.color }}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;
