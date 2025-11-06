import { useState } from 'react';  // Corretta importazione di React
import { Button } from './components/ui/button';  // Percorso relativo corretto
import { Card } from './components/ui/card';  // Percorso relativo corretto
import { Building2, Users, X } from 'lucide-react';  // Nessun cambiamento qui
import { OwnerForm } from './components/landing/OwnerForm';  // Percorso relativo corretto
import { TenantForm } from './components/landing/TenantForm';  // Percorso relativo corretto
import meetmeLogo from './assets/logo.png';  // Percorso relativo corretto



type SegmentType = "owner" | "tenant" | null;

const Landing = () => {
  const [selectedSegment, setSelectedSegment] = useState<SegmentType>(null);

  if (selectedSegment === null) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Logo Header */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <img 
            src={meetmeLogo} 
            alt="Meet me" 
            className="h-16 w-auto"
          />
        </div>

        {/* Split Screen */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Owner Section - Left/Top - Green */}
          <button
            onClick={() => setSelectedSegment("owner")}
            className="flex-1 bg-owner hover:bg-owner/90 transition-all duration-300 flex items-center justify-center p-8 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-owner-hover/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center text-owner-foreground z-10">
              <Building2 className="w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Proprietari</h2>
              <p className="text-xl md:text-2xl opacity-90">Gestisci i tuoi affitti in modo intelligente</p>
            </div>
          </button>

          {/* Tenant Section - Right/Bottom - Orange */}
          <button
            onClick={() => setSelectedSegment("tenant")}
            className="flex-1 bg-tenant hover:bg-tenant/90 transition-all duration-300 flex items-center justify-center p-8 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-tenant-hover/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-center text-tenant-foreground z-10">
              <Users className="w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Coinquilini</h2>
              <p className="text-xl md:text-2xl opacity-90">Trova il tuo coinquilino perfetto</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Expanded View
  const isOwner = selectedSegment === "owner";
  const bgColor = isOwner ? "bg-owner" : "bg-tenant";
  const textColor = isOwner ? "text-owner-foreground" : "text-tenant-foreground";

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Close Button */}
      <button
        onClick={() => setSelectedSegment(null)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Logo */}
      <div className="flex items-center justify-center pt-8 pb-6">
        <img 
          src={meetmeLogo} 
          alt="Meet me" 
          className="h-16 w-auto"
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Mission Section */}
        <div className="text-center mb-12 animate-in fade-in duration-500">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {isOwner ? "La tua gestione affitti, semplificata" : "Convivenza perfetta, finalmente possibile"}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            {isOwner 
              ? "Automatizza pagamenti, manutenzioni e ricerca inquilini. Traccia tutto in un'unica piattaforma e risparmia ore ogni settimana."
              : "Matching intelligente basato su compatibilità reale: hobby, stile di vita, università. Gestisci spese e danni senza stress."}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {isOwner ? (
            <>
              <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="font-semibold text-lg mb-2">Automatizza tutto</h3>
                <p className="text-sm opacity-80">Promemoria pagamenti, gestione manutenzioni, selezione inquilini</p>
              </Card>
              <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold text-lg mb-2">Traccia ogni dettaglio</h3>
                <p className="text-sm opacity-80">Storico danni, costi, interventi. Tutto in un archivio digitale</p>
              </Card>
              <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20">
                <div className="text-4xl mb-3">🔧</div>
                <h3 className="font-semibold text-lg mb-2">Servizi centralizzati</h3>
                <p className="text-sm opacity-80">Rete di fornitori verificati: idraulico, elettricista, pulizie</p>
              </Card>
            </>
          ) : (
            <>
              <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-semibold text-lg mb-2">Match perfetto</h3>
                <p className="text-sm opacity-80">Compatibilità basata su hobby, università, lingue e stile di vita</p>
              </Card>
              <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20">
                <div className="text-4xl mb-3">💰</div>
                <h3 className="font-semibold text-lg mb-2">Gestione spese</h3>
                <p className="text-sm opacity-80">Dividi affitto e bollette automaticamente, traccia tutto</p>
              </Card>
              <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-semibold text-lg mb-2">Tutela cauzione</h3>
                <p className="text-sm opacity-80">Documenta danni con foto e responsabilità chiare</p>
              </Card>
            </>
          )}
        </div>

        {/* Incentive Banner */}
        <div className="bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-8 mb-12 text-center animate-in slide-in-from-bottom-4 duration-700">
          <div className="text-5xl mb-4">🎁</div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Compila il questionario e ottieni 3 mesi GRATIS
          </h3>
          <p className="text-lg opacity-90">
            Registrati come early adopter e accedi alla piattaforma senza costi per i primi 3 mesi. Sii tra i primi a trovare {isOwner ? "inquilini perfetti" : "il coinquilino ideale"}!
          </p>
        </div>

        {/* Questionnaire */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Partecipa alla validazione
          </h2>
          {isOwner ? <OwnerForm /> : <TenantForm />}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 backdrop-blur mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-80">
            <div>© 2024 Meet me - Validazione prodotto</div>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#contatti" className="hover:opacity-100 transition-opacity">Contatti</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
