import React, { useState, useEffect, useRef } from 'react';
import { GeneratedSong } from '../types';
import { jsPDF } from 'jspdf';

interface LyricsCardProps {
  song: GeneratedSong;
  onReset: () => void;
}

export const LyricsCard: React.FC<LyricsCardProps> = ({ song, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize lyrics state. Convert newlines to <br> for HTML display/editing.
  const formatInitialLyrics = (text: string) => {
    // Check if it already looks like HTML (basic check) to avoid double encoding if re-passed
    if (text.includes('<br>') || text.includes('<div>') || text.includes('<p>')) return text;
    return text.replace(/\n/g, '<br>');
  };

  const [lyrics, setLyrics] = useState(formatInitialLyrics(song.lyrics));
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync lyrics if the song prop changes (e.g. re-generation)
  useEffect(() => {
    setLyrics(formatInitialLyrics(song.lyrics));
  }, [song]);

  const getPlainTextLyrics = () => {
    // Robust HTML to Text conversion
    let processedHtml = lyrics
      // Replace breaks with newlines
      .replace(/<br\s*\/?>/gi, '\n')
      // Replace closing block tags with newlines
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/p>/gi, '\n');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHtml;
    
    // Get text content (strips tags)
    let text = tempDiv.textContent || '';
    
    // Clean up excessive newlines (more than 2) and trim
    return text.replace(/\n{3,}/g, '\n\n').trim();
  };

  const handleCopy = () => {
    const plainTextLyrics = getPlainTextLyrics();
    const fullText = `${song.title}\n\nStyle: ${song.styleDescription}\n\n${plainTextLyrics}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const plainTextLyrics = getPlainTextLyrics();
    // Use \r\n for better Windows compatibility in text files
    const fullText = `${song.title}\r\n\r\nStyle: ${song.styleDescription}\r\n\r\n${plainTextLyrics.replace(/\n/g, '\r\n')}`;
    
    const element = document.createElement("a");
    const file = new Blob([fullText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    
    // Set Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(song.title, pageWidth / 2, 20, { align: "center" });
    
    // Set Style Description
    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(100);
    
    const splitStyle = doc.splitTextToSize(`Style: ${song.styleDescription}`, maxLineWidth);
    doc.text(splitStyle, pageWidth / 2, 30, { align: "center" });
    
    // Calculate Y position for lyrics
    let yPos = 30 + (splitStyle.length * 6) + 15;
    
    // Set Lyrics
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0);

    const plainTextLyrics = getPlainTextLyrics();
    const splitLyrics = doc.splitTextToSize(plainTextLyrics, maxLineWidth);
    
    // Add lyrics line by line
    const lineHeight = 7; 
    
    splitLyrics.forEach((line: string) => {
      // Check for page break
      if (yPos > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin; 
      }
      doc.text(line, margin, yPos);
      yPos += lineHeight;
    });

    // Save
    doc.save(`${song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }, 0);
  };

  const handleSave = () => {
    if (editorRef.current) {
      setLyrics(editorRef.current.innerHTML);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const applyFormat = (command: string) => {
    document.execCommand(command, false, undefined);
    if (editorRef.current) editorRef.current.focus();
  };

  return (
    <div className="w-full animate-fade-in-up">
      <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Header/Title Section */}
        <div className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 p-8 border-b border-white/10 relative">
          <div className="absolute top-0 right-0 p-4 flex gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={handleEditClick}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                  title="Edit Lyrics"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <span className="text-green-400 font-bold text-xs">Copied!</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={handleDownloadText}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                  title="Download as Text File"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                  title="Download PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                <button
                   onClick={onReset}
                   className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white"
                   title="Create New Song"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
              </>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight text-shadow-sm pr-20">
            {song.title}
          </h2>
          <div className="inline-block bg-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm border border-white/10">
            <p className="text-sm md:text-base text-purple-200 font-medium">
              🎵 {song.styleDescription}
            </p>
          </div>
        </div>

        {/* Lyrics Body */}
        <div className="p-8 md:p-10 bg-gradient-to-b from-slate-900/50 to-slate-900/80">
          {isEditing ? (
            <div className="space-y-4 animate-fade-in">
               {/* Toolbar */}
               <div className="flex items-center gap-1 p-1 bg-slate-700/50 border border-slate-600 rounded-lg w-fit mb-2">
                 <button 
                   onMouseDown={(e) => { e.preventDefault(); applyFormat('bold'); }}
                   className="p-2 hover:bg-slate-600 rounded text-slate-200 hover:text-white font-bold transition-colors w-10 h-10 flex items-center justify-center" 
                   title="Bold"
                 >
                   B
                 </button>
                 <button 
                   onMouseDown={(e) => { e.preventDefault(); applyFormat('italic'); }}
                   className="p-2 hover:bg-slate-600 rounded text-slate-200 hover:text-white italic transition-colors w-10 h-10 flex items-center justify-center" 
                   title="Italic"
                 >
                   I
                 </button>
                 <button 
                   onMouseDown={(e) => { e.preventDefault(); applyFormat('underline'); }}
                   className="p-2 hover:bg-slate-600 rounded text-slate-200 hover:text-white underline transition-colors w-10 h-10 flex items-center justify-center" 
                   title="Underline"
                 >
                   U
                 </button>
               </div>

               <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="w-full bg-slate-800/50 text-slate-200 border border-slate-600 rounded-lg p-4 font-sans text-lg md:text-xl leading-relaxed tracking-wide outline-none focus:ring-2 focus:ring-purple-500 overflow-y-auto min-h-[300px]"
                dangerouslySetInnerHTML={{ __html: lyrics }}
              />
              <div className="flex justify-end gap-3">
                 <button
                   onClick={handleCancel}
                   className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleSave}
                   className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors flex items-center gap-2"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                   Save Changes
                 </button>
              </div>
            </div>
          ) : (
            <div 
              className="whitespace-pre-wrap font-sans text-lg md:text-xl leading-relaxed text-slate-200 tracking-wide"
              dangerouslySetInnerHTML={{ __html: lyrics }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900/90 p-4 border-t border-slate-700/50 flex justify-between items-center text-xs text-slate-500">
           <span>Generated by LyricalGenius AI</span>
           <span>Gemini 2.5 Flash</span>
        </div>
      </div>
      
      {!isEditing && (
        <div className="mt-8 text-center">
          <button
            onClick={onReset}
            className="text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Compose Another Song
          </button>
        </div>
      )}
    </div>
  );
}