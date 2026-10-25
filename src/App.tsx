import React, { useState } from 'react';
import { ParkingProvider } from './context/ParkingContext';
import { TopNavBar, NavTab } from './components/TopNavBar';
import { DashboardView } from './components/DashboardView';
import { ParkVehicleView } from './components/ParkVehicleView';
import { VehicleExitView } from './components/VehicleExitView';
import { LiveSlotMapView } from './components/LiveSlotMapView';
import { ParkingSummaryView } from './components/ParkingSummaryView';
import { VivaCodeHubView } from './components/VivaCodeHubView';
import { ConsoleRunnerView } from './components/ConsoleRunnerView';
import { Footer } from './components/Footer';
import { ConflictModal } from './components/ConflictModal';
import { EditBookingModal } from './components/EditBookingModal';
import { ParkedVehicle } from './types/parking';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [conflictModalOpen, setConflictModalOpen] = useState<boolean>(false);
  const [editBookingModalOpen, setEditBookingModalOpen] = useState<boolean>(false);
  const [preSelectedVehicle, setPreSelectedVehicle] = useState<ParkedVehicle | null>(null);

  const handleOpenEditModalWithSlot = (slot: { vehicle: ParkedVehicle | null }) => {
    if (slot.vehicle) {
      setPreSelectedVehicle(slot.vehicle);
    }
    setEditBookingModalOpen(true);
  };

  return (
    <ParkingProvider>
      <div className="min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#dbe1ff] selection:text-[#00174b]">
        {/* Persistent Top Navigation Bar */}
        <TopNavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenConflictModal={() => setConflictModalOpen(true)}
          onOpenEditBookingModal={() => {
            setPreSelectedVehicle(null);
            setEditBookingModalOpen(true);
          }}
        />

        {/* Dynamic Operational Viewports */}
        <main className="flex-1 flex flex-col">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveTab}
              onOpenEditModal={() => {
                setPreSelectedVehicle(null);
                setEditBookingModalOpen(true);
              }}
            />
          )}

          {activeTab === 'park' && <ParkVehicleView />}

          {activeTab === 'exit' && <VehicleExitView />}

          {activeTab === 'map' && (
            <LiveSlotMapView
              onNavigate={setActiveTab}
              onOpenEditModalWithSlot={handleOpenEditModalWithSlot}
            />
          )}

          {activeTab === 'summary' && <ParkingSummaryView />}

          {activeTab === 'viva' && <VivaCodeHubView />}

          {activeTab === 'terminal' && <ConsoleRunnerView />}
        </main>

        {/* System Footer */}
        <Footer />

        {/* Global Modal Overlays */}
        <ConflictModal
          isOpen={conflictModalOpen}
          onClose={() => setConflictModalOpen(false)}
        />

        <EditBookingModal
          isOpen={editBookingModalOpen}
          onClose={() => {
            setEditBookingModalOpen(false);
            setPreSelectedVehicle(null);
          }}
          preSelectedVehicle={preSelectedVehicle}
        />
      </div>
    </ParkingProvider>
  );
}
