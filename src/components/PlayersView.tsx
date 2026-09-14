import React, { useState } from 'react';
import type { Player, Language, Position } from '../types';
import { translations } from '../i18n/translations';
import { 
  Users, Plus, Edit2, Trash2, KeyRound, Search, X, Sparkles, UserPlus 
} from 'lucide-react';

interface PlayersViewProps {
  players: Player[];
  onAddPlayer: (player: Player) => void;
  onUpdatePlayer: (player: Player) => void;
  onDeletePlayer: (playerId: string) => void;
  onResetDemo?: () => void;
  onClearAll?: () => void;
  lang: Language;
}

export const PlayersView: React.FC<PlayersViewProps> = ({
  players,
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
  onResetDemo,
  onClearAll,
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
    setJerseyNumber(players.length > 0 ? Math.max(...players.map(p => p.jerseyNumber)) + 1 : 1);
    setPosition('MF');
    setPin('1010');
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

  const getPositionBadge = (pos: Position) => {
    switch (pos) {
      case 'GK':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'DF':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'MF':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'FW':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Squad Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-emerald-400" />
            <span>{t.players}</span>
            <span className="text-xs font-mono font-medium text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.08]">
              {players.length} Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Gestion de l'effectif des joueurs U17, attribution des numéros et codes PIN pour la borne tactile
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {players.length > 0 && onClearAll && (
            <button
              onClick={onClearAll}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vider l'effectif</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addPlayer}</span>
          </button>
        </div>
      </div>

      {/* When Squad is Empty */}
      {players.length === 0 ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/[0.08] text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Votre effectif est actuellement vide (0 joueur)</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Vous pouvez ajouter vos vrais joueurs un par un avec leur numéro de maillot et code PIN, ou charger l'équipe d'exemple U17 pour tester.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={openAddModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>Ajouter votre 1er joueur</span>
            </button>

            {onResetDemo && (
              <button
                onClick={onResetDemo}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Charger l'équipe démo U17</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Filter Bar */}
          <div className="glass-card rounded-2xl p-3 sm:p-4 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search}
                className="w-full bg-black/40 border border-white/[0.08] rounded-xl pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/[0.08] text-xs font-semibold self-stretch sm:self-auto justify-center">
              {['ALL', 'GK', 'DF', 'MF', 'FW'].map(pos => (
                <button
                  key={pos}
                  onClick={() => setSelectedPos(pos)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedPos === pos 
                      ? 'bg-white/[0.12] text-white shadow-sm font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {pos === 'ALL' ? t.allPositions : pos}
                </button>
              ))}
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filteredPlayers.map(player => (
              <div
                key={player.id}
                className={`glass-card glass-card-hover rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                  player.isActive
                    ? 'border-white/[0.08] bg-white/[0.02]'
                    : 'border-rose-900/30 bg-rose-950/20 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono font-bold text-sm text-emerald-400 shadow-inner">
                      #{player.jerseyNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getPositionBadge(player.position)}`}>
                      {player.position}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white">
                      {player.firstName} {player.lastName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <KeyRound className="w-3 h-3 text-emerald-400" />
                      <span>PIN : <strong className="text-slate-300">{player.pin}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    player.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {player.isActive ? t.active : t.inactive}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(player)}
                      title={t.editPlayer}
                      className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer ${player.firstName} ${player.lastName} ?`)) {
                          onDeletePlayer(player.id);
                        }
                      }}
                      title={t.delete}
                      className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Player Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0f1011] border border-white/[0.1] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-auto">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>{editingPlayer ? t.editPlayer : t.addPlayer}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">{t.firstName}</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="ex. Youcef"
                    className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">{t.lastName}</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="ex. Belaïli"
                    className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">{t.jerseyNumber}</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    required
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(parseInt(e.target.value) || 1)}
                    className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">{t.position}</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as Position)}
                    className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="GK">GK</option>
                    <option value="DF">DF</option>
                    <option value="MF">MF</option>
                    <option value="FW">FW</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold flex items-center justify-between">
                  <span>Code PIN (Borne Tactile)</span>
                  <span className="text-[10px] text-slate-500 font-normal">4 chiffres pour signature</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="ex. 1010"
                  className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2 text-white font-mono text-center tracking-widest text-base focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                />
                <label htmlFor="isActive" className="text-slate-300 font-semibold cursor-pointer">
                  Joueur Actif dans l'effectif
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-semibold text-xs"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50"
                >
                  {t.save}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
