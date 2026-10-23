import React, { useState } from 'react';
import {
  ScrollText,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Shield,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { TradingRule } from '../types';
import { DEFAULT_RULES } from '../utils/storage';

interface TradingRulesPageProps {
  rules: TradingRule[];
  onUpdateRules: (rules: TradingRule[]) => void;
}

export const TradingRulesPage: React.FC<TradingRulesPageProps> = ({
  rules,
  onUpdateRules,
}) => {
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<'Structure' | 'Execution' | 'Risk' | 'Psychology'>('Execution');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleToggleRule = (id: string) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r));
    onUpdateRules(updated);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleText.trim()) return;

    const newRule: TradingRule = {
      id: `custom_rule_${Date.now()}`,
      text: newRuleText.trim(),
      category: newRuleCategory,
      isCore: false,
      isActive: true,
    };

    onUpdateRules([...rules, newRule]);
    setNewRuleText('');
  };

  const handleDeleteRule = (id: string) => {
    onUpdateRules(rules.filter((r) => r.id !== id));
  };

  const handleStartEdit = (rule: TradingRule) => {
    setEditingRuleId(rule.id);
    setEditingText(rule.text);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    const updated = rules.map((r) => (r.id === id ? { ...r, text: editingText.trim() } : r));
    onUpdateRules(updated);
    setEditingRuleId(null);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset trading rules to the original 9 cardinal rules?')) {
      onUpdateRules(DEFAULT_RULES);
    }
  };

  const activeCount = rules.filter((r) => r.isActive).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono mb-1">
            <ScrollText className="w-4 h-4" />
            <span>DISCRETIONARY OPERATING PRINCIPLES</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Trading Rules & Non-Negotiables
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Strict behavioral guidelines protecting capital against FOMO, premature entries, and undisciplined risk expansion.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white bg-[#171c26] hover:bg-[#202735] border border-[#262f3f] rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="bg-[#121620] border border-[#212838] rounded-lg p-4 flex items-start gap-3 text-xs text-gray-300">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white font-semibold">Important Methodology Note:</strong> This ruleset
          is designed to anchor your discretionary thinking, enforce patience, and eliminate emotional impulsive trading.
          Adhering to these rules supports rigorous analysis and discipline, but no trading system or rule checklist guarantees specific financial outcomes.
        </p>
      </div>

      {/* Active Rules List */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">
            Active Principles ({activeCount} of {rules.length} Active)
          </h3>
          <span className="text-xs text-gray-400 font-mono">
            Check off rules to toggle them for your audits
          </span>
        </div>

        <div className="space-y-2.5">
          {rules.map((rule, index) => {
            const isEditing = editingRuleId === rule.id;

            return (
              <div
                key={rule.id}
                className={`p-3.5 rounded-md border transition-colors flex items-start gap-3 ${
                  rule.isActive
                    ? 'bg-[#131722] border-[#222a3a]'
                    : 'bg-[#0e1117] border-[#181d27] opacity-60'
                }`}
              >
                {/* Checkbox toggle */}
                <input
                  type="checkbox"
                  checked={rule.isActive}
                  onChange={() => handleToggleRule(rule.id)}
                  className="w-4 h-4 mt-0.5 text-emerald-600 bg-gray-900 border-gray-700 rounded-sm focus:ring-emerald-500 cursor-pointer shrink-0"
                />

                {/* Number & content */}
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-emerald-400 font-bold text-[11px]">
                      Rule #{index + 1}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-mono px-1.5 py-0.2 bg-[#1b2230] rounded-xs">
                      {rule.category}
                    </span>
                    {rule.isCore && (
                      <span className="text-[10px] text-sky-400 font-mono">Core Standard</span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-1 bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-1.5 text-white text-xs focus:border-emerald-500 focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleSaveEdit(rule.id)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md"
                        title="Save"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-200 text-sm leading-relaxed font-medium">
                      {rule.text}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(rule)}
                      className="p-1 text-gray-400 hover:text-white hover:bg-[#1a202d] rounded-md transition-colors"
                      title="Edit rule text"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!rule.isCore && (
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-md transition-colors"
                      title="Delete custom rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Rule Form */}
      <div className="bg-[#10141c] border border-[#1e2533] rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white mb-2">Add Custom Trading Rule</h3>
        <p className="text-xs text-gray-400 mb-4">
          Tailor your rulebook to personal lessons from your journal (e.g. max daily loss threshold, specific pair restrictions).
        </p>

        <form onSubmit={handleAddRule} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <input
                type="text"
                placeholder="Enter personal rule statement..."
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white text-xs focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <div>
              <select
                value={newRuleCategory}
                onChange={(e) => setNewRuleCategory(e.target.value as any)}
                className="w-full bg-[#181d27] border border-[#2c3444] rounded-md px-3 py-2 text-white text-xs focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Execution">Execution</option>
                <option value="Structure">Structure</option>
                <option value="Risk">Risk</option>
                <option value="Psychology">Psychology</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!newRuleText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Rule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
