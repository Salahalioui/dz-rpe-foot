import React, { useState } from 'react';
import type { Player, Language, Position } from '../types';
import { translations } from '../i18n/translations';
import { Users, Plus, Edit2, Trash2, KeyRound, Search, X } from 'lucide-react';

interface PlayersViewProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
  lang: Language;
}

export const PlayersView: React.FC<PlayersViewProps> = ({
  players,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
  lang
}) => {
  const t = translations[lang];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<string>('ALL');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState<number>(10);
  const [position, setPosition] = useState<Position>('MF');
  const [pin, setPin] = useState('1010');
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingPlayer(null);
    setFirstName('');
    setLastName('');
    setJerseyNumber(players.length + 1);
    setPosition('MF');
    setPin(`10${players.length + 1}`);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (player: Player) => {
    setEditingPlayer(player);
    setFirstName(player.firstName);
    setLastName(player.lastName);
    setJerseyNumber(player.jerseyNumber);
    setPosition(player.position);
    setPin(player.pin);
    setIsActive(player.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayer) {
      onUpdatePlayer({
        ...editingPlayer,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        jerseyNumber,
        position,
        pin,
        isActive
      });
    } else {
      onAddPlayer({
        id: `p_${Date.now()}`,
        teamId: 'team_dz_u17_01',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        jerseyNumber,
        position,
        pin,
        isActive
      });
    }
    setIsModalOpen(false);
  };

  const filteredPlayers = players.filter(p => {
    const matchesSearch = `${p.firstName} ${p.lastName} ${p.jerseyNumber}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPos = selectedPos === 'ALL' || p.position === selectedPos;
    return matchesSearch && matchesPos;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-400" />
            <span>{t.players}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gestion de l'effectif des joueurs U17 et attribution des numéros et codes PIN
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-900/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addPlayer}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-semibold self-stretch sm:self-auto justify-center">
          {['ALL', 'GK', 'DF', 'MF', 'FW'].map(pos => (
            <button
              key={pos}
              onClick={() => setSelectedPos(pos)}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedPos === pos ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {pos === 'ALL' ? t.allPositions : pos}
            </button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPlayers.map(player => (
          <div
            key={player.id}
            className={`glass-card rounded-2xl p-4 border transition-all flex flex-col justify-between ${
              player.isActive
                ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700 shadow-lg'
                : 'border-rose-900/30 bg-rose-950/20 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-sm text-emerald-400 shadow-inner">
                  #{player.jerseyNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  {player.position}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-white">
                  {player.firstName} {player.lastName}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-emerald-500" />
                  <span>PIN : <strong className="text-slate-300">{player.pin}</strong></span>
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                player.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                {player.isActive ? t.active : t.inactive}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(player)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeletePlayer(player.id)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Player Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>{editingPlayer ? t.editPlayer : t.addPlayer}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.firstName}</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.lastName}</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.jerseyNumber}</label>
                  <input
                    type="number"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(parseInt(e.target.value))}
                    min="1"
                    max="99"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.position}</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as Position)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="GK">Gardien (GK)</option>
                    <option value="DF">Défenseur (DF)</option>
                    <option value="MF">Milieu (MF)</option>
                    <option value="FW">Attaquant (FW)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.pinCode}</label>
                  <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">{t.status}</label>
                  <select
                    value={isActive ? 'active' : 'inactive'}
                    onChange={(e) => setIsActive(e.target.value === 'active')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="active">{t.active}</option>
                    <option value="inactive">{t.inactive}</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all"
                >
                  {t.savePlayer}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
