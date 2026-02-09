import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { 
  File, Folder, FolderOpen, ChevronRight, ChevronDown, 
  FileCode, FileJson, FileText, Image, Settings, Package,
  Sparkles, X
} from 'lucide-react';
import { SiReact, SiVuedotjs, SiNextdotjs, SiAngular, SiSvelte, SiTypescript } from 'react-icons/si';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number;
}

interface ZipPreviewProps {
  file: File | null;
  onClose: () => void;
  onFrameworkDetected?: (framework: string | null) => void;
}

const FRAMEWORK_INDICATORS: Record<string, { files: string[], deps: string[] }> = {
  'Next.js': { files: ['next.config.js', 'next.config.mjs', 'next.config.ts'], deps: ['next'] },
  'React': { files: [], deps: ['react', 'react-dom'] },
  'Vue': { files: ['vue.config.js', 'vite.config.ts'], deps: ['vue'] },
  'Angular': { files: ['angular.json'], deps: ['@angular/core'] },
  'Svelte': { files: ['svelte.config.js'], deps: ['svelte'] },
};

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const name = filename.toLowerCase();
  
  if (name === 'package.json') return <Package className="w-4 h-4 text-[#00C853]" />;
  if (name.includes('config') || name.includes('rc')) return <Settings className="w-4 h-4 text-slate-400" />;
  
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return <SiReact className="w-4 h-4 text-[#61DAFB]" />;
    case 'vue':
      return <SiVuedotjs className="w-4 h-4 text-[#4FC08D]" />;
    case 'ts':
      return <SiTypescript className="w-4 h-4 text-[#3178C6]" />;
    case 'js':
    case 'mjs':
      return <FileCode className="w-4 h-4 text-[#F7DF1E]" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-[#FF9100]" />;
    case 'md':
    case 'txt':
      return <FileText className="w-4 h-4 text-slate-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'ico':
      return <Image className="w-4 h-4 text-[#E91E63]" />;
    case 'css':
    case 'scss':
    case 'sass':
      return <FileCode className="w-4 h-4 text-[#CC6699]" />;
    case 'html':
      return <FileCode className="w-4 h-4 text-[#E34F26]" />;
    default:
      return <File className="w-4 h-4 text-slate-500" />;
  }
};

const getFrameworkIcon = (framework: string) => {
  switch (framework) {
    case 'React': return <SiReact className="w-5 h-5 text-[#61DAFB]" />;
    case 'Vue': return <SiVuedotjs className="w-5 h-5 text-[#4FC08D]" />;
    case 'Next.js': return <SiNextdotjs className="w-5 h-5 text-white" />;
    case 'Angular': return <SiAngular className="w-5 h-5 text-[#DD0031]" />;
    case 'Svelte': return <SiSvelte className="w-5 h-5 text-[#FF3E00]" />;
    default: return <Sparkles className="w-5 h-5 text-[#00F0FF]" />;
  }
};

