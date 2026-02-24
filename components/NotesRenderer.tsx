// D:\BS-arena-NextJS\components\NotesRenderer.tsx
"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type NotesRendererProps = {
  content: string;
  className?: string;
};

export default function NotesRenderer({ content, className = "" }: NotesRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    // Clean the content
    let cleanedContent = cleanContent(content);

    // Process the markdown-like content
    const processedHTML = parseMarkdownWithMath(cleanedContent);
    containerRef.current.innerHTML = processedHTML;

    // Render all math equations
    renderMathInElement(containerRef.current);
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className={`notes-content prose prose-lg max-w-none ${className}`}
    />
  );
}

/**
 * Clean the content - remove unnecessary parts
 */
function cleanContent(text: string): string {
  let cleaned = text;

  // Remove the intro paragraph (everything before the first main heading)
  cleaned = cleaned.replace(/^[\s\S]*?(?=^#\s+)/m, '');

  // Remove emojis (common ones used in the notes)
  cleaned = cleaned.replace(/📘|📚|🔚|1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣|7️⃣|8️⃣|9️⃣|🔟|✅|❌/g, '');

  // Remove the final section about creating practice problems
  cleaned = cleaned.replace(/If you'?d like, I can now:[\s\S]*$/m, '');

  return cleaned.trim();
}

/**
 * Parse markdown-like syntax and preserve math delimiters
 */
function parseMarkdownWithMath(text: string): string {
  // Store math expressions to protect them during markdown processing
  const mathExpressions: Array<{ content: string; display: boolean }> = [];
  let processed = text;

  // Extract display math ($$...$$)
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (match, content) => {
    const index = mathExpressions.length;
    mathExpressions.push({ content, display: true });
    return `__MATH_${index}__`;
  });

  // Extract inline math ($...$) - more careful matching
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (match, content) => {
    const index = mathExpressions.length;
    mathExpressions.push({ content, display: false });
    return `__MATH_${index}__`;
  });

  // Process tables first (before other markdown)
  processed = parseMarkdownTables(processed);

  // Headers - NOT ITALIC, keep normal font style
  processed = processed.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2 text-gray-900">$1</h1>');
  processed = processed.replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-3 mb-1.5 text-gray-800">$1</h2>');
  processed = processed.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold mt-3 mb-1 text-gray-800">$1</h3>');
  processed = processed.replace(/^#### (.+)$/gm, '<h4 class="text-base font-semibold mt-2 mb-1 text-gray-700">$1</h4>');

  // Horizontal rules
  processed = processed.replace(/^---+$/gm, '<hr class="my-3 border-t border-gray-300" />');

  // Bold: **text** → <strong>text</strong> (keep bold, will be italicized by paragraph class)
  processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');

  // Italic: *text* - Remove this since all text will be italic by default
  // Just remove the asterisks
  processed = processed.replace(/(?<!\*)\*(?!\*)([^\*\n]+?)(?<!\*)\*(?!\*)/g, '$1');

  // Code blocks - NOT ITALIC
  processed = processed.replace(/```([\s\S]+?)```/g, '<pre class="bg-gray-100 rounded-lg p-3 my-2 overflow-x-auto not-italic"><code class="text-sm">$1</code></pre>');

  // Inline code - NOT ITALIC
  processed = processed.replace(/`(.+?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600 not-italic">$1</code>');

  // Blockquotes - will be italic from paragraph
  processed = processed.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 text-gray-600 my-2">$1</blockquote>');

  // Process lists (both nested and non-nested)
  processed = processLists(processed);

  // Process line breaks and paragraphs
  processed = processLineBreaksAndParagraphs(processed);

  // Restore math expressions
  mathExpressions.forEach((math, index) => {
    const placeholder = `__MATH_${index}__`;
    const className = math.display ? 'math-display' : 'math-inline';
    const mathContent = math.content.trim();
    
    processed = processed.replace(
      placeholder,
      `<span class="${className}" data-math="${escapeHtml(mathContent)}"></span>`
    );
  });

  return processed;
}

/**
 * Process line breaks and paragraphs properly
 * ALL TEXT CONTENT WILL BE ITALIC
 */
function processLineBreaksAndParagraphs(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let currentParagraph: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    
    const trimmedLine = line.trim();
    
    // Check if line is a block element (heading, list, table, hr, etc.)
    const isBlockElement = trimmedLine.match(/^<(h\d|ul|ol|table|hr|pre|blockquote)/);
    const isClosingTag = trimmedLine.match(/^<\/(ul|ol|table|blockquote)/);
    
    // Empty line - paragraph break
    if (!trimmedLine) {
      if (currentParagraph.length > 0) {
        // ADD ITALIC CLASS TO ALL PARAGRAPHS
        result.push(`<p class="mb-2 text-gray-700 leading-relaxed italic">${currentParagraph.join('<br>\n')}</p>`);
        currentParagraph = [];
      }
      continue;
    }
    
    // Block element - flush current paragraph and add the block
    if (isBlockElement || isClosingTag) {
      if (currentParagraph.length > 0) {
        // ADD ITALIC CLASS TO ALL PARAGRAPHS
        result.push(`<p class="mb-2 text-gray-700 leading-relaxed italic">${currentParagraph.join('<br>\n')}</p>`);
        currentParagraph = [];
      }
      result.push(trimmedLine);
      continue;
    }
    
    // Regular text line - add to current paragraph
    currentParagraph.push(trimmedLine);
  }
  
  // Flush remaining paragraph
  if (currentParagraph.length > 0) {
    // ADD ITALIC CLASS TO ALL PARAGRAPHS
    result.push(`<p class="mb-2 text-gray-700 leading-relaxed italic">${currentParagraph.join('<br>\n')}</p>`);
  }
  
  return result.join('\n');
}

/**
 * Process lists (handles both regular and nested lists)
 * LIST ITEMS WILL BE ITALIC
 */
function processLists(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }
    
    // Check if line is a list item (starts with * or number.)
    if (line.match(/^(\s*)\* (.+)$/) || line.match(/^(\s*)\d+\. (.+)$/)) {
      const listLines: string[] = [];
      
      // Collect all consecutive list lines (including nested)
      while (i < lines.length) {
        const currentLine = lines[i];
        if (!currentLine) break;

        if (
          currentLine.match(/^(\s*)\* (.+)$/) ||
          currentLine.match(/^(\s*)\d+\. (.+)$/)
        ) {
          listLines.push(currentLine);
          i++;
        } else {
          break;
        }
      }
      
      result.push(convertListToHTML(listLines));
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}

/**
 * Convert list lines to HTML (handles nesting)
 * ADD ITALIC TO LIST ITEMS
 */
function convertListToHTML(listLines: string[]): string {
  let html = '';
  const stack: { indent: number; type: 'ul' | 'ol' }[] = [];
  
  for (const line of listLines) {
    // Detect indent level and list type
    const match = line.match(/^(\s*)(\*|\d+\.)\s+(.+)$/);
    if (!match) continue;
    
    const indent = match[1]?.length ?? 0;
    const marker = match[2] ?? '';
    const content = match[3] ?? '';
    const listType = marker === '*' ? 'ul' : 'ol';
    
    // Close lists that are deeper than current indent
    while (stack.length > 0) {
      const lastItem = stack[stack.length - 1];
      if (lastItem && lastItem.indent >= indent) {
        stack.pop();
        html += `</${lastItem.type}>`;
      } else {
        break;
      }
    }
    
    // Open new list if needed
    if (stack.length === 0) {
      const listClass = listType === 'ul' ? 'list-disc' : 'list-decimal';
      const marginClass = 'my-2';
      html += `<${listType} class="${listClass} ${marginClass} space-y-0.5 ml-6">`;
      stack.push({ indent, type: listType });
    } else {
      const lastItem = stack[stack.length - 1];
      if (lastItem && lastItem.indent < indent) {
        const listClass = listType === 'ul' ? 'list-disc' : 'list-decimal';
        const marginClass = 'my-0.5';
        html += `<${listType} class="${listClass} ${marginClass} space-y-0.5 ml-6">`;
        stack.push({ indent, type: listType });
      }
    }
    
    // Add list item - ADD ITALIC CLASS
    html += `<li class="text-gray-700 leading-snug italic">${content}</li>`;
  }
  
  // Close remaining lists
  while (stack.length > 0) {
    const lastItem = stack.pop();
    if (lastItem) {
      html += `</${lastItem.type}>`;
    }
  }
  
  return html;
}

/**
 * Parse markdown tables
 */
function parseMarkdownTables(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }
    
    // Check if this line starts a table
    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      
      // Collect all consecutive table lines
      while (i < lines.length) {
        const currentLine = lines[i];
        if (!currentLine) break;
        
        if (currentLine.trim().startsWith('|')) {
          tableLines.push(currentLine);
          i++;
        } else {
          break;
        }
      }
      
      if (tableLines.length >= 2) {
        result.push(convertMarkdownTableToHTML(tableLines));
      } else {
        result.push(...tableLines);
      }
    } else {
      result.push(line);
      i++;
    }
  }
  
  return result.join('\n');
}

/**
 * Convert markdown table to HTML
 * TABLE CELLS WILL BE ITALIC
 */
function convertMarkdownTableToHTML(tableLines: string[]): string {
  if (tableLines.length < 2) return tableLines.join('\n');
  if (!tableLines[0] || !tableLines[1]) return tableLines.join('\n');

  let html = '<table class="min-w-full my-3 border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-sm"><thead class="bg-gray-100"><tr>';
  
  // Header row - NOT ITALIC (headers should be normal)
  const headers = tableLines[0]
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell.length > 0);
  
  headers.forEach(header => {
    html += `<th class="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-800 text-sm">${header}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  // Body rows - ADD ITALIC TO TABLE CELLS
  for (let i = 2; i < tableLines.length; i++) {
    const currentLine = tableLines[i];
    if (!currentLine) continue;
    
    const cells = currentLine
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell.length > 0);
    
    if (cells.length > 0) {
      html += '<tr class="hover:bg-gray-50">';
      cells.forEach(cell => {
        html += `<td class="border border-gray-300 px-4 py-2 text-gray-700 text-sm italic">${cell}</td>`;
      });
      html += '</tr>';
    }
  }
  
  html += '</tbody></table>';
  return html;
}

/**
 * Render math equations using KaTeX
 * Math equations remain NOT ITALIC
 */
function renderMathInElement(element: HTMLElement) {
  // Render display math
  const displayMathElements = element.querySelectorAll('.math-display');
  displayMathElements.forEach((el) => {
    const mathContent = el.getAttribute('data-math') || '';
    
    if (mathContent) {
      try {
        katex.render(mathContent, el as HTMLElement, {
          displayMode: true,
          throwOnError: false,
          strict: false,
          trust: true,
        });
        (el as HTMLElement).style.display = 'block';
        (el as HTMLElement).style.textAlign = 'center';
        (el as HTMLElement).style.margin = '1rem 0';
        // Ensure math is not italic
        (el as HTMLElement).style.fontStyle = 'normal';
      } catch (e) {
        console.error('KaTeX display math error:', e, mathContent);
        el.textContent = `[Math Error: ${mathContent}]`;
      }
    }
  });

  // Render inline math
  const inlineMathElements = element.querySelectorAll('.math-inline');
  inlineMathElements.forEach((el) => {
    const mathContent = el.getAttribute('data-math') || '';
    
    if (mathContent) {
      try {
        katex.render(mathContent, el as HTMLElement, {
          displayMode: false,
          throwOnError: false,
          strict: false,
          trust: true,
        });
        (el as HTMLElement).style.display = 'inline-block';
        (el as HTMLElement).style.margin = '0 0.1rem';
        // Ensure math is not italic
        (el as HTMLElement).style.fontStyle = 'normal';
      } catch (e) {
        console.error('KaTeX inline math error:', e, mathContent);
        el.textContent = `[Math Error: ${mathContent}]`;
      }
    }
  });
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}