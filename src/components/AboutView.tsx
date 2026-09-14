import React from 'react';
import type { Language } from '../types';
import { 
  GraduationCap, Mail, MapPin, Award, BookOpen, 
  Activity, ShieldCheck, Cpu, HeartPulse, ExternalLink, Code2
} from 'lucide-react';

interface AboutViewProps {
  lang: Language;
}

export const AboutView: React.FC<AboutViewProps> = () => {
  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto">
      
      {/* Hero Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>Sciences du Sport & Technologie Appliquée</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          DZ-RPE Foot <span className="text-emerald-400">U17</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Application Progressive Web (PWA) de monitoring de la charge d'entraînement (sRPE), du ratio ACWR et du bien-être (Indice Hooper) pour les clubs de football en Algérie.
        </p>
      </div>

      {/* Developer / Author Credit Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl relative overflow-hidden">
        
        {/* Background Algerian Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Avatar / Profile Icon */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 p-1 shadow-xl shadow-emerald-950/40 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center font-black text-3xl sm:text-4xl text-emerald-400 border border-emerald-500/30">
              SA
            </div>
          </div>

          {/* Author Details */}
          <div className="space-y-3 text-center md:text-left rtl:md:text-right flex-1">
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start rtl:md:justify-end gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  Dr. Salah ALIOUI
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  PhD Sciences du Sport
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-400">
                Enseignant EPS • Chercheur en Sciences du Sport • Développeur Vibe Coding & Data Sports
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Docteur en Sciences et Techniques des Activités Physiques et Sportives (STAPS), spécialisé dans l'analyse de la performance sportive, la modélisation de la charge d'entraînement (RPE/ACWR) et l'intégration d'outils technologiques à faible coût pour le sport de jeunes en Algérie.
            </p>

            {/* Badges & Meta */}
            <div className="flex flex-wrap items-center justify-center md:justify-start rtl:md:justify-end gap-2.5 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>El Bayadh / Tissemsilt, Algérie</span>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Université de Tissemsilt</span>
              </span>
            </div>

            {/* Links & Contact Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start rtl:md:justify-end gap-3 pt-3">
              <a
                href="https://github.com/Salahalioui"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all shadow-md"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>GitHub : @Salahalioui</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href="mailto:salaheddine.allioui@univ-tissemsilt.dz"
                className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Académique</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* Scientific Framework & Documentation Sections */}
      <div className="space-y-6">
        
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Fondements Scientifiques & Méthodologie</span>
          </h2>
          <p className="text-xs text-slate-400">
            Principes validés par la littérature internationale en médecine du sport et préparation physique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Foster sRPE */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400">
              <Activity className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm sm:text-base">1. Méthode Session-RPE (Carl Foster, 2001)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              La charge de séance ($sRPE$) est le produit de la perception subjective de l'effort (Échelle Borg CR-10 modifiée) par la durée effective de l'entraînement en minutes :
            </p>
            <div className="p-3 rounded-xl bg-slate-800/90 text-center font-mono text-emerald-400 font-bold text-xs">
              Charge (UA) = Note RPE (0-10) × Durée (minutes)
            </div>
            <p className="text-[11px] text-slate-400">
              <strong>Protocole :</strong> La note doit être recueillie <strong>15 à 30 minutes après la fin de la séance</strong> pour éviter le biais de récence (fin de séance douce vs séance intense).
            </p>
          </div>

          {/* Card 2: Tim Gabbett ACWR */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm sm:text-base">2. Ratio ACWR (Tim Gabbett, 2016)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Le ratio Charge Aiguë / Charge Chronique (ACWR) compare la fatigue récente (7 jours) à la préparation historique (28 jours) :
            </p>
            <div className="p-3 rounded-xl bg-slate-800/90 text-center font-mono text-emerald-400 font-bold text-xs">
              ACWR = Charge Aiguë (7 jours) ÷ Charge Chronique (Moyenne 28j)
            </div>
            <ul className="text-[11px] text-slate-400 space-y-1">
              <li>• <span className="text-emerald-400 font-bold">0.80 - 1.30 (Sweet Spot) :</span> Zone idéale de progression et protection.</li>
              <li>• <span className="text-amber-400 font-bold">1.30 - 1.49 (Avertissement) :</span> Vigilance accrue.</li>
              <li>• <span className="text-rose-400 font-bold">≥ 1.50 (Zone Rouge / Danger) :</span> Risque de blessure multiplié par 2 à 4.</li>
            </ul>
          </div>

          {/* Card 3: Monotony & Strain */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400">
              <Cpu className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm sm:text-base">3. Monotonie & Contrainte (Strain)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              La monotonie mesure l'absence de variabilité dans la charge hebdomadaire. Une valeur élevée (&gt; 2.0) sans jours de récupération expose au surentraînement.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/90 text-center font-mono text-emerald-400 font-bold text-xs">
              Monotonie = Moyenne 7j ÷ Écart-type 7j | Strain = Charge Semaine × Monotonie
            </div>
          </div>

          {/* Card 4: Hooper Index */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-400">
              <HeartPulse className="w-5 h-5" />
              <h3 className="font-bold text-white text-sm sm:text-base">4. Indice de Bien-Être Hooper (1995)</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Questionnaire rapide pré-séance composé de 4 items notés de 1 (Optimal) à 5 (Très mauvais) : Sommeil, Courbatures (DOMS), Fatigue, Stress.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/90 text-center font-mono text-emerald-400 font-bold text-xs">
              Score Total = Sommeil + Courbatures + Fatigue + Stress (4 à 20)
            </div>
          </div>

        </div>

      </div>

      {/* Algerian U17 Coaching Guidelines */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 bg-slate-900/90 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <span>Recommandations Pratiques pour le Football U17 en Algérie</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-1.5">
            <p className="font-bold text-emerald-400">🏟️ Terrains Synthétiques (5G/Tartan)</p>
            <p className="text-slate-400 leading-relaxed">
              Les terrains synthétiques fréquents en Algérie augmentent l'impact articulaire et la fatigue des adducteurs. Surveiller les pics de Strain après les matchs.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-1.5">
            <p className="font-bold text-emerald-400">☀️ Climat & Chaleur Régionale</p>
            <p className="text-slate-400 leading-relaxed">
              Dans les régions intérieures et du Sud (Hauts-Plateaux / Sahara), la charge perçue augmente avec la déshydratation. Ajuster la durée plutôt que l'intensité.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-1.5">
            <p className="font-bold text-emerald-400">🌙 Microcycles Ramadan & Examens</p>
            <p className="text-slate-400 leading-relaxed">
              Lors des périodes de jeûne ou d'examens scolaires (BEM/Bac), l'indice Hooper permet d'individualiser les charges avant chaque séance.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