function FileTree({ node, level = 0 }: { node: FileNode; level?: number }) {
  const [isOpen, setIsOpen] = useState(level < 2);
  
  if (node.type === 'file') {
    return (
      <div 
        className="flex items-center gap-2 py-1 px-2 hover:bg-[#00F0FF]/5 rounded text-sm"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {getFileIcon(node.name)}
        <span className="text-slate-300 truncate">{node.name}</span>
        {node.size && (
          <span className="text-xs text-slate-500 ml-auto">
            {node.size > 1024 ? `${(node.size / 1024).toFixed(1)}KB` : `${node.size}B`}
          </span>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <div 
        className="flex items-center gap-2 py-1 px-2 hover:bg-[#00F0FF]/5 rounded cursor-pointer text-sm"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        )}
        {isOpen ? (
          <FolderOpen className="w-4 h-4 text-[#00F0FF]" />
        ) : (
          <Folder className="w-4 h-4 text-[#00F0FF]" />
        )}
        <span className="text-slate-200 font-medium">{node.name}</span>
        {node.children && (
          <span className="text-xs text-slate-500">({node.children.length})</span>
        )}
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <FileTree key={`${child.path}-${idx}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ZipPreview({ file, onClose, onFrameworkDetected }: ZipPreviewProps) {
  const [tree, setTree] = useState<FileNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ files: 0, folders: 0, size: 0 });
  const [detectedFramework, setDetectedFramework] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    
    const analyzeZip = async () => {
      setLoading(true);
      try {
        const zip = await JSZip.loadAsync(file);
        const paths = Object.keys(zip.files);
        
        let fileCount = 0;
        let folderCount = 0;
        let totalSize = 0;
        let packageJson: any = null;
        
        const fileList = paths.filter(p => !zip.files[p].dir);
        for (const path of fileList) {
          const zipFile = zip.files[path];
          const content = await zipFile.async('uint8array');
          totalSize += content.length;
          
          if (path.endsWith('package.json') && !path.includes('node_modules')) {
            try {
              const text = await zipFile.async('text');
              packageJson = JSON.parse(text);
            } catch {}
          }
        }
        
        let framework: string | null = null;
        for (const [name, indicators] of Object.entries(FRAMEWORK_INDICATORS)) {
          const hasFile = indicators.files.some(f => 
            paths.some(p => p.endsWith(f) && !p.includes('node_modules'))
          );
          if (hasFile) {
            framework = name;
            break;
          }
          
          if (packageJson?.dependencies) {
            const hasDep = indicators.deps.some(d => packageJson.dependencies[d]);
            if (hasDep) {
              framework = name;
              break;
            }
          }
        }
        
        setDetectedFramework(framework);
        onFrameworkDetected?.(framework);

        const root: FileNode = { name: file.name.replace('.zip', ''), path: '', type: 'folder', children: [] };
        const folderMap = new Map<string, FileNode>();
        folderMap.set('', root);
        
        const sortedPaths = paths.sort();
        
        for (const path of sortedPaths) {
          const isDir = zip.files[path].dir;
          const parts = path.split('/').filter(p => p);
          
          let currentPath = '';
          let parent = root;
          
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isLast = i === parts.length - 1;
            const newPath = currentPath ? `${currentPath}/${part}` : part;
            
            if (isLast && !isDir) {
              const zipFile = zip.files[path];
              const content = await zipFile.async('uint8array');
              parent.children!.push({
                name: part,
                path: newPath,
                type: 'file',
                size: content.length
              });
              fileCount++;
            } else {
              if (!folderMap.has(newPath)) {
                const folder: FileNode = { name: part, path: newPath, type: 'folder', children: [] };
                folderMap.set(newPath, folder);
                parent.children!.push(folder);
                folderCount++;
              }
              parent = folderMap.get(newPath)!;
            }
            currentPath = newPath;
          }
        }
        
        const sortChildren = (node: FileNode) => {
          if (node.children) {
            node.children.sort((a, b) => {
              if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
              return a.name.localeCompare(b.name);
            });
            node.children.forEach(sortChildren);
          }
        };
        sortChildren(root);
        
        setTree(root);
        setStats({ files: fileCount, folders: folderCount, size: totalSize });
      } catch (error) {
        console.error('Error analyzing ZIP:', error);
      }
      setLoading(false);
    };
    
    analyzeZip();
  }, [file, onFrameworkDetected]);

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" data-testid="zip-preview-modal">
      <div className="bg-[#0A0E27] border border-[#00F0FF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#00F0FF]/10 to-[#00C853]/10 border-b border-[#00F0FF]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F0FF] to-[#00C853] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              <Package className="w-5 h-5 text-[#0A0E27]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{file.name}</h3>
              <p className="text-xs text-slate-400">
                {stats.files} files, {stats.folders} folders • {(stats.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          
          {detectedFramework && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0F1429] border border-[#00F0FF]/30 rounded-full">
              {getFrameworkIcon(detectedFramework)}
              <span className="text-sm text-[#00F0FF]" style={{textShadow: '0 0 10px rgba(0,240,255,0.5)'}}>
                {detectedFramework}
              </span>
            </div>
          )}
          
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
            data-testid="button-close-preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-[#00F0FF] border-t-transparent animate-spin" />
              <span className="ml-3 text-slate-400">Analyzing ZIP contents...</span>
            </div>
          ) : tree ? (
            <div className="font-mono text-sm">
              <FileTree node={tree} />
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              Failed to analyze ZIP file
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
