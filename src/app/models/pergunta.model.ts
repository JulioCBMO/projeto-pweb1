export interface Pergunta {
  id?: number;
  texto: string;
  categoria: string[] | null;
  dificuldade: string | null;
  alternativas: string[];
  correta: number;
  imagem?: string | null;
}