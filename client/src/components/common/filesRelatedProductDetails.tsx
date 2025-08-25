// Add the WYSIWYG content styles
export const wysiwygStyles = `
.wysiwyg-content .ql-font-arial { font-family: Arial, sans-serif !important; }
.wysiwyg-content .ql-font-comic-sans { font-family: 'Comic Sans MS', cursive, fantasy !important; }
.wysiwyg-content .ql-font-courier-new { font-family: 'Courier New', monospace !important; }
.wysiwyg-content .ql-font-georgia { font-family: Georgia, serif !important; }
.wysiwyg-content .ql-font-helvetica { font-family: Helvetica, Arial, sans-serif !important; }
.wysiwyg-content .ql-font-lucida { font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif !important; }
.wysiwyg-content .ql-font-times-new-roman { font-family: 'Times New Roman', Times, serif !important; }
.wysiwyg-content .ql-font-trebuchet-ms { font-family: 'Trebuchet MS', sans-serif !important; }
.wysiwyg-content .ql-font-verdana { font-family: Verdana, Geneva, sans-serif !important; }
.wysiwyg-content .ql-size-small { font-size: 0.75em !important; }
.wysiwyg-content .ql-size-large { font-size: 1.5em !important; }
.wysiwyg-content .ql-size-huge { font-size: 2.5em !important; }
.wysiwyg-content strong { font-weight: bold; }
.wysiwyg-content em { font-style: italic; }
.wysiwyg-content u { text-decoration: underline; }
.wysiwyg-content s { text-decoration: line-through; }
.wysiwyg-content h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; color: #1f2937; }
.wysiwyg-content h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; color: #1f2937; }
.wysiwyg-content h3 { font-size: 1.2em; font-weight: bold; margin: 0.5em 0; color: #1f2937; }
.wysiwyg-content h4 { font-size: 1.1em; font-weight: bold; margin: 0.5em 0; color: #1f2937; }
.wysiwyg-content h5 { font-size: 1em; font-weight: bold; margin: 0.5em 0; color: #1f2937; }
.wysiwyg-content h6 { font-size: 0.9em; font-weight: bold; margin: 0.5em 0; color: #1f2937; }
.wysiwyg-content ul { list-style-type: disc; margin: 0.5em 0; padding-left: 1.5em; }
.wysiwyg-content ol { list-style-type: decimal; margin: 0.5em 0; padding-left: 1.5em; }
.wysiwyg-content li { margin: 0.25em 0; }
.wysiwyg-content blockquote { border-left: 4px solid #d1d5db; margin: 1em 0; padding-left: 1em; font-style: italic; color: #6b7280; }
.wysiwyg-content code { background-color: #f3f4f6; border-radius: 3px; padding: 2px 4px; font-family: 'Courier New', monospace; font-size: 0.9em; color: #dc2626; }
.wysiwyg-content pre { background-color: #f8fafc; border-radius: 6px; padding: 1em; margin: 1em 0; overflow-x: auto; border: 1px solid #e5e7eb; white-space: pre-wrap; }
.wysiwyg-content a { color: #3b82f6; text-decoration: underline; }
.wysiwyg-content a:hover { color: #1d4ed8; }
.wysiwyg-content .ql-align-center { text-align: center; }
.wysiwyg-content .ql-align-right { text-align: right; }
.wysiwyg-content .ql-align-left { text-align: left; }
.wysiwyg-content .ql-align-justify { text-align: justify; }
.wysiwyg-content .ql-indent-1 { margin-left: 3em; }
.wysiwyg-content .ql-indent-2 { margin-left: 6em; }
.wysiwyg-content .ql-indent-3 { margin-left: 9em; }
.wysiwyg-content .ql-indent-4 { margin-left: 12em; }
.wysiwyg-content .ql-indent-5 { margin-left: 15em; }
.wysiwyg-content .ql-indent-6 { margin-left: 18em; }
.wysiwyg-content .ql-indent-7 { margin-left: 21em; }
.wysiwyg-content .ql-indent-8 { margin-left: 24em; }
.wysiwyg-content img { max-width: 100%; height: auto; border-radius: 4px; margin: 0.5em 0; }
.wysiwyg-content p { margin: 0.5em 0; line-height: 1.6; }
.wysiwyg-content sup { vertical-align: super; font-size: smaller; }
.wysiwyg-content sub { vertical-align: sub; font-size: smaller; }
.wysiwyg-content .ql-direction-rtl { direction: rtl; text-align: right; }
`;

// Loading skeleton component for better UX
export const ProductSkeleton: React.FC = () => (
    <div className="container mx-auto p-4 my-6 animate-pulse">
        <div className="h-8 w-20 bg-gray-200 rounded mb-6"></div>
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
                <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
                <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-16 h-16 bg-gray-200 rounded-md"></div>
                    ))}
                </div>
            </div>
            <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    </div>
);