#!/usr/bin/env node

/**
 * Split the generated GitHub issues into individual files
 */

import fs from 'fs';
import path from 'path';

// Read the generated issues file
const issuesContent = fs.readFileSync('/tmp/github-issues.md', 'utf8');

// Split by the separator lines
const sections = issuesContent.split('='.repeat(80));

// Create output directory
const outputDir = '/home/runner/work/dsa-quiz-master/dsa-quiz-master/docs/github-issues';

let issueCounter = 0;

sections.forEach((section, index) => {
  const trimmedSection = section.trim();
  if (!trimmedSection) return;

  if (trimmedSection.startsWith('MASTER ISSUE')) {
    // This is the master issue
    const content = sections[index + 1].trim();
    fs.writeFileSync(path.join(outputDir, '00-master-issue.md'), content);
    console.log('Created: 00-master-issue.md');
  } else if (trimmedSection.startsWith('ISSUE -')) {
    // This is an individual module issue
    const content = sections[index + 1].trim();
    issueCounter++;
    
    // Extract module info from the title
    const titleMatch = trimmedSection.match(/ISSUE - (.+?) \(/);
    if (titleMatch) {
      const moduleName = titleMatch[1];
      const fileName = `${issueCounter.toString().padStart(2, '0')}-${moduleName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}.md`;
      
      fs.writeFileSync(path.join(outputDir, fileName), content);
      console.log(`Created: ${fileName}`);
    }
  }
});

console.log(`\nGenerated ${issueCounter + 1} GitHub issue files`);
console.log('- 1 master issue');
console.log(`- ${issueCounter} individual module issues`);