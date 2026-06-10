import fs from 'fs';
import path from 'path';

const fixes = [
  {
    file: 'src/components/CtaBand.tsx',
    imports: `import { Link } from "react-router-dom";\nimport { ArrowUpRight } from "lucide-react";\n`
  },
  {
    file: 'src/components/Faq.tsx',
    imports: `import { useState, useEffect, useRef } from "react";\n`
  },
  {
    file: 'src/components/Testimonials.tsx',
    imports: `import { useEffect, useRef, useState } from "react";\n`
  },
  {
    file: 'src/pages/AboutPage.tsx',
    imports: `import { useEffect } from "react";\nimport { Link } from "react-router-dom";\n`
  },
  {
    file: 'src/pages/CareersPage.tsx',
    imports: `import { useEffect } from "react";\n`
  },
  {
    file: 'src/pages/CaseStudyDetailPage.tsx',
    imports: `import { useEffect } from "react";\nimport { useParams, Link } from "react-router-dom";\n`
  },
  {
    file: 'src/pages/ContactPage.tsx',
    imports: `import { useEffect, useState } from "react";\n`
  },
  {
    file: 'src/pages/ServicesPage.tsx',
    imports: `import { useEffect } from "react";\n`
  }
];

fixes.forEach(({ file, imports }) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Basic protection against duplicating imports
    if (!content.includes(imports.split('\n')[0])) {
      fs.writeFileSync(fullPath, imports + '\n' + content, 'utf8');
      console.log('Fixed', file);
    }
  }
});
