import React from 'react';
import { useParking } from '../context/ParkingContext';

export type NavTab = 'dashboard' | 'park' | 'exit' | 'map' | 'summary' | 'viva' | 'terminal';

interface TopNavBarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenConflictModal: () => void;
  onOpenEditBookingModal: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenConflictModal,
  onOpenEditBookingModal,
}) => {
  const { globalSearchQuery, setGlobalSearchQuery, emergencyOverride, slots } = useParking();

  const occupiedCount = slots.filter((s) => s.isOccupied).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#c6c6cd] shadow-xs">
      <div className="w-full px-4 lg:px-6 py-2 flex items-center justify-between">
        {/* Left: Brand & Nav Links */}
        <div className="flex items-center gap-4 xl:gap-8">
          {/* Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded bg-[#0051d5] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[20px]">local_parking</span>
            </div>
            <span className="text-[20px] font-bold text-[#0b1c30] tracking-tight">ParkEase</span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#e5eeff] text-[#0051d5] font-semibold hidden sm:inline-block">
              v2.4 Core
            </span>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'dashboard'
                  ? 'text-[#0051d5] bg-[#eff4ff] border-b-2 border-[#0051d5]'
                  : 'text-[#45464d] hover:text-[#0051d5] hover:bg-[#f8f9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('park')}
              className={`px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'park'
                  ? 'text-[#0051d5] bg-[#eff4ff] border-b-2 border-[#0051d5]'
                  : 'text-[#45464d] hover:text-[#0051d5] hover:bg-[#f8f9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">directions_car</span>
              <span>Park Vehicle</span>
            </button>

            <button
              onClick={() => setActiveTab('exit')}
              className={`px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'exit'
                  ? 'text-[#0051d5] bg-[#eff4ff] border-b-2 border-[#0051d5]'
                  : 'text-[#45464d] hover:text-[#0051d5] hover:bg-[#f8f9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>Vehicle Exit & Billing</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'map'
                  ? 'text-[#0051d5] bg-[#eff4ff] border-b-2 border-[#0051d5]'
                  : 'text-[#45464d] hover:text-[#0051d5] hover:bg-[#f8f9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
              <span>Live Slot Map</span>
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'summary'
                  ? 'text-[#0051d5] bg-[#eff4ff] border-b-2 border-[#0051d5]'
                  : 'text-[#45464d] hover:text-[#0051d5] hover:bg-[#f8f9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              <span>Parking Summary</span>
            </button>

            {/* Academic Viva & Java Hub */}
            <button
              onClick={() => setActiveTab('viva')}
              className={`px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'viva'
                  ? 'text-[#0051d5] bg-[#eff4ff] border-b-2 border-[#0051d5]'
                  : 'text-[#45464d] hover:text-[#0051d5] hover:bg-[#f8f9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-[#009668]">school</span>
              <span>Java OOP & Viva Hub</span>
            </button>

            {/* Interactive JVM Console Runner */}
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-2 text-[13px] font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'terminal'
                  ? 'text-[#0051d5] bg-[#eff4ff] border-b-2 border-[#0051d5]'
                  : 'text-[#45464d] hover:text-[#0051d5] hover:bg-[#f8f9ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-[#131b2e]">terminal</span>
              <span>JVM Console Runner</span>
            </button>
          </nav>
        </div>

        {/* Right: Quick Search, Status, Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Bar */}
          <div className="relative hidden md:block w-48 xl:w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              placeholder="Lookup Ticket/Plate..."
              className="w-full h-8 pl-8 pr-2.5 bg-[#f8f9ff] border border-[#c6c6cd] rounded text-[12px] font-mono uppercase text-[#0b1c30] placeholder:normal-case placeholder:font-sans focus:outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
            />
          </div>

          {/* Edit Slot Booking Quick Button */}
          <button
            onClick={onOpenEditBookingModal}
            title="Edit / Reassign Vehicle Slot Booking"
            className="px-2.5 py-1.5 rounded-lg border border-[#316bf3]/40 bg-[#eff4ff] text-[#0051d5] hover:bg-[#dbe1ff] text-[12px] font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
            <span className="hidden sm:inline">Edit Booking</span>
          </button>

          {/* Specification Conflict Explainer Badge */}
          <button
            onClick={onOpenConflictModal}
            title="Click to view Stage 1 Specification Conflict Resolution (Option A vs B)"
            className="px-2.5 py-1.5 rounded-lg bg-[#fffbeb] border border-[#f59e0b]/50 text-[#b45309] hover:bg-[#fef3c7] text-[11px] font-mono font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#d97706]">balance</span>
            <span className="hidden xl:inline">Option A vs B</span>
          </button>

          {/* Trailing System Status Indicator */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded bg-[#eff4ff] border border-[#c6c6cd] text-[11px] font-mono text-[#0b1c30]">
            <span className="w-2 h-2 rounded-full bg-[#009668] animate-pulse"></span>
            <span>Status: Active (Array[20] • {occupiedCount}/20)</span>
          </div>

          {/* Emergency Override */}
          <button
            onClick={emergencyOverride}
            className="px-2.5 py-1.5 rounded bg-[#131b2e] text-white text-[12px] font-semibold hover:bg-[#213145] transition-all flex items-center gap-1 border border-[#76777d] shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#6ffbbe]">warning</span>
            <span className="hidden sm:inline">Emergency Override</span>
          </button>

          {/* Profile Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#0051d5] text-white flex items-center justify-center font-bold text-[12px] ring-2 ring-[#e5eeff]">
            AD
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer Row */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-2 px-4 py-1.5 border-t border-[#e5eeff] bg-[#f8f9ff] text-[12px]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-[#0051d5] text-white font-bold' : 'text-[#45464d]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('park')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'park' ? 'bg-[#0051d5] text-white font-bold' : 'text-[#45464d]'
          }`}
        >
          Park Vehicle
        </button>
        <button
          onClick={() => setActiveTab('exit')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'exit' ? 'bg-[#0051d5] text-white font-bold' : 'text-[#45464d]'
          }`}
        >
          Exit & Billing
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'map' ? 'bg-[#0051d5] text-white font-bold' : 'text-[#45464d]'
          }`}
        >
          Slot Map
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'summary' ? 'bg-[#0051d5] text-white font-bold' : 'text-[#45464d]'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('viva')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'viva' ? 'bg-[#0051d5] text-white font-bold' : 'text-[#45464d]'
          }`}
        >
          Viva & Java Hub
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${
            activeTab === 'terminal' ? 'bg-[#0051d5] text-white font-bold' : 'text-[#45464d]'
          }`}
        >
          Console
        </button>
      </div>
    </header>
  );
};
