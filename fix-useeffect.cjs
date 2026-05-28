const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(file, 'utf8');

// The bad chunk currently looks like this in the file:
//   }, [searchQuery, locationQuery, selectedCategory]);
//     }, 300);
//
//     return () => {
//       clearTimeout(handler);
//     };
//   }, [locationQuery]);

// Let's replace the broken part with the correct logic + the new useEffect
const brokenRegex = /\}, \[searchQuery, locationQuery, selectedCategory\]\);\s*\}, 300\);\s*return \(\) => \{\s*clearTimeout\(handler\);\s*\};\s*\}, \[locationQuery\]\);/g;

const replacement = `  }, [searchQuery, locationQuery, selectedCategory]);

  // Debounce search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Debounce location query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocation(locationQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [locationQuery]);

  // Clear Copilot when navigating away
  React.useEffect(() => {
    if (organizerTab !== 'aiEventCoPilot' && view !== 'create-event') {
      setCopilotInput('');
      setCopilotResult(null);
      setCopilotResultObj(null);
    }
  }, [organizerTab, view]);`;

content = content.replace(brokenRegex, replacement);

fs.writeFileSync(file, content, 'utf8');
console.log("Restored debounce and added useEffect");
