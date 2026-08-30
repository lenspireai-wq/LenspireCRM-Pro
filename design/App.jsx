import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Calendar, UserCheck, FileText, BookmarkCheck, 
  BarChart3, CheckSquare, Bell, Settings, Shield, Database, Search, 
  Plus, Filter, MoreVertical, Phone, MessageSquare, Send, CheckCircle, 
  Clock, XCircle, ArrowUpRight, ChevronDown, BellRing
} from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy Data for Charts
const statusData = [
  { name: 'New', value: 52, color: '#3b82f6' },
  { name: 'Contacted', value: 78, color: '#06b6d4' },
  { name: 'Follow-up', value: 82, color: '#eab308' },
  { name: 'Negotiation', value: 61, color: '#a855f7' },
  { name: 'Booked', value: 68, color: '#22c55e' },
  { name: 'Lost', value: 41, color: '#ef4444' },
];

const trendData = [
  { month: 'May', leads: 25, bookings: 12 },
  { month: 'Jun', leads: 40, bookings: 22 },
  { month: 'Jul', leads: 65, bookings: 35 },
  { month: 'Aug', leads: 85, bookings: 48 },
];

const sourceData = [
  { name: 'Instagram', value: 28, color: '#ec4899' },
  { name: 'Google', value: 24, color: '#3b82f6' },
  { name: 'WhatsApp', value: 20, color: '#22c55e' },
  { name: 'Referral', value: 16, color: '#eab308' },
  { name: 'Website', value: 8, color: '#a855f7' },
  { name: 'Others', value: 4, color: '#64748b' },
];

