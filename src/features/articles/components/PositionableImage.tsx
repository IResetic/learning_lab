import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import React from 'react';

interface ImageAttrs {
  src?: string;
  alt?: string;
  title?: string;
  position?: 'start' | 'center' | 'end';
}

const ImageComponent = (props: any) => {
  const { node, updateAttributes, selected } = props;
  const { src, alt, title, position = 'start' } = node.attrs as ImageAttrs;

  const positionClasses = {
    start: 'justify-start',
    center: 'justify-center', 
    end: 'justify-end'
  };

  const handlePositionChange = (newPosition: 'start' | 'center' | 'end') => {
    updateAttributes({ position: newPosition });
  };

  return (
    <NodeViewWrapper className={`flex ${positionClasses[position]} my-4`}>
      <div className="relative group">
        <img
          src={src}
          alt={alt || ''}
          title={title}
          className="rounded-lg border border-muted max-w-full h-auto"
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
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: element => {
          const img = element as HTMLImageElement;
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            position: img.getAttribute('data-position') || 'start',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { position, ...attrs } = HTMLAttributes;
    const positionClasses = {
      start: 'flex justify-start',
      center: 'flex justify-center',
      end: 'flex justify-end'
    };
    
    return [
      'div', 
      { 
        class: `${positionClasses[position as keyof typeof positionClasses] || positionClasses.start} my-4`,
        'data-position': position 
      },
      ['img', mergeAttributes(attrs)]
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