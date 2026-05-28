const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Publish Event button
content = content.replace(
    '<button onClick={handleCreateEventSubmit} className="bg-indigo-600 text-white',
    '<button onClick={() => handleCreateEventSubmit(\'active\')} className="bg-indigo-600 text-white'
);

// 2. Fix the redirect logic in handleCreateEventSubmit
// The code is:
//       setShowCreateForm(false);
//       setView('dashboard');
//       setOrganizerTab('myPublishedEvents');
content = content.replace(
    "      setOrganizerTab('myPublishedEvents');",
    "      if (status === 'draft') setOrganizerTab('drafts'); else setOrganizerTab('myPublishedEvents');"
);

// 3. Move the cancel modal out of the motion.div to fix positioning
const modalStartStr = '<AnimatePresence>\r\n                        {showCancelModal && (';
const modalEndStr = '                      </AnimatePresence>';

const modalStartIdx = content.indexOf('<AnimatePresence>\n                        {showCancelModal && (') !== -1 ? content.indexOf('<AnimatePresence>\n                        {showCancelModal && (') : content.indexOf(modalStartStr);

if (modalStartIdx !== -1) {
    // Determine which newline is used
    const useCRLF = content.includes('\r\n');
    const actualModalEndStr = useCRLF ? '                      </AnimatePresence>' : '                      </AnimatePresence>';
    
    // Let's use a regex to grab the block, it's safer
    const blockRegex = /<AnimatePresence>\s*\{showCancelModal && \([\s\S]*?<\/AnimatePresence>/;
    const match = content.match(blockRegex);
    
    if (match) {
        const modalContent = match[0];
        // Remove it from its original position
        content = content.replace(blockRegex, '');
        
        // Find the target insertion point: just before `</div>\n            )}` 
        // We know it is inside `{view === 'create-event' && (`
        // Let's find `              </motion.div>\n            </div>\n            )}`
        const targetRegex = /              <\/motion\.div>\s*<\/div>\s*\)\}/;
        if (targetRegex.test(content)) {
            content = content.replace(targetRegex, `              </motion.div>\n${modalContent}\n            </div>\n            )}`);
            console.log("Success: Moved modal out of motion.div");
        } else {
            console.log("Error: Target insertion point not found");
        }
    } else {
        console.log("Error: Modal block not found by regex");
    }
} else {
    console.log("Error: Modal start string not found");
}

fs.writeFileSync(file, content, 'utf8');
