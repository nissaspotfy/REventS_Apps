const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

// Normalize newlines to LF for easier replacements
const useCRLF = content.includes('\r\n');
if (useCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Replace handleSendChat and restore auth functions
const badSendChat = `  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const newMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: newMessage }]);
    setIsChatLoading(true);

    try {
      const data = await apiFetch('/api/copilot/chat', {
        method: 'POST',
      });
      setForgotSent(true);
    } catch (err: any) {
      setToast({ message: err.message || 'Gagal mengirim email reset.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };`;

const goodAuthFunctions = `  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const newMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: newMessage }]);
    setIsChatLoading(true);

    try {
      const data = await apiFetch('/api/copilot/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: newMessage,
          history: chatMessages.map(m => ({ role: m.role, text: m.text }))
        })
      });
      setChatMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err: any) {
      setToast({ message: err.message || 'Gagal mengirim pesan chat.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: forgotEmail })
      });
      setForgotSent(true);
    } catch (err: any) {
      setToast({ message: err.message || 'Gagal mengirim email reset.', show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setProfileName('');
    setProfileEmail('');
    setProfilePicUrl(null);
    setRole('audience');
    setView('landing');
    setToast({ message: "Signed out successfully!", show: true });
    setTimeout(() => setToast({ message: '', show: false }), 3000);
  };`;

content = content.replace(badSendChat, goodAuthFunctions);

// 2. Replace mount useEffect
const badUseEffect = `  React.useEffect(() => {
    loadEvents();
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
        apiFetch('/api/auth/profile')
        .then(profile => {
          setIsAuthenticated(true);
          setProfileName(profile.fullName);
          setProfileEmail(profile.email);
          if (profile.profilePicUrl) setProfilePicUrl(profile.profilePicUrl);
          if (profile.role) setRole(profile.role);
          setCurrentUser(profile);
          loadUserTickets();
        })
        .catch(err => {
          console.error("Session expired:", err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
    }
  }, []);`;

const goodUseEffect = `  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    const authErrorFromUrl = params.get('auth_error');
    const eventIdFromUrl = params.get('eventId');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authErrorFromUrl) {
      setToast({ message: \`Google login failed: \${authErrorFromUrl}\`, show: true });
      setTimeout(() => setToast({ message: '', show: false }), 4000);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    loadEvents();

    const existingToken = tokenFromUrl || localStorage.getItem('token');
    if (existingToken) {
        apiFetch('/api/auth/profile')
        .then(profile => {
          setIsAuthenticated(true);
          setProfileName(profile.fullName);
          setProfileEmail(profile.email);
          if (profile.profilePicUrl) setProfilePicUrl(profile.profilePicUrl);
          if (profile.role) setRole(profile.role);
          setCurrentUser(profile);
          loadUserTickets();
        })
        .catch(err => {
          console.error("Session expired:", err);
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
    }

    if (eventIdFromUrl) {
      apiFetch(\`/api/events/\${eventIdFromUrl}\`)
        .then(event => {
          setSelectedEvent(event);
          setPreviousView('landing');
          setCheckoutModal('preview');
        })
        .catch(err => {
          console.error("Failed to load direct event link:", err);
          setToast({ message: "Event not found or direct link invalid.", show: true });
          setTimeout(() => setToast({ message: '', show: false }), 4000);
        });
    }
  }, []);`;

content = content.replace(badUseEffect, goodUseEffect);

// 3. Replace TicketPreviewView button
const badPreviewButton = `                <button 
                  onClick={() => {
                    if (currentUser && selectedEvent.organizerId === currentUser.id) {
                      setToast({ message: "Penyelenggara tidak diperbolehkan membeli tiket dari acara yang dibuat sendiri.", show: true });
                      setTimeout(() => setToast({ message: '', show: false }), 4000);
                      return;
                    }
                    handleGoToCheckoutDetails();
                  }}
                  className="w-full bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-indigo-400 active:scale-95 transition-all mb-3 text-sm"
                >
                  {t.getTickets}
                </button>
                <button onClick={() => setCheckoutModal(null)} className="w-full bg-slate-800 border border-slate-700 text-slate-300 px-6 py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors">
                    Back to previous page
                </button>`;

const goodPreviewButton = `                {selectedEvent.isSalesClosed ? (
                  <button 
                    disabled
                    className="w-full bg-slate-800 text-slate-500 py-3.5 rounded-xl font-bold cursor-not-allowed mb-3 text-sm"
                  >
                    Penjualan Ditutup
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if (currentUser && selectedEvent.organizerId === currentUser.id) {
                        setToast({ message: "Penyelenggara tidak diperbolehkan membeli tiket dari acara yang dibuat sendiri.", show: true });
                        setTimeout(() => setToast({ message: '', show: false }), 4000);
                        return;
                      }
                      handleGoToCheckoutDetails();
                    }}
                    className="w-full bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-indigo-400 active:scale-95 transition-all mb-3 text-sm"
                  >
                    {t.getTickets}
                  </button>
                )}
                <button onClick={() => setCheckoutModal(null)} className="w-full bg-slate-800 border border-slate-700 text-slate-300 px-6 py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors">
                    Back to previous page
                </button>`;

content = content.replace(badPreviewButton, goodPreviewButton);

// 4. Remove duplicate concept block
const doubleConceptBlock = `                        }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-sm">Use the concept</button>
                        <button 
                          onClick={() => {
                            const refinedPrompt = copilotInput + ' refine it more...';
                            setCopilotInput(refinedPrompt);
                            handleGenerateCopilot(refinedPrompt);
                          }}
                          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                        >
                          Refine Prompts
                        </button>
                      </div>
                    </motion.div>
                          } else {
                            setEventTitle("Next-Gen Tech Meetup 2026");
                            setEventCategory("Tech");
                            setEventDescShort("Join us for an evening of insightful talks and networking with industry leaders exploring the future of AI and Web3.");
                            setEventDescFull("**Time:** 09:00 AM - 05:00 PM\\\\n**Location:** SCBD, Jakarta\\\\n\\\\n**Agenda:**\\\\n- 6:00 PM: Doors Open & Networking\\\\n- 7:00 PM: Keynote Panel\\\\n- 8:30 PM: Afterparty\\\\n\\\\nEnjoy an insightful evening.");
                            setEventPosterUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000");
                          }
                          
                          setShowCreateForm(true);
                          setView('create-event');
                        }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-sm">Use the concept</button>
                        <button 
                          onClick={() => {
                            const refinedPrompt = copilotInput + ' refine it more...';
                            setCopilotInput(refinedPrompt);
                            handleGenerateCopilot(refinedPrompt);
                          }}
                          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                        >
                          Refine Prompts
                        </button>
                      </div>
                    </motion.div>
                  )}`;

const singleConceptBlock = `                        }} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-sm">Use the concept</button>
                        <button 
                          onClick={() => {
                            const refinedPrompt = copilotInput + ' refine it more...';
                            setCopilotInput(refinedPrompt);
                            handleGenerateCopilot(refinedPrompt);
                          }}
                          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                        >
                          Refine Prompts
                        </button>
                      </div>
                    </motion.div>
                  )}`;

content = content.replace(doubleConceptBlock, singleConceptBlock);

// 5. Add direct copy link button next to Edit/Settings buttons
const badButtonsLine = `                                <div className="flex gap-2">
                                  <button onClick={() => handleEditEvent(managingEvent)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => setManagingSubView('settings')} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Settings className="w-4 h-4" /></button>
                                </div>`;

const goodButtonsLine = `                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      const url = \`\${window.location.origin}/?eventId=\${managingEvent.id}\`;
                                      navigator.clipboard.writeText(url);
                                      setToast({ message: "Tautan acara berhasil disalin ke papan klip!", show: true });
                                      setTimeout(() => setToast({ message: '', show: false }), 3000);
                                    }}
                                    className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-bold flex items-center gap-1.5"
                                    title="Salin Tautan Langsung"
                                  >
                                    <Link2 className="w-4 h-4" /> Salin Tautan
                                  </button>
                                  <button onClick={() => handleEditEvent(managingEvent)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                  <button onClick={() => setManagingSubView('settings')} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Settings className="w-4 h-4" /></button>
                                </div>`;

content = content.replace(badButtonsLine, goodButtonsLine);

// Restore newlines to CRLF if it was CRLF originally
if (useCRLF) {
  content = content.replace(/\\n/g, '\\r\\n');
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully completed all updates!');
