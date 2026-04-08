import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Package as PackageIcon, 
  Settings, 
  MessageSquare, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle,
  LogOut,
  Bell,
  Search,
  Globe,
  Phone
} from 'lucide-react';
import { useApp, Package } from '../../context/AppContext';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { packages, settings, updatePackages, updateSettings, saveChanges } = useApp();
  const [activeTab, setActiveTab] = useState<'packages' | 'settings' | 'ai'>('packages');
  const [showToast, setShowToast] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const handleSave = () => {
    saveChanges();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const addPackage = () => {
    const newPkg: Package = {
      id: Date.now().toString(),
      title: 'New Destination',
      location: 'Location',
      price: '0',
      duration: '0N/0D',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800',
      description: 'New package description...'
    };
    updatePackages([...packages, newPkg]);
  };

  const deletePackage = (id: string) => {
    updatePackages(packages.filter(p => p.id !== id));
  };

  const updatePackageField = (id: string, field: keyof Package, value: string) => {
    updatePackages(packages.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Admin<span className="text-primary">Panel</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'packages', label: 'Package Manager', icon: PackageIcon },
            { id: 'settings', label: 'Global Settings', icon: Settings },
            { id: 'ai', label: 'AI Prompt Engineer', icon: MessageSquare },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2 capitalize">
              {activeTab === 'ai' ? 'AI Prompt Engineer' : activeTab.replace('-', ' ')}
            </h2>
            <p className="text-slate-500 font-medium">Manage your website content dynamically.</p>
          </div>
          <button 
            onClick={handleSave}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </header>

        <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/50 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          {activeTab === 'packages' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">Active Packages</h3>
                <button 
                  onClick={addPackage}
                  className="bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add Package
                </button>
              </div>

              <div className="grid gap-6">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="group bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-primary/20 transition-all">
                    <div className="grid md:grid-cols-4 gap-8">
                      <div className="relative h-40 rounded-2xl overflow-hidden">
                        <img src={pkg.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="bg-white p-2 rounded-lg text-slate-900 shadow-lg">
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input 
                            value={pkg.title} 
                            onChange={(e) => updatePackageField(pkg.id, 'title', e.target.value)}
                            className="bg-white border-none rounded-xl px-4 py-2 text-lg font-bold focus:ring-2 focus:ring-primary"
                          />
                          <input 
                            value={pkg.location} 
                            onChange={(e) => updatePackageField(pkg.id, 'location', e.target.value)}
                            className="bg-white border-none rounded-xl px-4 py-2 text-sm font-medium text-slate-500 focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <textarea 
                          value={pkg.description}
                          onChange={(e) => updatePackageField(pkg.id, 'description', e.target.value)}
                          className="w-full bg-white border-none rounded-xl px-4 py-2 text-sm text-slate-600 h-20 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <div className="space-y-2 w-full">
                          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2">
                            <span className="text-xs font-bold text-slate-400">₹</span>
                            <input 
                              value={pkg.price}
                              onChange={(e) => updatePackageField(pkg.id, 'price', e.target.value)}
                              className="w-full border-none p-0 font-bold text-primary focus:ring-0"
                            />
                          </div>
                          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2">
                            <Globe className="w-4 h-4 text-slate-400" />
                            <input 
                              value={pkg.duration}
                              onChange={(e) => updatePackageField(pkg.id, 'duration', e.target.value)}
                              className="w-full border-none p-0 text-sm font-bold focus:ring-0"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => deletePackage(pkg.id)}
                          className="text-red-400 hover:text-red-600 p-2 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Phone className="w-6 h-6 text-primary" />
                  Contact Settings
                </h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Number (with country code)</label>
                  <input 
                    value={settings.whatsappNumber}
                    onChange={(e) => updateSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <Bell className="w-6 h-6 text-primary" />
                  Alert Banner
                </h3>
                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 mb-1">Enable Site-wide Alert</p>
                    <p className="text-sm text-slate-500">Display a promotional banner at the top of the website.</p>
                  </div>
                  <button 
                    onClick={() => updateSettings({ ...settings, alertBanner: { ...settings.alertBanner, enabled: !settings.alertBanner.enabled } })}
                    className={`w-14 h-8 rounded-full transition-all relative ${settings.alertBanner.enabled ? 'bg-primary' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.alertBanner.enabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
                {settings.alertBanner.enabled && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Banner Text</label>
                    <input 
                      value={settings.alertBanner.text}
                      onChange={(e) => updateSettings({ ...settings, alertBanner: { ...settings.alertBanner, text: e.target.value } })}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary transition-all text-slate-900 font-medium"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4 p-8 bg-blue-50 rounded-[2rem] border border-blue-100">
                <div className="bg-primary p-3 rounded-2xl text-white">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">System Prompt Engineering</h3>
                  <p className="text-slate-600 font-medium">Tune how Gemini AI responds to customer travel queries.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">System Instructions</label>
                <textarea 
                  value={settings.systemPrompt}
                  onChange={(e) => updateSettings({ ...settings, systemPrompt: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-8 focus:ring-2 focus:ring-primary transition-all text-slate-900 font-medium h-96 leading-relaxed"
                  placeholder="Enter system instructions for the AI..."
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 right-12 bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-[100]"
          >
            <div className="bg-green-500 p-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="font-bold">Changes saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
