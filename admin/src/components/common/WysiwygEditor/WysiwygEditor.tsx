import React, { useMemo, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './WysiwygEditor.css';

// Define proper TypeScript interfaces for Quill formats
interface QuillFontFormat {
  whitelist: string[];
}

// Register custom fonts with Quill - Fixed TypeScript typing
const Font = ReactQuill.Quill.import('formats/font') as QuillFontFormat;
Font.whitelist = [
  'arial', 'comic-sans', 'courier-new', 'georgia', 
  'helvetica', 'lucida', 'times-new-roman', 'trebuchet-ms', 'verdana'
];
ReactQuill.Quill.register('formats/font', Font, true);


interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  className?: string;
  disabled?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
  enablePdfExport?: boolean;
  pdfFileName?: string;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = "Describe your product features, benefits, and specifications...",
  height = 300,
  className = "",
  disabled = false,
  onImageUpload,
  enablePdfExport = false,
  pdfFileName = "document"
}) => {
  const quillRef = useRef<ReactQuill>(null);

  // Apply font styles to the document head
  useEffect(() => {
    // Check if styles are already added
    if (!document.getElementById('quill-custom-fonts')) {
      const style = document.createElement('style');
      style.id = 'quill-custom-fonts';
      style.textContent = `
        /* Font family styles for Quill editor - FIXED VERSION */
        .ql-font-arial span, .ql-font-arial { font-family: Arial, sans-serif !important; }
        .ql-font-comic-sans span, .ql-font-comic-sans { font-family: 'Comic Sans MS', cursive, fantasy !important; }
        .ql-font-courier-new span, .ql-font-courier-new { font-family: 'Courier New', monospace !important; }
        .ql-font-georgia span, .ql-font-georgia { font-family: Georgia, serif !important; }
        .ql-font-helvetica span, .ql-font-helvetica { font-family: Helvetica, Arial, sans-serif !important; }
        .ql-font-lucida span, .ql-font-lucida { font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif !important; }
        .ql-font-times-new-roman span, .ql-font-times-new-roman { font-family: 'Times New Roman', Times, serif !important; }
        .ql-font-trebuchet-ms span, .ql-font-trebuchet-ms { font-family: 'Trebuchet MS', sans-serif !important; }
        .ql-font-verdana span, .ql-font-verdana { font-family: Verdana, Geneva, sans-serif !important; }
        
        /* Apply to nested elements as well */
        .ql-font-arial * { font-family: Arial, sans-serif !important; }
        .ql-font-comic-sans * { font-family: 'Comic Sans MS', cursive, fantasy !important; }
        .ql-font-courier-new * { font-family: 'Courier New', monospace !important; }
        .ql-font-georgia * { font-family: Georgia, serif !important; }
        .ql-font-helvetica * { font-family: Helvetica, Arial, sans-serif !important; }
        .ql-font-lucida * { font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif !important; }
        .ql-font-times-new-roman * { font-family: 'Times New Roman', Times, serif !important; }
        .ql-font-trebuchet-ms * { font-family: 'Trebuchet MS', sans-serif !important; }
        .ql-font-verdana * { font-family: Verdana, Geneva, sans-serif !important; }
        
        /* Size styles */
        .ql-size-small { font-size: 0.75em !important; }
        .ql-size-large { font-size: 1.5em !important; }
        .ql-size-huge { font-size: 2.5em !important; }
        
        /* Ensure multiple formats work together */
        .ql-editor span[class*="ql-font"] { display: inline !important; }
        .ql-editor span[class*="ql-size"] { display: inline !important; }
        .ql-editor span[style*="color"] { display: inline !important; }
        
        /* Font dropdown labels - Show actual fonts in dropdown */
        .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
          content: 'Arial' !important;
          font-family: Arial, sans-serif !important;
        }
        .ql-picker.ql-font .ql-picker-label[data-value="comic-sans"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="comic-sans"]::before {
          content: 'Comic Sans' !important;
          font-family: 'Comic Sans MS', cursive, fantasy !important;
        }
        .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before {
          content: 'Courier New' !important;
          font-family: 'Courier New', monospace !important;
        }
        .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
          content: 'Georgia' !important;
          font-family: Georgia, serif !important;
        }
        .ql-picker.ql-font .ql-picker-label[data-value="helvetica"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="helvetica"]::before {
          content: 'Helvetica' !important;
          font-family: Helvetica, Arial, sans-serif !important;
        }
        .ql-picker.ql-font .ql-picker-label[data-value="lucida"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="lucida"]::before {
          content: 'Lucida Sans' !important;
          font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif !important;
        }
        .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
          content: 'Times New Roman' !important;
          font-family: 'Times New Roman', Times, serif !important;
        }
        .ql-picker.ql-font .ql-picker-label[data-value="trebuchet-ms"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="trebuchet-ms"]::before {
          content: 'Trebuchet MS' !important;
          font-family: 'Trebuchet MS', sans-serif !important;
        }
        .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
        .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
          content: 'Verdana' !important;
          font-family: Verdana, Geneva, sans-serif !important;
        }
        
        /* Default font label */
        .ql-picker.ql-font .ql-picker-label:not([data-value])::before,
        .ql-picker.ql-font .ql-picker-item[data-value=""]::before {
          content: 'Sans Serif' !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Custom image handler
  const imageHandler = () => {
    if (!onImageUpload) {
      alert('Image upload is not configured. Please use the main product image upload section.');
      return;
    }

    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        alert('Image size should be less than 2MB');
        return;
      }

      try {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection(true);
        quill.insertText(range.index, 'Uploading image...', 'user');

        const imageUrl = await onImageUpload(file);

        quill.deleteText(range.index, 'Uploading image...'.length);
        quill.insertEmbed(range.index, 'image', imageUrl, 'user');
        quill.setSelection(range.index + 1, 'user');
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Image upload failed. Please try again.');
      }
    };
  };

  // PDF export handler
  const exportToPdf = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = value;
      tempDiv.style.cssText = `
        width: 210mm;
        padding: 20mm;
        font-family: Arial, sans-serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #333;
        background: white;
        position: absolute;
        top: -9999px;
        left: -9999px;
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        h1, h2, h3 { margin-top: 20px; margin-bottom: 10px; }
        p { margin-bottom: 10px; }
        ul, ol { margin: 10px 0; padding-left: 30px; }
        blockquote { 
          border-left: 4px solid #ddd; 
          padding-left: 16px; 
          margin: 16px 0; 
          font-style: italic; 
        }
        img { max-width: 100%; height: auto; }
        code { 
          background: #f5f5f5; 
          padding: 2px 4px; 
          border-radius: 3px; 
          font-family: monospace; 
        }
        pre { 
          background: #f5f5f5; 
          padding: 12px; 
          border-radius: 4px; 
          overflow-x: auto; 
        }
        
        /* Include font styles in PDF */
        .ql-font-arial, .ql-font-arial * { font-family: Arial, sans-serif !important; }
        .ql-font-comic-sans, .ql-font-comic-sans * { font-family: 'Comic Sans MS', cursive !important; }
        .ql-font-courier-new, .ql-font-courier-new * { font-family: 'Courier New', monospace !important; }
        .ql-font-georgia, .ql-font-georgia * { font-family: Georgia, serif !important; }
        .ql-font-helvetica, .ql-font-helvetica * { font-family: Helvetica, Arial, sans-serif !important; }
        .ql-font-lucida, .ql-font-lucida * { font-family: 'Lucida Sans Unicode', sans-serif !important; }
        .ql-font-times-new-roman, .ql-font-times-new-roman * { font-family: 'Times New Roman', serif !important; }
        .ql-font-trebuchet-ms, .ql-font-trebuchet-ms * { font-family: 'Trebuchet MS', sans-serif !important; }
        .ql-font-verdana, .ql-font-verdana * { font-family: Verdana, Geneva, sans-serif !important; }
      `;
      tempDiv.appendChild(styleSheet);
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempDiv);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${pdfFileName}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please make sure you have an internet connection and try again.');
    }
  };

  // Enhanced toolbar configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [
          'arial', 'comic-sans', 'courier-new', 'georgia', 
          'helvetica', 'lucida', 'times-new-roman', 'trebuchet-ms', 
          'verdana', false
        ] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        [{ 'direction': 'rtl' }],
        ['blockquote', 'code-block'],
        ['link', ...(onImageUpload ? ['image'] : []), 'video'],
        ['clean'],
        ...(enablePdfExport ? [['pdf-export']] : [])
      ],
      handlers: {
        ...(onImageUpload ? { image: imageHandler } : {}),
        ...(enablePdfExport ? { 'pdf-export': exportToPdf } : {})
      }
    },
    clipboard: {
      matchVisual: false,
    }
  }), [onImageUpload, enablePdfExport, pdfFileName, value]);

  const formats = [
    'font', 'size',
    'header',
    'bold', 'italic', 'underline', 'strike',
    'script',
    'color', 'background',
    'list', 'bullet', 'check',
    'indent',
    'align', 'direction',
    'blockquote', 'code-block',
    'link', 'video',
    ...(onImageUpload ? ['image'] : [])
  ];

  // PDF export button style
  const pdfButtonStyle = enablePdfExport ? `
    .ql-toolbar .ql-pdf-export:after {
      content: "📄";
      font-size: 16px;
    }
    .ql-toolbar .ql-pdf-export {
      width: 36px !important;
      height: 36px !important;
    }
  ` : '';

  return (
    <div className={`wysiwyg-editor-container ${className}`}>
      <style>
        {pdfButtonStyle}
      </style>
      
      {enablePdfExport && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={exportToPdf}
            disabled={!value || disabled}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
          >
            📄 Export PDF
          </button>
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        style={{ 
          height: `${height}px`,
          marginBottom: '42px'
        }}
        className="wysiwyg-editor enhanced-fonts"
      />
      
      {!onImageUpload && (
        <p className="text-xs text-orange-600 mt-2">
          💡 Tip: Use the main image upload section above for product images. Text formatting only available here.
        </p>
      )}
      
      {enablePdfExport && (
        <p className="text-xs text-blue-600 mt-2">
          📄 PDF export available - Click the Export PDF button to download your content as a PDF file.
        </p>
      )}
    </div>
  );
};

export default WysiwygEditor;