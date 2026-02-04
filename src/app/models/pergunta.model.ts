export interface Pergunta {
  id?: number;
  enunciado: string; 
  categoria: string;
  dificuldade: string;
  alternativas: string[];
  correta: number;
  imagem?: string | null;
}