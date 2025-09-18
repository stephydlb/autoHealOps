export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">À propos de AutoHealOps</h2>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Présentation du projet</h3>
          <p className="text-gray-600 mb-6">
            AutoHealOps est une plateforme avancée de surveillance et d'automatisation système conçue pour fournir des
            informations en temps réel sur les performances du système, la gestion des processus et l'exécution automatisée
            de scripts. Construite avec des technologies web modernes et une architecture conteneurisée, elle offre un tableau
            de bord complet pour les administrateurs système et les ingénieurs DevOps.
          </p>

          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Fonctionnalités</h3>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Surveillance en temps réel du CPU et de la mémoire avec détection d'anomalies</li>
            <li>Gestion des processus avec possibilité de les terminer</li>
            <li>Système de création et d'exécution de scripts</li>
            <li>Métriques et journaux stockés en base de données</li>
            <li>Déploiement conteneurisé avec Docker</li>
            <li>Frontend React moderne avec backend FastAPI</li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Technologies utilisées</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800">Frontend</h4>
              <p className="text-blue-600">Next.js, React, TypeScript</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800">Backend</h4>
              <p className="text-green-600">FastAPI, Python</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800">Base de données</h4>
              <p className="text-purple-600">PostgreSQL</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-800">Surveillance</h4>
              <p className="text-orange-600">psutil, SQLAlchemy</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800">IA/ML</h4>
              <p className="text-red-600">Détection d'anomalies</p>
            </div>
            <div className="bg-teal-100 p-4 rounded-lg">
              <h4 className="font-semibold text-teal-800">Déploiement</h4>
              <p className="text-teal-600">Docker, Docker Compose</p>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Développeur</h3>
          <div className="flex items-center space-x-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-800">Créateur du projet</h4>
              <p className="text-gray-600 mb-2">Construit avec passion pour le DevOps et l'automatisation système</p>
              <a
                href="https://github.com/stephydlb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Voir le profil GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
