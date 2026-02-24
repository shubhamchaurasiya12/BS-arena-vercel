// D:\BS-arena-NextJS\components\MathText.tsx
"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type MathTextProps = {
  text: string;
  className?: string;
  displayMode?: boolean;
};

export default function MathText({ text, className = "", displayMode = false }: MathTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cleanedText = text.replace(/\\\\/g, '\\');
    
    containerRef.current.innerHTML = "";

    if (cleanedText.startsWith('$') && cleanedText.endsWith('$') && !cleanedText.includes('\n')) {
      renderPureMath(cleanedText);
    } else if (cleanedText.includes('||') || (cleanedText.includes('|') && cleanedText.includes('\n|'))) {
      renderWithTable(cleanedText);
    } else {
      renderNormalText(cleanedText);
    }
  }, [text]);

  const renderPureMath = (mathText: string) => {
    const math = mathText.slice(1, -1);
    try {
      katex.render(math, containerRef.current!, {
        displayMode: displayMode,
        throwOnError: false,
        strict: false,
        output: "html"
      });
    } catch (e) {
      console.error("KaTeX render error:", e);
      containerRef.current!.textContent = mathText;
    }
  };

  const renderNormalText = (cleanedText: string) => {
    const parts = [];
    let lastIndex = 0;
    const regex = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g;
    let match;

    while ((match = regex.exec(cleanedText)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanedText.substring(lastIndex, match.index));
      }
      parts.push(match[0]);
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < cleanedText.length) {
      parts.push(cleanedText.substring(lastIndex));
    }

    if (parts.length === 0) {
      const span = document.createElement("span");
      span.innerHTML = formatText(cleanedText);
      containerRef.current?.appendChild(span);
      return;
    }
    
    parts.forEach((part) => {
      if (!part) return;

      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2);
        const span = document.createElement("span");
        span.style.display = "block";
        span.style.textAlign = "center";
        span.style.margin = "0.5em 0";
        try {
          katex.render(math, span, { displayMode: true, throwOnError: false, strict: false, output: "html" });
        } catch (e) {
          span.textContent = part;
        }
        containerRef.current?.appendChild(span);
      } else if (part.startsWith("$") && part.endsWith("$")) {
        const math = part.slice(1, -1);
        const span = document.createElement("span");
        try {
          katex.render(math, span, { displayMode: false, throwOnError: false, strict: false, output: "html" });
        } catch (e) {
          span.textContent = part;
        }
        containerRef.current?.appendChild(span);
      } else if (part) {
        const span = document.createElement("span");
        span.innerHTML = formatText(part);
        containerRef.current?.appendChild(span);
      }
    });
  };

  const renderWithTable = (cleanedText: string) => {
    if (cleanedText.includes('|') && cleanedText.includes('\n|')) {
      renderMarkdownTable(cleanedText);
    } else {
      renderDelimitedTable(cleanedText);
    }
  };

  const renderMarkdownTable = (cleanedText: string) => {
    // ── Line-by-line parser — no regex needed ──────────────────────────────
    // Split into lines, walk through them, detect table blocks by presence of |
    const lines = cleanedText.split('\n');

    type Segment =
      | { type: 'text'; content: string }
      | { type: 'table'; lines: string[] };

    const segments: Segment[] = [];
    let i = 0;

    while (i < lines.length) {
    const line = lines[i]!;
    if (line === undefined) break; // 🔐 hard narrowing
    const trimmed = line.trim();

      // A line that starts with | is part of a table
      if (trimmed.startsWith('|')) {
        const tableLines: string[] = [];
        while (i < lines.length) {const nextLine = lines[i]; if (!nextLine || !nextLine.trim().startsWith('|')) break;
          tableLines.push(nextLine);
          i++;
        }
        segments.push({ type: 'table', lines: tableLines });
      } else {
        // Accumulate consecutive non-table lines as text
        const textLines: string[] = [];
        while (i < lines.length) {
          const nextLine = lines[i];
          if (!nextLine || nextLine.trim().startsWith('|')) break;
          textLines.push(nextLine);
          i++;
        }
        const content = textLines.join('\n');
        if (content.trim()) {
          segments.push({ type: 'text', content });
        }
      }
    }

    // Render each segment
    for (const seg of segments) {
      if (seg.type === 'text') {
        renderNormalText(seg.content);
      } else {
        const tableEl = createMarkdownTable(seg.lines);
        containerRef.current?.appendChild(tableEl);
      }
    }
  };

  const createMarkdownTable = (tableLines: string[]): HTMLTableElement => {
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.margin = "1em 0";
    table.style.width = "100%";
    table.style.border = "1px solid var(--card-border)";

    // Filter out the separator line (|---|-----|)
    const isSeparator = (line: string) =>
      /^\|[\s\-|:]+\|?\s*$/.test(line.trim());

    const nonSepLines = tableLines.filter(l => !isSeparator(l));
    if (nonSepLines.length === 0) return table;

    const parseCells = (line: string): string[] =>
      line
        .replace(/^\|/, '')
        .replace(/\|\s*$/, '')
        .split('|')
        .map(c => c.trim());

    // First non-separator line = header
    const headerLine = nonSepLines[0];
    if (!headerLine) return table; // 🔐 strict narrowing
    const bodyLines  = nonSepLines.slice(1);

    // thead
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    parseCells(headerLine).forEach(cell => {
      const th = document.createElement("th");
      th.style.padding = "0.75rem";
      th.style.border = "1px solid var(--card-border)";
      th.style.textAlign = "center";
      th.style.backgroundColor = "var(--tag-bg)";
      th.style.fontWeight = "600";
      th.style.color = "var(--navy-mid)";
      processCellContent(th, cell.replace(/\*\*(.*?)\*\*/g, '$1'));
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // tbody
    const tbody = document.createElement("tbody");
    bodyLines.forEach(line => {
      const tr = document.createElement("tr");
      parseCells(line).forEach(cell => {
        const td = document.createElement("td");
        td.style.padding = "0.75rem";
        td.style.border = "1px solid var(--card-border)";
        td.style.textAlign = "center";
        td.style.backgroundColor = "var(--card-bg)";
        td.style.color = "var(--ink)";
        processCellContent(td, cell);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    return table;
  };

  const processCellContent = (element: HTMLElement, cellText: string) => {
    const trimmed = cellText.trim();
    
    if (trimmed.startsWith('$') && trimmed.endsWith('$') && !trimmed.includes('\n')) {
      const math = trimmed.slice(1, -1);
      try {
        katex.render(math, element, { displayMode: false, throwOnError: false, strict: false });
        return;
      } catch (e) {
        console.error("KaTeX render error:", e);
      }
    }
    
    const mathParts = trimmed.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
    mathParts.forEach((part) => {
      if (!part) return;
      
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const math = part.slice(2, -2);
        const span = document.createElement("span");
        span.style.display = "block";
        span.style.textAlign = "center";
        katex.render(math, span, { displayMode: true, throwOnError: false });
        element.appendChild(span);
      } else if (part.startsWith("$") && part.endsWith("$")) {
        const math = part.slice(1, -1);
        const span = document.createElement("span");
        katex.render(math, span, { displayMode: false, throwOnError: false });
        element.appendChild(span);
      } else if (part.trim()) {
        element.appendChild(document.createTextNode(part));
      }
    });
  };

  const renderDelimitedTable = (cleanedText: string) => {
    const parts = cleanedText.split(/(\|\|[\s\S]+?\|\|)/g);
    
    parts.forEach((part) => {
      if (part.startsWith("||") && part.endsWith("||")) {
        const tableContent = part.slice(2, -2);
        const table = createDelimitedTable(tableContent);
        containerRef.current?.appendChild(table);
      } else {
        renderNormalText(part);
      }
    });
  };

  const createDelimitedTable = (content: string): HTMLTableElement => {
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.margin = "1em 0";
    table.style.width = "100%";
    table.style.border = "1px solid var(--card-border)";
    
    const rows = content.split('\n').filter(row => row.trim());
    
    rows.forEach((row, index) => {
      const tr = document.createElement("tr");
      const cells = row.split('|').filter(cell => cell.trim() !== '');
      
      cells.forEach((cell) => {
        const td = document.createElement(index === 0 ? "th" : "td");
        td.style.padding = "0.75rem";
        td.style.border = "1px solid var(--card-border)";
        td.style.textAlign = "center";
        
        if (index === 0) {
          td.style.backgroundColor = "var(--tag-bg)";
          td.style.fontWeight = "600";
          td.style.color = "var(--navy-mid)";
        } else {
          td.style.backgroundColor = "var(--card-bg)";
          td.style.color = "var(--ink)";
        }
        
        processCellContent(td, cell);
        tr.appendChild(td);
      });
      
      table.appendChild(tr);
    });
    
    return table;
  };

  const formatText = (text: string): string => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`(.*?)`/g, '<code style="background: var(--tag-bg); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; color: var(--navy-mid);">$1</code>');
    text = text.replace(/\n/g, '<br />');
    return text;
  };

  return <div ref={containerRef} className={className} />;
}