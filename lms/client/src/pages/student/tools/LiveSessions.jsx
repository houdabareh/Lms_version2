import React, { useEffect, useState } from 'react';
import { FaPlay, FaRobot } from 'react-icons/fa'; // Import FaPlay for replay button, FaRobot for AI summary

const LiveSessions = () => {
  useEffect(() => {
    console.log("LiveSessions component loaded");
  }, []);

  const [openSummary, setOpenSummary] = useState(null); // State for opening/closing AI summary

  const sessions = [
    {
      id: 1,
      title: 'React Hooks Deep Dive',
      platform: 'Google Meet',
      platformLogo: '/assets/google_meet_logo.png', // Placeholder, replace with actual path
      link: 'https://meet.google.com/abc-xyz',
      time: '2024-08-15T10:00:00', // Past session
      instructor: 'Jane Doe',
      replayUrl: 'https://www.youtube.com/embed/gbAdFfSdtQ4',
      aiSummary: 'Dans cette session, nous avons couvert en profondeur les React Hooks, y compris useState, useEffect, useContext et useRef. Nous avons exploré leurs utilisations pratiques pour la gestion d\'état et les effets secondaires dans les composants fonctionnels, en montrant des exemples de code pour chaque hook. La session s\'est terminée par une discussion sur les meilleures pratiques et les pièges à éviter lors de l\'utilisation des hooks en production.',
    },
    {
      id: 2,
      title: 'Advanced Tailwind CSS',
      platform: 'Zoom',
      platformLogo: '/assets/zoom_logo.png', // Placeholder, replace with actual path
      link: 'https://zoom.us/j/123456789',
      time: '2024-08-16T14:30:00', // Past session
      instructor: 'John Smith',
      replayUrl: 'https://www.youtube.com/embed/p_Vf0njb3aI',
      aiSummary: 'Cette session a exploré les fonctionnalités avancées de Tailwind CSS, telles que la personnalisation du thème, les plugins, les directives @apply et l\'optimisation de la production. Les participants ont appris à étendre Tailwind avec leurs propres classes utilitaires et à construire des interfaces utilisateur complexes de manière efficace. Des techniques de débogage et des astuces pour améliorer le flux de travail ont également été partagées.',
    },
    {
      id: 3,
      title: 'Node.js Backend Development',
      platform: 'Microsoft Teams',
      platformLogo: '/assets/teams_logo.png', // Placeholder, replace with actual path
      link: 'https://teams.microsoft.com/l/meetup/xyz',
      time: '2024-10-20T09:00:00', // Future session
      instructor: 'Emily White',
      replayUrl: null,
      aiSummary: null,
    },
    {
      id: 4,
      title: 'Data Structures with Python',
      platform: 'Google Meet',
      platformLogo: '/assets/google_meet_logo.png',
      link: 'https://meet.google.com/def-uvw',
      time: '2024-09-01T11:00:00', // Future session
      instructor: 'Alice Johnson',
      replayUrl: null,
      aiSummary: null,
    },
    {
      id: 5,
      title: 'Understanding Cloud Computing',
      platform: 'Zoom',
      platformLogo: '/assets/zoom_logo.png',
      link: 'https://zoom.us/j/987654321',
      time: '2024-07-25T13:00:00', // Past session
      instructor: 'Bob Williams',
      replayUrl: 'https://www.youtube.com/embed/M9F5X-a_dI0',
      aiSummary: 'Dans cette session, nous avons démystifié les concepts fondamentaux du cloud computing, y compris IaaS, PaaS et SaaS. Nous avons discuté des avantages de la migration vers le cloud, des différents fournisseurs de services cloud (AWS, Azure, GCP) et des considérations de sécurité. Les exemples concrets ont illustré comment le cloud peut transformer les infrastructures informatiques des entreprises.',
    },
  ];

  const calculateTimeLeft = (sessionTime) => {
    const difference = +new Date(sessionTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Adjust based on desired format
  };

  const isSessionPassed = (sessionTime) => {
    return +new Date(sessionTime) < +new Date();
  };

  const toggleSummary = (id) => {
    setOpenSummary(openSummary === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-dark mb-10">Live Sessions</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session) => (
            <div key={session.id} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:border-primary transition duration-300 relative">
              {isSessionPassed(session.time) && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Disponible en Replay</span>
              )}
              <div className="flex items-center mb-4">
                <img src={session.platformLogo} alt={session.platform} className="w-10 h-10 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">{session.title}</h2>
              </div>
              <p className="text-gray-600 mb-2">Instructor: <span className="font-medium">{session.instructor}</span></p>
              <p className="text-gray-600 mb-4">Platform: {session.platform}</p>
              
              <div className="text-sm text-gray-700 mb-4">
                <p className="font-semibold">Time: {formatTime(session.time)}</p>
                {Object.keys(calculateTimeLeft(session.time)).length > 0 ? (
                  <p className="text-green-600 font-bold mt-2">Starts in: {calculateTimeLeft(session.time).days}d {calculateTimeLeft(session.time).hours}h {calculateTimeLeft(session.time).minutes}m {calculateTimeLeft(session.time).seconds}s</p>
                ) : (
                  <p className="text-red-600 font-bold mt-2">Session has started or passed.</p>
                )}
              </div>

              <div className="flex flex-col space-y-3">
                {!isSessionPassed(session.time) ? (
                  <a href={session.link} target="_blank" rel="noopener noreferrer" className="bg-primary text-white py-2 px-4 rounded-md text-center font-semibold hover:bg-accent transition duration-300">
                    Join Session
                  </a>
                ) : (
                  session.replayUrl && (
                    <a
                      href={session.replayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white py-2 px-4 rounded-md text-center font-semibold hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                    >
                      <FaPlay className="mr-2" /> Replay Video
                    </a>
                  )
                )}
                
                <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center font-semibold hover:bg-gray-300 transition duration-300">
                  Add to Calendar (Mock)
                </button>

                {isSessionPassed(session.time) && session.aiSummary && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <button
                      onClick={() => toggleSummary(session.id)}
                      className="flex items-center justify-between w-full text-left font-semibold text-gray-800 focus:outline-none py-2 px-3 rounded-md bg-gray-100 hover:bg-gray-200 transition duration-300"
                    >
                      <span className="flex items-center"><FaRobot className="mr-2" /> Résumé généré par l'IA</span>
                      <span>{openSummary === session.id ? '▲' : '▼'}</span>
                    </button>
                    {openSummary === session.id && (
                      <div className="bg-gray-50 p-3 rounded-b-lg mt-2 text-gray-700 text-sm animate-fadeIn">
                        {session.aiSummary}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveSessions; 