export default function SalesLeadTracker() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [selectedLead, setSelectedLead] = useState({
    id: 'L001',
    name: 'Rahul & Priya',
    type: 'Wedding',
    date: '25 Nov 2025',
    city: 'Pune',
    mobile: '+91 98765 43210',
    email: 'rahul.priya@gmail.com',
    source: 'Instagram',
    package: 'Premium',
    budget: '₹3,00,000 - ₹4,00,000',
    assignedTo: 'Govind Tiwari',
    nextFollowUp: '02 Aug 2025',
    notes: 'Looking for traditional + candid\nNeed Drone & Album',
    status: 'Follow-up'
  });

  const recentLeads = [
    { id: 'L001', date: '02 Aug 2025', name: 'Rahul & Priya', type: 'Wedding', eventDate: '25 Nov 2025', city: 'Pune', source: 'Instagram', status: 'Follow-up', nextFollowup: '02 Aug 2025', assigned: 'Govind Tiwari' },
    { id: 'L002', date: '01 Aug 2025', name: 'Amit Sharma', type: 'Pre-Wedding', eventDate: '10 Oct 2025', city: 'Mumbai', source: 'Google', status: 'Contacted', nextFollowup: '03 Aug 2025', assigned: 'Sakshi Jadhav' },
    { id: 'L003', date: '31 Jul 2025', name: 'Neha & Karan', type: 'Wedding', eventDate: '05 Feb 2026', city: 'Nashik', source: 'Referral', status: 'Negotiation', nextFollowup: '04 Aug 2025', assigned: 'Sandeep Jadhav' },
    { id: 'L004', date: '31 Jul 2025', name: 'Rohit Patil', type: 'Birthday', eventDate: '15 Aug 2025', city: 'Pune', source: 'WhatsApp', status: 'Booked', nextFollowup: '-', assigned: 'Govind Tiwari' },
    { id: 'L005', date: '30 Jul 2025', name: 'Meera Iyer', type: 'Maternity', eventDate: '20 Sep 2025', city: 'Mumbai', source: 'Website', status: 'Contacted', nextFollowup: '02 Aug 2025', assigned: 'Sakshi Jadhav' },
    { id: 'L006', date: '30 Jul 2025', name: 'Vikas Enterprises', type: 'Corporate', eventDate: '18 Sep 2025', city: 'Pune', source: 'Google', status: 'Quotation Sent', nextFollowup: '05 Aug 2025', assigned: 'Sandeep Jadhav' },
    { id: 'L007', date: '29 Jul 2025', name: 'Anjali & Deepak', type: 'Wedding', eventDate: '12 Dec 2025', city: 'Lonavala', source: 'Instagram', status: 'Follow-up', nextFollowup: '02 Aug 2025', assigned: 'Govind Tiwari' },
    { id: 'L008', date: '29 Jul 2025', name: 'Sneha Deshmukh', type: 'Pre-Wedding', eventDate: '28 Sep 2025', city: 'Pune', source: 'Referral', status: 'Lost', nextFollowup: '-', assigned: 'Sakshi Jadhav' },
  ];

  const followUpsDue = [
    { name: 'Rahul & Priya', type: 'Wedding', city: 'Pune', date: '02 Aug' },
    { name: 'Meera Iyer', type: 'Maternity', city: 'Mumbai', date: '02 Aug' },
    { name: 'Anjali & Deepak', type: 'Wedding', city: 'Lonavala', date: '02 Aug' },
    { name: 'Siddharth Joshi', type: 'Pre-Wedding', city: 'Pune', date: '02 Aug' },
    { name: 'Pooja & Kunal', type: 'Wedding', city: 'Nashik', date: '02 Aug' },
  ];

  const upcomingEvents = [
    { name: 'Rohit Patil - Birthday', city: 'Pune', date: 'AUG 15', type: 'Event' },
    { name: 'Meera Iyer - Maternity Shoot', city: 'Mumbai', date: 'SEP 20', type: 'Event' },
    { name: 'Rahul & Priya - Wedding', city: 'Pune', date: 'NOV 25', type: 'Event' },
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Follow-up': return 'bg-amber-900/40 text-amber-400 border border-amber-600/30';
      case 'Contacted': return 'bg-cyan-900/40 text-cyan-400 border border-cyan-600/30';
      case 'Negotiation': return 'bg-purple-900/40 text-purple-400 border border-purple-600/30';
      case 'Booked': return 'bg-emerald-900/40 text-emerald-400 border border-emerald-600/30';
      case 'Quotation Sent': return 'bg-blue-900/40 text-blue-400 border border-blue-600/30';
      case 'Lost': return 'bg-rose-900/40 text-rose-400 border border-rose-600/30';
      default: return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 font-sans overflow-hidden">
      
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col justify-between select-none">
        <div>
          {/* Logo Section */}
          <div className="p-4 flex items-center space-x-3 border-b border-slate-800">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Users size={22} />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wider">SALES LEAD TRACKER</h1>
              <p className="text-xs text-slate-400">Ankit Studios</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            {[
              { name: 'Dashboard', icon: LayoutDashboard },
              { name: 'Leads', icon: Users },
              { name: 'Follow-ups', icon: Clock },
              { name: 'Calendar', icon: Calendar },
              { name: 'Customers', icon: UserCheck },
              { name: 'Quotations', icon: FileText },
              { name: 'Bookings', icon: BookmarkCheck },
              { name: 'Reports', icon: BarChart3 },
              { name: 'Tasks', icon: CheckSquare },
              { name: 'Reminders', icon: Bell },
              { name: 'Settings', icon: Settings },
              { name: 'Users', icon: Shield },
              { name: 'Backup & Restore', icon: Database },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveNav(item.name)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center space-x-3 bg-[#0b0f19]/50">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
              alt="Sandeep Jadhav" 
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b0f19] rounded-full"></span>
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold truncate">Sandeep Jadhav</h4>
            <p className="text-xs text-slate-400 truncate">Administrator</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-[#0f172a] border-b border-slate-800 px-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Dashboard
            </h2>
            <p className="text-xs text-slate-400">Overview of your sales leads and performance</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
              <Calendar size={14} className="text-indigo-400" />
              <span>02 Aug - 08 Aug 2025</span>
              <ChevronDown size={14} />
            </div>

            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button className="relative p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 text-slate-300">
              <BellRing size={18} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] font-bold rounded-full flex items-center justify-center text-white">8</span>
            </button>
          </div>
        </header>

        {/* Dashboard Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-7 gap-4">
            {[
              { title: 'Total Leads', val: '352', sub: '12% this month', color: 'text-indigo-400', icon: Users, bg: 'bg-indigo-950/30' },
              { title: 'Booked', val: '68', sub: '18% this month', color: 'text-emerald-400', icon: CheckCircle, bg: 'bg-emerald-950/30' },
              { title: 'Follow-ups Due', val: '23', sub: 'Due Today', color: 'text-amber-400', icon: Clock, bg: 'bg-amber-950/30' },
              { title: 'Quotations Sent', val: '96', sub: '20% this month', color: 'text-blue-400', icon: FileText, bg: 'bg-blue-950/30' },
              { title: 'Lost Leads', val: '41', sub: '8% this month', color: 'text-rose-400', icon: XCircle, bg: 'bg-rose-950/30' },
              { title: 'Expected Revenue', val: '₹18,75,000', sub: 'This Month', color: 'text-emerald-400', icon: ArrowUpRight, bg: 'bg-emerald-950/30', span: 'col-span-1' },
              { title: 'Actual Revenue', val: '₹8,65,000', sub: 'This Month', color: 'text-emerald-400', icon: ArrowUpRight, bg: 'bg-emerald-950/30', span: 'col-span-1' },
            ].map((metric, idx) => (
              <div key={idx} className={`bg-[#111827] border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between ${metric.span || ''}`}>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-slate-400">{metric.title}</span>
                  <div className={`p-1.5 rounded-lg ${metric.bg} ${metric.color}`}>
                    <metric.icon size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mt-2">{metric.val}</h3>
                  <p className={`text-[10px] mt-1 ${metric.color}`}>{metric.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid: Leads Table & Sidebar Widgets */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Recent Leads Table */}
            <div className="col-span-2 bg-[#111827] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm text-white">Recent Leads</h3>
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg border border-slate-700 text-slate-300">
                      <Filter size={12} />
                      <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs rounded-lg text-white font-medium shadow-md shadow-indigo-600/20">
                      <Plus size={12} />
                      <span>Add Lead</span>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-semibold">
                        <th className="py-3 px-2">Lead ID</th>
                        <th className="py-3 px-2">Date</th>
                        <th className="py-3 px-2">Name</th>
                        <th className="py-3 px-2">Event Type</th>
                        <th className="py-3 px-2">City</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2">Next Follow-up</th>
                        <th className="py-3 px-2">Assigned To</th>
                        <th className="py-3 px-2 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-xs">
                      {recentLeads.map((lead) => (
                        <tr 
                          key={lead.id} 
                          onClick={() => setSelectedLead(lead)}
                          className={`hover:bg-slate-800/40 cursor-pointer transition-colors ${selectedLead.id === lead.id ? 'bg-indigo-950/20' : ''}`}
                        >
                          <td className="py-3 px-2 font-mono text-indigo-400">{lead.id}</td>
                          <td className="py-3 px-2 text-slate-400">{lead.date}</td>
                          <td className="py-3 px-2 font-medium text-white">{lead.name}</td>
                          <td className="py-3 px-2 text-slate-300">{lead.type}</td>
                          <td className="py-3 px-2 text-slate-400">{lead.city}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusBadge(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-400">{lead.nextFollowup}</td>
                          <td className="py-3 px-2 text-slate-300">{lead.assigned}</td>
                          <td className="py-3 px-2 text-right text-slate-400">
                            <MoreVertical size={14} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Follow-ups Due Today & Lead Details */}
            <div className="space-y-6">
              
              {/* Follow-ups Due Today */}
              <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-white">Follow-ups Due Today (5)</h3>
                  <a href="#viewall" className="text-xs text-indigo-400 hover:underline">View All</a>
                </div>
                <div className="space-y-3">
                  {followUpsDue.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/60">
                      <div>
                        <h4 className="text-xs font-semibold text-white">{item.name}</h4>
                        <p className="text-[10px] text-slate-400">{item.type} | {item.city}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">{item.date}</span>
                        <button className="p-1.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded-lg">
                          <MessageSquare size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Details Card */}
              <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-white">Lead Details</h3>
                  <div className="flex space-x-2 text-slate-400">
                    <button className="hover:text-white"><FileText size={14} /></button>
                    <button className="hover:text-white"><Settings size={14} /></button>
                    <button className="hover:text-white"><MoreVertical size={14} /></button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                  <img 
                    src="https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&h=100&fit=crop" 
                    alt="Lead" 
                    className="w-12 h-12 rounded-full object-cover border border-slate-700"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white">{selectedLead.name}</h4>
                      <span className="text-[10px] bg-amber-950 text-amber-400 px-2 py-0.5 rounded border border-amber-800/50">Follow-up</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{selectedLead.type} | {selectedLead.city}</p>
                    <p className="text-[10px] text-slate-400">25 Nov 2025 | Pune</p>
                  </div>
                </div>

                {/* Lead Contact Info */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Mobile</span>
                    <span className="font-medium text-slate-200">{selectedLead.mobile}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Email</span>
                    <span className="font-medium text-slate-200">{selectedLead.email}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Source</span>
                    <span className="font-medium text-slate-200">{selectedLead.source}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Package Interested</span>
                    <span className="font-medium text-indigo-400">{selectedLead.package}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Budget</span>
                    <span className="font-medium text-emerald-400">{selectedLead.budget}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Assigned To</span>
                    <span className="font-medium text-slate-200">{selectedLead.assignedTo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Next Follow-up</span>
                    <span className="font-medium text-amber-400">{selectedLead.nextFollowUp}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 block mb-1">Notes</span>
                    <p className="text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800 whitespace-pre-line">
                      {selectedLead.notes}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <button className="flex flex-col items-center justify-center p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-[10px] font-medium border border-emerald-600/30">
                    <Phone size={14} className="mb-1" />
                    <span>Call</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-[10px] font-medium border border-emerald-600/30">
                    <MessageSquare size={14} className="mb-1" />
                    <span>WhatsApp</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg text-[10px] font-medium border border-indigo-600/30">
                    <Send size={14} className="mb-1" />
                    <span>Send Quote</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-[10px] font-medium border border-blue-600/30">
                    <CheckCircle size={14} className="mb-1" />
                    <span>Book</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          {/* Bottom Section: Analytics Charts & Upcoming Events */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* Leads by Status Donut Chart */}
            <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <h3 className="font-bold text-sm text-white mb-3">Leads by Status</h3>
              <div className="h-48 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold text-white">352</span>
                  <span className="text-[10px] text-slate-400">Total</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                {statusData.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-300 truncate">{item.name} - {item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leads vs Bookings Line Chart */}
            <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-sm text-white">Leads vs Bookings</h3>
                <div className="flex items-center space-x-3 text-[10px]">
                  <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span><span className="text-slate-400">Leads</span></span>
                  <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-slate-400">Bookings</span></span>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" stroke="#64748b" textAnchor="end" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, fontSize: 10 }} />
                    <Line type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="bookings" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400 text-right mt-2">(This Month)</p>
            </div>

            {/* Top Lead Sources & Upcoming Events */}
            <div className="space-y-6">
              
              {/* Top Lead Sources */}
              <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5">
                <h3 className="font-bold text-sm text-white mb-3">Top Lead Sources</h3>
                <div className="flex items-center justify-between">
                  <div className="w-28 h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={sourceData} innerRadius={30} outerRadius={50} dataKey="value">
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 pl-4 space-y-1.5 text-[11px]">
                    {sourceData.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                          <span className="text-slate-300">{item.name}</span>
                        </div>
                        <span className="text-slate-400 font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}