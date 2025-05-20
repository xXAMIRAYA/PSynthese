import React from 'react';
import { useState } from 'react';
import { EnhancedMessage } from './types';
import ChatFeature from './ChatFeature';

const ChatDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Plateforme de Campagnes de Santé</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Campagnes actives</h2>
          <p className="text-gray-600 mb-4">
            Découvrez les campagnes de santé en cours et contribuez à leur succès.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Équipement pour l'hôpital local</h3>
              <p className="text-sm text-gray-500">12 500€ collectés sur 20 000€</p>
              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '62.5%' }}></div>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium">Recherche sur le diabète</h3>
              <p className="text-sm text-gray-500">8 300€ collectés sur 30 000€</p>
              <div className="h-2 bg-gray-200 rounded-full mt-2">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '27.7%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dernières mises à jour</h2>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="font-medium">Campagne "Équipement pour l'hôpital local"</p>
              <p className="text-sm text-gray-600">
                Nous avons reçu le premier lot d'équipements médicaux! Merci à tous les donateurs.
              </p>
              <p className="text-xs text-gray-500 mt-1">Il y a 2 jours</p>
            </div>
            <div>
              <p className="font-medium">Campagne "Recherche sur le diabète"</p>
              <p className="text-sm text-gray-600">
                L'équipe de recherche a publié ses premiers résultats préliminaires. En savoir plus sur notre site.
              </p>
              <p className="text-xs text-gray-500 mt-1">Il y a 1 semaine</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat feature will appear at the bottom right */}
      <ChatFeature />
    </div>
  );
};

export default ChatDemo;