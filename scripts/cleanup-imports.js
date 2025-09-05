#!/usr/bin/env node

// Script to analyze and clean up unused imports
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Common unused imports to check for
const COMMON_UNUSED_IMPORTS = [
  'React', // Often unused in Next.js 13+ with app directory
  'useState', // If not used
  'useEffect', // If not used
  'useCallback', // If not used
  'useMemo', // If not used
  'useRef', // If not used
  'useRouter', // If not used
  'usePathname', // If not used
  'useSearchParams', // If not used
]

// Files to analyze
const FILES_TO_ANALYZE = [
  'app/**/*.tsx',
  'components/**/*.tsx',
  'lib/**/*.ts',
  'contexts/**/*.tsx'
]

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')
    const issues = []

    // Check for unused React import
    if (content.includes("import React from 'react'") && !content.includes('React.')) {
      issues.push({
        type: 'unused_import',
        line: lines.findIndex(line => line.includes("import React from 'react'")) + 1,
        message: 'React import may be unused (Next.js 13+ auto-imports React)',
        suggestion: "Remove 'import React from 'react''"
      })
    }

    // Check for unused useState
    if (content.includes("import { useState }") && !content.includes('useState(')) {
      issues.push({
        type: 'unused_import',
        line: lines.findIndex(line => line.includes("import { useState }")) + 1,
        message: 'useState import is unused',
        suggestion: "Remove 'useState' from import"
      })
    }

    // Check for unused useEffect
    if (content.includes("import { useEffect }") && !content.includes('useEffect(')) {
      issues.push({
        type: 'unused_import',
        line: lines.findIndex(line => line.includes("import { useEffect }")) + 1,
        message: 'useEffect import is unused',
        suggestion: "Remove 'useEffect' from import"
      })
    }

    // Check for unused useRouter
    if (content.includes("import { useRouter }") && !content.includes('useRouter(')) {
      issues.push({
        type: 'unused_import',
        line: lines.findIndex(line => line.includes("import { useRouter }")) + 1,
        message: 'useRouter import is unused',
        suggestion: "Remove 'useRouter' from import"
      })
    }

    // Check for console.log statements
    const consoleLogLines = lines
      .map((line, index) => ({ line: line.trim(), index: index + 1 }))
      .filter(({ line }) => line.includes('console.log') || line.includes('console.error') || line.includes('console.warn'))
      .map(({ line, index }) => ({
        type: 'console_statement',
        line: index,
        message: 'Console statement found',
        suggestion: 'Replace with proper logging'
      }))

    issues.push(...consoleLogLines)

    return issues
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message)
    return []
  }
}

function generateReport() {
  console.log('🔍 Analyzing files for optimization opportunities...\n')

  const allIssues = []
  const filesToCheck = [
    'app/admin/categories/page.tsx',
    'app/admin/customers/page.tsx',
    'app/admin/orders/page.tsx',
    'app/admin/products/page.tsx',
    'components/Header.tsx',
    'components/Footer.tsx',
    'contexts/CartContext.tsx',
    'contexts/ProductsContext.tsx'
  ]

  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const issues = analyzeFile(file)
      if (issues.length > 0) {
        allIssues.push({ file, issues })
      }
    }
  })

  if (allIssues.length === 0) {
    console.log('✅ No optimization issues found!')
    return
  }

  console.log('📊 Optimization Report:\n')

  allIssues.forEach(({ file, issues }) => {
    console.log(`📁 ${file}`)
    issues.forEach(issue => {
      console.log(`  Line ${issue.line}: ${issue.message}`)
      console.log(`  💡 ${issue.suggestion}`)
    })
    console.log('')
  })

  // Generate summary
  const totalIssues = allIssues.reduce((sum, { issues }) => sum + issues.length, 0)
  const unusedImports = allIssues.reduce((sum, { issues }) => 
    sum + issues.filter(issue => issue.type === 'unused_import').length, 0)
  const consoleStatements = allIssues.reduce((sum, { issues }) => 
    sum + issues.filter(issue => issue.type === 'console_statement').length, 0)

  console.log('📈 Summary:')
  console.log(`  Total issues: ${totalIssues}`)
  console.log(`  Unused imports: ${unusedImports}`)
  console.log(`  Console statements: ${consoleStatements}`)
  console.log('')

  // Generate recommendations
  console.log('🚀 Recommendations:')
  console.log('  1. Remove unused imports to reduce bundle size')
  console.log('  2. Replace console statements with proper logging')
  console.log('  3. Use dynamic imports for large components')
  console.log('  4. Implement code splitting for admin routes')
  console.log('  5. Optimize images and assets')
}

// Run the analysis
generateReport()
