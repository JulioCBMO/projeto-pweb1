export interface Pergunta {
  id?: number;
  texto: string;
  categoria: string;
  dificuldade: string;
  alternativas: string[];
  correta: number;
  imagem?: string | null;
}