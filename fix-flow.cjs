const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Remove the entire AnimatePresence for showCancelModal
const modalRegex = /<AnimatePresence>\s*\{showCancelModal && \([\s\S]*?<\/AnimatePresence>/g;
content = content.replace(modalRegex, '');

// 2. Update the X button onClick
const xButtonRegex = /<button\s+onClick=\{\(\) => setShowCreateForm\(false\)\}\s+className="absolute top-6 right-6 p-2/g;
const xButtonReplacement = `<button 
                      onClick={() => {
                        setShowCreateForm(false);
                        setView('dashboard');
                        setOrganizerTab('aiEventCoPilot');
                        setCopilotInput('');
                        setCopilotResult(null);
                        setCopilotResultObj(null);
                      }}
                      className="absolute top-6 right-6 p-2`;
content = content.replace(xButtonRegex, xButtonReplacement);

// 3. Update the 'Batal' button to 'Save Draft'
const batalBtnRegex = /<button onClick=\{\(\) => \{\s*const isDirty[\s\S]*?\}\}\s*className="bg-white dark:bg-slate-800[^"]*">Batal<\/button>/;
const batalBtnReplacement = `<button onClick={() => handleCreateEventSubmit('draft')} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all text-sm">Save Draft</button>`;
content = content.replace(batalBtnRegex, batalBtnReplacement);

// 4. Update the wrapper className to be always overflow-y-auto
const wrapperRegex = /className=\{\`fixed inset-0 z-50 \$\{showCancelModal \? 'overflow-hidden' : 'overflow-y-auto'\} bg-slate-900\/40 backdrop-blur-sm p-4 sm:p-8\`\}/g;
content = content.replace(wrapperRegex, 'className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8"');

// 5. Update the "Use the concept" button to set price, capacity, ticketType
const useConceptRegex = /if \(copilotResultObj\.date\) setEventDate\(copilotResultObj\.date\);\s*if \(copilotResultObj\.location\) setEventAddress\(copilotResultObj\.location\);\s*setEventPosterUrl[^\n]*/;
const useConceptMatch = content.match(useConceptRegex);
if (useConceptMatch) {
    const useConceptReplacement = `${useConceptMatch[0]}
                            if (copilotResultObj.price) {
                                if (copilotResultObj.price.toString().toLowerCase() === 'free') {
                                    setTicketType('free');
                                } else {
                                    setTicketType('paid');
                                    const digits = copilotResultObj.price.toString().replace(/\\D/g, '');
                                    if (digits) setEventPrice(digits);
                                }
                            }
                            if (copilotResultObj.capacity) {
                                setEventCapacity(copilotResultObj.capacity.toString());
                            }`;
    content = content.replace(useConceptRegex, useConceptReplacement);
}

fs.writeFileSync(file, content, 'utf8');
console.log("Success: Updated form flow");
