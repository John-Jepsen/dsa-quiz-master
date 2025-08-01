// Serverless function to increment page visit counter
// Uses GitHub REST API to update count.json in the repository

export default async function handler(req, res) {
  // Set CORS headers for the frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      console.error('GITHUB_TOKEN not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const owner = 'John-Jepsen';
    const repo = 'dsa-quiz-master';
    const path = 'count.json';
    const branch = 'main';

    // GitHub API headers
    const headers = {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'DSA-Quiz-Master-Visit-Counter'
    };

    // Get current count.json file
    const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    
    let currentCount = 0;
    let fileSha = null;
    
    try {
      const getResponse = await fetch(getFileUrl, { headers });
      
      if (getResponse.status === 404) {
        // File doesn't exist, we'll create it
        currentCount = 0;
      } else if (getResponse.ok) {
        const fileData = await getResponse.json();
        fileSha = fileData.sha;
        
        // Decode base64 content
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const countData = JSON.parse(content);
        currentCount = countData.visits || 0;
      } else {
        throw new Error(`Failed to get file: ${getResponse.status} ${getResponse.statusText}`);
      }
    } catch (error) {
      console.error('Error getting current count:', error);
      return res.status(500).json({ error: 'Failed to retrieve current visit count' });
    }

    // Increment the count
    const newCount = currentCount + 1;
    const newContent = JSON.stringify({ visits: newCount }, null, 2);
    const encodedContent = Buffer.from(newContent).toString('base64');

    // Prepare commit data
    const commitData = {
      message: `Update visit count to ${newCount}`,
      content: encodedContent,
      branch: branch
    };

    // Add SHA if file exists (for updates)
    if (fileSha) {
      commitData.sha = fileSha;
    }

    // Update the file in GitHub
    const updateUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commitData)
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('Failed to update file:', errorData);
      
      // Handle rate limiting
      if (updateResponse.status === 403 && errorData.message?.includes('rate limit')) {
        return res.status(429).json({ 
          error: 'Rate limited. Please try again later.',
          visits: currentCount // Return current count without incrementing
        });
      }
      
      // Handle merge conflicts
      if (updateResponse.status === 409 || errorData.message?.includes('does not match')) {
        console.log('Potential merge conflict, retrying...');
        // Could implement retry logic here, but for simplicity return current count
        return res.status(409).json({ 
          error: 'Concurrent update detected. Please refresh to get updated count.',
          visits: currentCount
        });
      }
      
      throw new Error(`Failed to update count: ${updateResponse.status} ${updateResponse.statusText}`);
    }

    // Success! Return the new count
    console.log(`Visit count updated successfully: ${currentCount} -> ${newCount}`);
    
    return res.status(200).json({ 
      visits: newCount,
      updated: true 
    });

  } catch (error) {
    console.error('Error in visit counter:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      visits: 0 // Fallback count
    });
  }
}