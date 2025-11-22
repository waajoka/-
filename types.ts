export interface Note {
  id: string;
  text: string;
  date: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
}

export interface TypewriterProps {
  onPrint: (text: string) => void;
  onMagicPrint: (text: string) => Promise<void>;
  isPrinting: boolean;
}

export interface CardProps {
  note: Note;
  onDelete: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onFocus: (id: string) => void;
}
