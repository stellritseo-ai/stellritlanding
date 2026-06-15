const fs = require('fs');
const path = require('path');

const files = [
  {
    src: '/Users/jitensony/.gemini/antigravity-ide/brain/a11b7e25-d0a4-44d5-a37f-5678c6035950/impressions_challenge_1781442112357.png',
    dest: '/Users/jitensony/reactwebsite/stellrwebsite/src/assets/case-impressions-challenge.png'
  },
  {
    src: '/Users/jitensony/.gemini/antigravity-ide/brain/a11b7e25-d0a4-44d5-a37f-5678c6035950/impressions_outcome_1781442128573.png',
    dest: '/Users/jitensony/reactwebsite/stellrwebsite/src/assets/case-impressions-outcome.png'
  },
  {
    src: '/Users/jitensony/.gemini/antigravity-ide/brain/a11b7e25-d0a4-44d5-a37f-5678c6035950/ux_challenge_1781442448349.png',
    dest: '/Users/jitensony/reactwebsite/stellrwebsite/src/assets/case-ux-challenge.png'
  },
  {
    src: '/Users/jitensony/.gemini/antigravity-ide/brain/a11b7e25-d0a4-44d5-a37f-5678c6035950/ux_outcome_1781442466702.png',
    dest: '/Users/jitensony/reactwebsite/stellrwebsite/src/assets/case-ux-outcome.png'
  },
  {
    src: '/Users/jitensony/.gemini/antigravity-ide/brain/a11b7e25-d0a4-44d5-a37f-5678c6035950/cyber_challenge_1781442620539.png',
    dest: '/Users/jitensony/reactwebsite/stellrwebsite/src/assets/case-cybersecurity-challenge.png'
  },
  {
    src: '/Users/jitensony/.gemini/antigravity-ide/brain/a11b7e25-d0a4-44d5-a37f-5678c6035950/cyber_outcome_1781442636732.png',
    dest: '/Users/jitensony/reactwebsite/stellrwebsite/src/assets/case-cybersecurity-outcome.png'
  }
];

files.forEach((file, index) => {
  try {
    fs.copyFileSync(file.src, file.dest);
    console.log(`Successfully copied image ${index + 1}`);
  } catch (e) {
    console.error(`Failed to copy image ${index + 1}:`, e.message);
  }
});
