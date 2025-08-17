import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';

interface ImageAttrs {
  src?: string;
  alt?: string;
  title?: string;
  position?: 'start' | 'center' | 'end';
  width?: number;
}

const ImageComponent = (props: any) => {
  const { node, updateAttributes, selected } = props;
  const { src, alt, title, position = 'start', width } = node.attrs as ImageAttrs;

  const positionClasses = {
    start: 'justify-start',
    center: 'justify-center', 
    end: 'justify-end'
  };

  const handlePositionChange = (newPosition: 'start' | 'center' | 'end') => {
    updateAttributes({ position: newPosition });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const img = e.currentTarget.parentElement?.querySelector('img');
    if (!img) return;
    
    const startWidth = img.offsetWidth;
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(100, Math.min(800, startWidth + deltaX));
      updateAttributes({ width: newWidth });
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <NodeViewWrapper className={`flex ${positionClasses[position]} my-4`}>
      <div className="relative group">
        <img
          src={src}
          alt={alt || ''}
          title={title}
          className="rounded-lg max-w-full h-auto"
          style={{ width: width ? `${width}px` : undefined }}
        />
        
        {selected && (
          <div className="absolute top-2 right-2 flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handlePositionChange('start')}
              className={`p-2 transition-all hover:bg-muted ${
                position === 'start' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground'
              }`}
              title="Align left"
            >
              <div className="flex items-center justify-center text-xs font-bold">
                L
              </div>
            </button>
            
            <div className="h-8 w-px bg-border" />
            
            <button
              onClick={() => handlePositionChange('center')}
              className={`p-2 transition-all hover:bg-muted ${
                position === 'center' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground'
              }`}
              title="Align center"
            >
              <div className="flex items-center justify-center text-xs font-bold">
                C
              </div>
            </button>
            
            <div className="h-8 w-px bg-border" />
            
            <button
              onClick={() => handlePositionChange('end')}
              className={`p-2 transition-all hover:bg-muted ${
                position === 'end' 
                  ? 'bg-muted text-foreground' 
                  : 'text-muted-foreground'
              }`}
              title="Align right"
            >
              <div className="flex items-center justify-center text-xs font-bold">
                R
              </div>
            </button>
          </div>
        )}
        
        {selected && (
          <div 
            className="absolute bottom-2 right-2 w-4 h-4 bg-blue-500 rounded-full cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white shadow-lg"
            onMouseDown={handleResizeStart}
            title="Drag to resize"
          />
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const PositionableImage = Node.create({
  name: 'positionableImage',
  
  group: 'block',
  
  draggable: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      position: {
        default: 'start',
        parseHTML: element => element.getAttribute('data-position') || 'start',
        renderHTML: attributes => {
          if (!attributes.position) {
            return {};
          }
          return {
            'data-position': attributes.position,
          };
        },
      },
      width: {
        default: null,
        parseHTML: element => {
          const width = element.getAttribute('data-width');
          return width ? parseInt(width) : null;
        },
        renderHTML: attributes => {
          if (!attributes.width) {
            return {};
          }
          return {
            'data-width': attributes.width,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: element => {
          const img = element as HTMLImageElement;
          const widthAttr = img.getAttribute('data-width') || img.parentElement?.getAttribute('data-width');
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            position: img.getAttribute('data-position') || img.parentElement?.getAttribute('data-position') || 'start',
            width: widthAttr ? parseInt(widthAttr) : null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { position, width, ...attrs } = HTMLAttributes;
    const positionClasses = {
      start: 'flex justify-start',
      center: 'flex justify-center',
      end: 'flex justify-end'
    };
    
    const imgAttrs = mergeAttributes(attrs);
    if (width) {
      imgAttrs.style = `width: ${width}px;`;
    }
    
    return [
      'div', 
      { 
        class: `${positionClasses[position as keyof typeof positionClasses] || positionClasses.start} my-4`,
        'data-position': position,
        'data-width': width
      },
      ['img', imgAttrs]
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageComponent);
  },

  addCommands() {
    return {
      setImage: (options: { src: string; alt?: string; title?: string; position?: 'start' | 'center' | 'end' }) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
      updateImagePosition: (position: 'start' | 'center' | 'end') => ({ commands }) => {
        return commands.updateAttributes(this.name, { position });
      },
    };
  },
});